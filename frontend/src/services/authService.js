// frontend/src/services/authService.js
const API_BASE = import.meta.env.VITE_API_BASE;

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// Auth: signup & login
export const signupUser = async (payload) => {
  const response = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const loginUser = async (payload) => {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};




// Forgot password

export const sendForgotPasswordOtp = async (email) => {
  const response = await fetch("/api/auth/forgot-password/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return parseResponse(response);
};

export const verifyForgotPasswordOtp = async (email, otp) => {
  const response = await fetch("/api/auth/forgot-password/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  return parseResponse(response);
};

export const resetPasswordWithOtp = async (
  email,
  otp,
  password,
  confirmPassword
) => {
  const response = await fetch(
    "/api/auth/forgot-password/reset-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, password, confirmPassword }),
    }
  );

  return parseResponse(response);
};

// Google login

export const loginWithGoogle = async (credential) => {
  const response = await fetch("/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ credential }),
  });

  return parseResponse(response);
};

export async function sendOtp(email) {
  const response = await fetch("http://localhost:5000/api/auth/forgot-password/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send OTP");
  }

  return response.json();
}
