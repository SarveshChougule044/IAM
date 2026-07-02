// frontend/src/api/adminAuthApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

// register admin
export const registerAdmin = (data) => api.post("/register", data);

// login admin
export const loginAdmin = (data) => api.post("/login", data);

// list admins
export const getAdmins = () => {
  const token = localStorage.getItem("adminToken");
  return api.get("/list", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// list regular users
export const getRegularUsers = () => {
  const token = localStorage.getItem("adminToken");
  return api.get("/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// toggle active status of a user
export const toggleUserStatus = (id) => {
  const token = localStorage.getItem("adminToken");
  return api.put(`/users/${id}/toggle`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};