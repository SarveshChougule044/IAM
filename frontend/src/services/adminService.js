const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  console.log("RAW API RESPONSE STATUS:", response.status);
  console.log("RAW API RESPONSE DATA:", data);

  if (!response.ok) {
    throw new Error(
      data.message || data.debug || `Request failed with status ${response.status}`
    );
  }

  return data;
};

export const signupUser = async (payload) => {
  console.log("SIGNUP PAYLOAD:", payload);

  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
};

export const loginUser = async (payload) => {
  console.log("LOGIN PAYLOAD:", payload);

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
};