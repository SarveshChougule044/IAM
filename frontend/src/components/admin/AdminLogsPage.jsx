import { useEffect, useState } from "react";
import { getLogs } from "../../api/adminLogsApi";

function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const res = await getLogs();
        setLogs(res.data.logs || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load logs."
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
        <p style={{ color: "#9ca3af" }}>Loading activity logs...</p>
      </section>
    );
  }

  return (
    <section className="adm-dashboard">
      <header className="adm-dashboard__header">
        <h1>Activity logs</h1>
        <p>Track admin actions and key events.</p>
      </header>

      {error && <p className="adm-auth-error">{error}</p>}

      <div className="adm-panel">
        <header className="adm-panel__header">
          <div>
            <h3>Recent activity</h3>
            <p>{logs.length} log entries</p>
          </div>
        </header>

        <div className="adm-table">
          <div className="adm-table__head">
            <span>Time</span>
            <span>Actor</span>
            <span>Action</span>
            <span>Target</span>
            <span>IP</span>
          </div>

          {logs.map((log) => (
            <div key={log._id} className="adm-table__row">
              <span>
                {new Date(log.createdAt).toLocaleString()}
              </span>
              <span>{log.actor}</span>
              <span>{log.action}</span>
              <span>{log.target}</span>
              <span>{log.ip}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminLogsPage;