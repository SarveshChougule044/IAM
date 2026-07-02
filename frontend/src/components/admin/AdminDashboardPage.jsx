// src/pages/admin/AdminDashboardPage.jsx
import { useEffect, useState } from "react";
import { getAdminStats } from "../../api/adminDashboardApi";

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAssessments: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard stats."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <section className="adm-dashboard">
        <p style={{ color: "#9ca3af" }}>Loading dashboard...</p>
      </section>
    );
  }

  return (
    <section className="adm-dashboard">
      <header className="adm-dashboard__header">
        <h1>Admin dashboard</h1>
        <p>Overview of IAMShield usage and admin activity.</p>
      </header>

      {error && <p className="adm-auth-error">{error}</p>}

      <div className="adm-panels adm-panels--grid">
        <div className="adm-panel">
          <h3>Total users</h3>
          <p className="adm-metric">{stats.totalUsers}</p>
        </div>
        <div className="adm-panel">
          <h3>Total assessments</h3>
          <p className="adm-metric">{stats.totalAssessments}</p>
        </div>
        <div className="adm-panel">
          <h3>Total admins</h3>
          <p className="adm-metric">{stats.totalAdmins}</p>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboardPage;