// frontend/src/services/assessmentService.js

// Use the same env-based base URL as authService
const API_BASE = import.meta.env.VITE_API_BASE;

async function handleResponse(response) {
  // Be safe if the body is empty (304, 204, etc.)
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Get assessment questions
export async function getQuestionnaire() {
  const response = await fetch(`${API_BASE}/api/assessment/questions`, {
    method: "GET",
    // Add headers/credentials if your backend expects auth
    // headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
}

// Submit assessment answers
export async function submitQuestionnaire(answers) {
  const response = await fetch(`${API_BASE}/api/assessment/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
    // headers: { Authorization: `Bearer ${token}` },
  });

  return handleResponse(response);
}