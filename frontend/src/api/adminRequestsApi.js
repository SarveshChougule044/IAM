import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/admin/requests",
});

const authHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getRequests = () =>
  api.get("/", { headers: authHeaders() });

export const updateRequestStatus = (id, status) =>
  api.put(
    `/${id}`,
    { status },
    { headers: authHeaders() }
  );