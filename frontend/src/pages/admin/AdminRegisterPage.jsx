// frontend/src/pages/admin/AdminRegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdmin } from "../../api/adminAuthApi";
import "../../styles/admin-dashboard.css";

function AdminRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successId, setSuccessId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessId("");
    setLoading(true);

    try {
      const res = await registerAdmin({ name, email, password });
      const { adminId } = res.data;

      setSuccessId(adminId);

      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try a different email address."
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
        <h1>Create Admin Profile</h1>
        <p className="adm-auth-subtitle">
          Register administrative credentials to oversee and configure IAMShield.
        </p>

        {error && <p className="adm-auth-error">{error}</p>}
        {successId && (
          <p className="adm-auth-success">
            Admin Profile Provisioned! ID: <strong>{successId}</strong>
          </p>
        )}

        <label>
          <span>Full Name</span>
          <input
            type="text"
            value={name}
            placeholder="John Doe"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Email Address</span>
          <input
            type="email"
            value={email}
            placeholder="john@iamshield.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            placeholder="••••••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button className="adm-auth-btn" type="submit" disabled={loading}>
          {loading ? "Provisioning Profile..." : "Register Profile"}
        </button>

        <p className="adm-auth-footer">
          Already registered? <a href="/admin/login">Log in here</a>
        </p>
      </form>
    </div>
  );
}

export default AdminRegisterPage;