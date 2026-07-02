import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPasswordWithOtp,
} from "../services/authService";
import "../styles/auth.css";

function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const maskedEmail = useMemo(() => {
    if (!formData.email.includes("@")) return formData.email;
    const [name, domain] = formData.email.split("@");
    const safeName =
      name.length <= 2 ? `${name[0] || ""}*` : `${name.slice(0, 2)}***`;
    return `${safeName}@${domain}`;
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "otp") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, otp: onlyDigits }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!formData.email) return toast.error("Please enter your email");

    try {
      setLoading(true);
      const res = await sendForgotPasswordOtp(formData.email);
      toast.success(res.message || "Verification code sent");
      setStep(2);
    } catch (err) {
      toast.error(err.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (formData.otp.length < 6) return toast.error("Please enter a 6-digit code");

    try {
      setLoading(true);
      const res = await verifyForgotPasswordOtp(formData.email, formData.otp);
      toast.success(res.message || "OTP verified");
      setStep(3);
    } catch (err) {
      toast.error(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (formData.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    try {
      setLoading(true);
      const res = await resetPasswordWithOtp(
        formData.email,
        formData.otp,
        formData.password,
        formData.confirmPassword
      );
      toast.success(res.message || "Password reset successful");
      setStep(4);
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-shell auth-shell--forgot">
      <div className="auth-shell__glow auth-shell__glow--one"></div>
      <div className="auth-shell__glow auth-shell__glow--two"></div>

      <div className="auth-layout">
        <div className="auth-showcase">
          <div className="auth-badge">
            <span className="status-dot"></span>
            Secure recovery for enterprise access
          </div>

          <h1 className="auth-title">
            Recover access <br />
            with verified <br />
            email security.
          </h1>

          <p className="auth-description">
            IAMShield uses a guided recovery flow with email verification codes,
            controlled validation, and secure password reset steps for protected accounts.
          </p>

          <div className="auth-highlights">
            <div className="auth-highlight-card">
              <span className="auth-highlight-number">Step 1</span>
              <span className="auth-highlight-label">Send a one-time verification code</span>
            </div>

            <div className="auth-highlight-card">
              <span className="auth-highlight-number">Step 2</span>
              <span className="auth-highlight-label">Verify the code from your email inbox</span>
            </div>

            <div className="auth-highlight-card">
              <span className="auth-highlight-number">Step 3</span>
              <span className="auth-highlight-label">Create a strong new password securely</span>
            </div>
          </div>

          <div className="auth-points">
            <div className="auth-point">Verification-aware password recovery flow</div>
            <div className="auth-point">Reduced risk from unauthorized reset attempts</div>
            <div className="auth-point">Clear step-by-step experience for users</div>
          </div>
        </div>

        <div className="auth-panel-wrap">
          <div className="auth-panel">
            <div className="auth-panel__header">
              <p className="auth-eyebrow">Password recovery</p>
              <h2>
                {step === 1 && "Forgot your password?"}
                {step === 2 && "Enter verification code"}
                {step === 3 && "Reset your password"}
                {step === 4 && "Password updated"}
              </h2>
              <p className="auth-panel__subtext">
                {step === 1 &&
                  "Enter your registered email address to receive a one-time verification code."}
                {step === 2 &&
                  "We sent a 6-digit code to your email. Enter it below to continue securely."}
                {step === 3 &&
                  "Create a strong new password for your account and confirm it below."}
                {step === 4 &&
                  "Your password has been reset successfully. You can now sign in with your new password."}
              </p>
            </div>

            <div className="auth-stepper">
              <div className={`auth-step ${step >= 1 ? "active" : ""}`}>Email</div>
              <div className={`auth-step ${step >= 2 ? "active" : ""}`}>Verify</div>
              <div className={`auth-step ${step >= 3 ? "active" : ""}`}>Reset</div>
            </div>

            {step === 1 && (
              <form className="auth-form" onSubmit={handleSendCode}>
                <div className="auth-field">
                  <label htmlFor="email">Work Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="auth-btn auth-btn--primary">
                  Send verification code
                </button>

                <div className="auth-support-note">
                  We’ll send a one-time code to your registered email address. For security,
                  the code will expire after a short time.
                </div>

                <p className="auth-footer">
                  Remembered your password? <Link to="/login">Back to Sign in →</Link>
                </p>
              </form>
            )}

            {step === 2 && (
              <form className="auth-form" onSubmit={handleVerifyCode}>
                <div className="auth-code-banner">
                  Verification code sent to <strong>{maskedEmail || "your email"}</strong>
                </div>

                <div className="auth-field">
                  <label htmlFor="otp">6-Digit Verification Code</label>
                  <input
                    id="otp"
                    type="text"
                    name="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Enter 6-digit code"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength={6}
                    required
                  />
                </div>

                <button type="submit" className="auth-btn auth-btn--primary">
                  Verify code
                </button>

                <div className="auth-form__meta auth-form__meta--stack">
                  <button
                    type="button"
                    className="auth-inline-btn"
                    onClick={() => setStep(1)}
                  >
                    Change email
                  </button>

                  <button
                    type="button"
                    className="auth-inline-btn"
                    onClick={() => setStep(2)}
                  >
                    Resend code
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form className="auth-form" onSubmit={handleResetPassword}>
                <div className="auth-field">
                  <label htmlFor="password">New Password</label>
                  <div className="auth-input-wrap">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a new password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="auth-input-action"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="auth-input-wrap">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="auth-input-action"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="auth-password-hints">
                  <span>Use at least 8 characters</span>
                  <span>Include letters, numbers, and symbols</span>
                  <span>Avoid reusing old passwords</span>
                </div>

                <button type="submit" className="auth-btn auth-btn--primary">
                  Reset password
                </button>
              </form>
            )}

            {step === 4 && (
              <div className="auth-success">
                <div className="auth-success__icon">✓</div>
                <p className="auth-eyebrow">Recovery complete</p>
                <h2>Password reset successful</h2>
                <p className="auth-panel__subtext">
                  Your account password has been updated successfully for{" "}
                  <strong>{maskedEmail || "your account"}</strong>.
                </p>

                <div className="auth-success__box">
                  You can now return to sign in and access your account using the new password.
                </div>

                <div className="auth-success__actions">
                  <Link to="/login" className="auth-btn auth-btn--return-signin">
                    Return to Sign in
                  </Link>
                  <button
                    type="button"
                    className="auth-btn auth-btn--start-again"
                    onClick={() => {
                      setStep(1);
                      setFormData({
                        email: "",
                        otp: "",
                        password: "",
                        confirmPassword: "",
                      });
                    }}
                  >
                    Start again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;