// frontend/src/pages/admin/AdminLoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/adminAuthApi";
import "../../styles/admin-dashboard.css";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginAdmin({ email, password });
      const { token, admin } = res.data;

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminId", admin.adminId);
      localStorage.setItem("adminName", admin.name);
      localStorage.setItem("adminEmail", admin.email);
      localStorage.setItem("adminRole", admin.role || "admin");

      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-auth-shell">
      <form className="adm-auth-card" onSubmit={handleSubmit}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
          <div className="adm-logo" style={{ width: "48px", height: "48px", borderRadius: "14px", fontSize: "1.3rem" }}>
            IS
          </div>
        </div>
        <h1>Admin Portal</h1>
        <p className="adm-auth-subtitle">
          Sign in to access the IAMShield control center and review requests.
        </p>

        {error && <p className="adm-auth-error">{error}</p>}

        <label>
          <span>Email Address</span>
          <input
            type="email"
            value={email}
            placeholder="admin@iamshield.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Secret Password</span>
          <input
            type="password"
            value={password}
            placeholder="••••••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button className="adm-auth-btn" type="submit" disabled={loading}>
          {loading ? "Verifying Credentials..." : "Authenticate"}
        </button>

        <p className="adm-auth-footer">
          Require access? <a href="/admin/register">Register an admin account</a>
        </p>
      </form>
    </div>
  );
}

export default AdminLoginPage;