// frontend/src/services/assessmentService.js
const API_BASE_URL = "http://localhost:5000/api/assessment";

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

export async function getQuestionnaire() {
  const response = await fetch(`${API_BASE_URL}/questions`);
  return handleResponse(response);
}

export async function submitQuestionnaire(answers) {
  const response = await fetch(`${API_BASE_URL}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  return handleResponse(response);
}