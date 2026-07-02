// src/pages/admin/AdminDashboardPage.jsx
import { useEffect, useState } from "react";
import { getAdminStats } from "../../api/adminDashboardApi";
import { getRequests } from "../../api/adminRequestsApi";
import { getLogs } from "../../api/adminLogsApi";
import "../../styles/admin-dashboard.css";

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, requestsRes, logsRes] = await Promise.all([
          getAdminStats(),
          getRequests(),
          getLogs(),
        ]);

        setStats(statsRes.data);
        setRequests(requestsRes.data.requests || []);
        setLogs(logsRes.data.logs || []);
      } catch (err) {
        console.error("Dashboard data load error:", err);
        setError("Failed to load dashboard data. Please verify your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        className="adm-dashboard"
        style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}
      >
        <p style={{ color: "#a1a1aa", fontSize: "1.1rem" }}>
          Loading dashboard analytics...
        </p>
      </div>
    );
  }

  const totalIdentities = (stats?.totalUsers || 0) + (stats?.totalAdmins || 0);
  const totalReq = stats?.totalRequests || 0;
  const reviewedReq =
    (stats?.approvedRequests || 0) + (stats?.deniedRequests || 0);
  const completionRate =
    totalReq > 0 ? Math.round((reviewedReq / totalReq) * 100) : 100;

  const cards = [
    {
      title: "Total Identities",
      value: totalIdentities,
      hint: `${stats?.totalUsers || 0} Members · ${stats?.totalAdmins || 0} Admins`,
      colorClass: "adm-card--accent-purple",
      icon: "👥",
      progress: 100,
      progressBarColor: "var(--accent-primary)",
    },
    {
      title: "Pending Approvals",
      value: stats?.pendingRequests || 0,
      hint: "Access decisions in queue",
      colorClass: "adm-card--accent-cyan",
      icon: "⏳",
      progress:
        totalReq > 0
          ? Math.round(((stats?.pendingRequests || 0) / totalReq) * 100)
          : 0,
      progressBarColor: "var(--accent-secondary)",
    },
    {
      title: "Request Action Rate",
      value: `${completionRate}%`,
      hint: `${reviewedReq} of ${totalReq} requests handled`,
      colorClass: "adm-card--accent-green",
      icon: "✅",
      progress: completionRate,
      progressBarColor: "var(--accent-success)",
    },
    {
      title: "Security Audit Events",
      value: stats?.totalLogs || 0,
      hint: "Tracked in activity ledger",
      colorClass: "adm-card--accent-red",
      icon: "🛡️",
      progress: 100,
      progressBarColor: "var(--accent-danger)",
    },
  ];

  // Get recent 3 requests that are pending
  const recentPending = requests
    .filter((r) => r.status === "pending")
    .slice(0, 3);

  // Get recent 3 admin activity logs
  const recentLogs = logs.slice(0, 3);

  return (
    <section className="adm-dashboard">
      <header className="adm-dashboard__header">
        <h1>Overview</h1>
        <p>Monitor security parameters, identity metrics, and access decisions.</p>
      </header>

      {error && <p className="adm-auth-error">{error}</p>}

      <section className="adm-cards">
        {cards.map((card, idx) => (
          <article key={idx} className={`adm-card ${card.colorClass}`}>
            <div className="adm-card__header">
              <span className="adm-card__label">{card.title}</span>
              <span className="adm-card__icon-wrapper">{card.icon}</span>
            </div>
            <h2 className="adm-card__value">{card.value}</h2>
            <p className="adm-card__hint">{card.hint}</p>
            <div className="adm-card__progress-track">
              <div
                className="adm-card__progress-bar"
                style={{
                  width: `${card.progress}%`,
                  backgroundColor: card.progressBarColor,
                }}
              ></div>
            </div>
          </article>
        ))}
      </section>

      <section className="adm-panels">
        <article className="adm-panel">
          <header className="adm-panel__header">
            <div>
              <h3>Recent Access Requests</h3>
              <p>Requests waiting for administrative review.</p>
            </div>
            <a
              href="/admin/requests"
              style={{
                fontSize: "0.85rem",
                color: "var(--accent-secondary)",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              View All →
            </a>
          </header>

          {recentPending.length === 0 ? (
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                padding: "1rem 0",
              }}
            >
              🎉 No pending access requests in queue.
            </p>
          ) : (
            <div className="adm-timeline" style={{ marginTop: "0.5rem" }}>
              {recentPending.map((req) => (
                <div key={req._id} className="adm-timeline-item">
                  <div className="adm-timeline-icon">🔑</div>
                  <div className="adm-timeline-content">
                    <span className="adm-timeline-title">
                      <strong>{req.userName}</strong> requested{" "}
                      <strong>{req.type}</strong>
                    </span>
                    {req.details && (
                      <span
                        className="adm-timeline-time"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Details: {req.details}
                      </span>
                    )}
                    <span className="adm-timeline-time">
                      {new Date(req.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="adm-panel">
          <header className="adm-panel__header">
            <div>
              <h3>Admin Action Ledger</h3>
              <p>Security events and account updates.</p>
            </div>
            <a
              href="/admin/logs"
              style={{
                fontSize: "0.85rem",
                color: "var(--accent-secondary)",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              View All →
            </a>
          </header>

          {recentLogs.length === 0 ? (
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                padding: "1rem 0",
              }}
            >
              No recent activity logs recorded.
            </p>
          ) : (
            <div className="adm-timeline" style={{ marginTop: "0.5rem" }}>
              {recentLogs.map((log) => (
                <div key={log._id} className="adm-timeline-item">
                  <div className="adm-timeline-icon">🛡️</div>
                  <div className="adm-timeline-content">
                    <span className="adm-timeline-title">
                      {log.action}
                    </span>
                    <span
                      className="adm-timeline-time"
                      style={{ color: "var(--accent-secondary)" }}
                    >
                      Target: {log.target} {log.ip && `(IP: ${log.ip})`}
                    </span>
                    <span className="adm-timeline-time">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </section>
  );
}

export default AdminDashboardPage;