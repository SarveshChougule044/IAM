// frontend/src/pages/admin/AdminLogsPage.jsx
import { useEffect, useState } from "react";
import { getLogs } from "../../api/adminLogsApi";
import "../../styles/admin-dashboard.css";

function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const res = await getLogs();
        setLogs(res.data.logs || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load activity logs."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const query = searchQuery.toLowerCase();
    return (
      (log.actor && log.actor.toLowerCase().includes(query)) ||
      (log.action && log.action.toLowerCase().includes(query)) ||
      (log.target && log.target.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <section className="adm-dashboard">
        <p style={{ color: "#a1a1aa" }}>Loading activity logs...</p>
      </section>
    );
  }

  return (
    <section className="adm-dashboard">
      <header className="adm-dashboard__header">
        <h1>Activity Logs</h1>
        <p>Track administrator actions and security audit entries in real time.</p>
      </header>

      {error && <p className="adm-auth-error">{error}</p>}

      <div className="adm-panel">
        <header className="adm-panel__header">
          <div>
            <h3>Audit Logs Ledger</h3>
            <p>
              Showing {filteredLogs.length} of {logs.length} entries
            </p>
          </div>
        </header>

        <div className="adm-toolbar">
          <input
            type="text"
            className="adm-search-input"
            placeholder="Search logs by actor, action, or target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredLogs.length === 0 ? (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              padding: "1.5rem 0",
              textAlign: "center",
            }}
          >
            No matching log entries found.
          </p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log._id}>
                  <td>
                    <span className="adm-cell-main">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                    <span className="adm-cell-sub">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td>
                    <span className="adm-cell-main">{log.actor}</span>
                  </td>
                  <td>
                    <span className="adm-cell-main">{log.action}</span>
                  </td>
                  <td>
                    <span className="adm-cell-main">{log.target}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>
                      {log.ip || "System"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default AdminLogsPage;