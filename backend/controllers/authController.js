// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { v4: uuidv4 } = require("uuid");
const { findOne, insertOne, updateOne } = require("../utils/fileStore");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

const USERS_FILE = "users.json";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeUid() {
  return `usr_${uuidv4().replace(/-/g, "").slice(0, 16)}`;
}

function publicProfile(user) {
  return {
    uid: user.uid,
    fullName: user.fullName,
    email: user.email,
    company: user.company || null,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
  };
}

function isStrongPassword(password) {
  // At least 8 chars, one uppercase, one lowercase, one number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

// Simple in-memory lock map to prevent race conditions on signup per-email
const signupLocks = new Set();

// ─── Signup ───────────────────────────────────────────────────────────────────

const signup = async (req, res) => {
  const normalizedEmail = (req.body.email || "").toLowerCase().trim();

  try {
    const { fullName, password, company } = req.body;

    if (!fullName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required",
      });
    }

    if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      return res.status(400).json({
        success: false,
        message: "Username must not contain numbers or special characters",
      });
    }

    // Race condition guard — reject concurrent signups for the same email
    if (signupLocks.has(normalizedEmail)) {
      return res.status(409).json({ success: false, message: "Signup already in progress for this email" });
    }
    signupLocks.add(normalizedEmail);

    try {
      const existing = findOne(USERS_FILE, (u) => u.email === normalizedEmail);
      if (existing) {
        // Generic message — avoids confirming whether email is registered
        return res.status(400).json({
          success: false,
          message: "Unable to create account with the provided details",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const now = new Date().toISOString();
      const user = {
        uid: makeUid(),
        fullName: fullName.trim(),
        email: normalizedEmail,
        company: company?.trim() || null,
        passwordHash,
        role: "member", // hardcoded — never trust client-supplied role
        isActive: true,
        isEmailVerified: false,
        passwordResetOtp: null,
        passwordResetOtpExpiry: null,
        lastLogin: null,
        loginCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      insertOne(USERS_FILE, user);

      return res.status(201).json({
        success: true,
        message: "Account created successfully",
        user: publicProfile(user),
      });
    } finally {
      signupLocks.delete(normalizedEmail);
    }
  } catch (error) {
    console.error("SIGNUP ERROR:", error.message);
    return res.status(500).json({ success: false, message: "Signup failed" });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = findOne(USERS_FILE, (u) => u.email === normalizedEmail);

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account is inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    updateOne(
      USERS_FILE,
      (u) => u.uid === user.uid,
      (u) => ({ lastLogin: new Date().toISOString(), loginCount: (u.loginCount || 0) + 1 })
    );

    const token = jwt.sign(
      { id: user.uid, uid: user.uid, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: publicProfile(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

// ─── Forgot Password — Send OTP ───────────────────────────────────────────────

const otpRequestTimestamps = new Map(); // email -> last request time

const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Per-email cooldown — 60 seconds between OTP requests
    const lastRequest = otpRequestTimestamps.get(normalizedEmail);
    if (lastRequest && Date.now() - lastRequest < 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP",
      });
    }

    const user = findOne(USERS_FILE, (u) => u.email === normalizedEmail);

    if (user) {
      const otp = generateOtp();
      const expiry = new Date(
        Date.now() + Number(process.env.OTP_EXPIRES_MINUTES || 10) * 60 * 1000
      ).toISOString();

      updateOne(
        USERS_FILE,
        (u) => u.uid === user.uid,
        () => ({ passwordResetOtp: otp, passwordResetOtpExpiry: expiry, otpAttempts: 0 })
      );

      otpRequestTimestamps.set(normalizedEmail, Date.now());

      await sendEmail({
        to: user.email,
        subject: "IAMShield Password Reset OTP",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #111827;">
            <h2 style="margin-bottom: 12px;">Password Reset Verification Code</h2>
            <p style="margin-bottom: 16px;">Use this one-time code to reset your password:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background: #f3f4f6; padding: 16px 24px; border-radius: 8px; display: inline-block;">
              ${otp}
            </div>
            <p style="margin-top: 18px;">This code will expire in ${process.env.OTP_EXPIRES_MINUTES || 10} minutes.</p>
            <p>If you did not request this, you can safely ignore this email.</p>
          </div>
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: "If the email exists, a verification code has been sent",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error.message);
    return res.status(500).json({ success: false, message: "Failed to process forgot password request" });
  }
};

// ─── Forgot Password — Verify OTP ─────────────────────────────────────────────

const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = findOne(USERS_FILE, (u) => u.email === normalizedEmail);

    if (!user || !user.passwordResetOtp || !user.passwordResetOtpExpiry) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Limit OTP guess attempts — max 5 tries
    const attempts = (user.otpAttempts || 0) + 1;
    if (attempts > 5) {
      updateOne(USERS_FILE, (u) => u.uid === user.uid, () => ({
        passwordResetOtp: null,
        passwordResetOtpExpiry: null,
        otpAttempts: 0,
      }));
      return res.status(429).json({ success: false, message: "Too many attempts. Please request a new OTP." });
    }

    if (user.passwordResetOtp !== otp.trim()) {
      updateOne(USERS_FILE, (u) => u.uid === user.uid, () => ({ otpAttempts: attempts }));
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date(user.passwordResetOtpExpiry) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error.message);
    return res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

// ─── Forgot Password — Reset ───────────────────────────────────────────────────

const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = findOne(USERS_FILE, (u) => u.email === normalizedEmail);

    if (!user || !user.passwordResetOtp || !user.passwordResetOtpExpiry) {
      return res.status(400).json({ success: false, message: "Invalid reset request" });
    }

    if (user.passwordResetOtp !== otp.trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date(user.passwordResetOtpExpiry) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    updateOne(
      USERS_FILE,
      (u) => u.uid === user.uid,
      () => ({ passwordHash, passwordResetOtp: null, passwordResetOtpExpiry: null, otpAttempts: 0 })
    );

    return res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error.message);
    return res.status(500).json({ success: false, message: "Password reset failed" });
  }
};

// ─── Google Auth ──────────────────────────────────────────────────────────────

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: "Google credential is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    const normalizedEmail = email.toLowerCase().trim();
    let user = findOne(USERS_FILE, (u) => u.email === normalizedEmail);

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);
      const now = new Date().toISOString();

      user = {
        uid: makeUid(),
        fullName: name,
        email: normalizedEmail,
        company: null,
        passwordHash,
        role: "member",
        isActive: true,
        isEmailVerified: true,
        passwordResetOtp: null,
        passwordResetOtpExpiry: null,
        lastLogin: now,
        loginCount: 1,
        createdAt: now,
        updatedAt: now,
      };

      insertOne(USERS_FILE, user);
    } else {
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: "Account is inactive" });
      }
      updateOne(
        USERS_FILE,
        (u) => u.uid === user.uid,
        (u) => ({ lastLogin: new Date().toISOString(), loginCount: (u.loginCount || 0) + 1 })
      );
    }

    const token = jwt.sign(
      { id: user.uid, uid: user.uid, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Google Login successful",
      token,
      user: publicProfile(user),
    });
  } catch (error) {
    console.error("GOOGLE AUTH ERROR:", error.message);
    return res.status(500).json({ success: false, message: "Google Authentication failed" });
  }
};

module.exports = {
  signup,
  login,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPasswordWithOtp,
  googleAuth,
};