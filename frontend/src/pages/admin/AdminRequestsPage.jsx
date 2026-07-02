// frontend/src/pages/admin/AdminRequestsPage.jsx
import { useEffect, useState } from "react";
import { getRequests, updateRequestStatus } from "../../api/adminRequestsApi";
import "../../styles/admin-dashboard.css";

function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getRequests();
      setRequests(res.data.requests || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load access requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    setSavingId(id);
    setError("");

    try {
      await updateRequestStatus(id, status);
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status } : r
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update request decision."
      );
    } finally {
      setSavingId(null);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const q = searchQuery.toLowerCase();
    return (
      (req.userName && req.userName.toLowerCase().includes(q)) ||
      (req.userEmail && req.userEmail.toLowerCase().includes(q)) ||
      (req.type && req.type.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <section className="adm-dashboard">
        <p style={{ color: "#a1a1aa" }}>Loading access requests...</p>
      </section>
    );
  }

  return (
    <section className="adm-dashboard">
      <header className="adm-dashboard__header">
        <h1>Access Requests</h1>
        <p>Review and act on user access and elevation requests in real time.</p>
      </header>

      {error && <p className="adm-auth-error">{error}</p>}

      <div className="adm-panel">
        <header className="adm-panel__header">
          <div>
            <h3>Pending Decisions</h3>
            <p>
              Showing {filteredRequests.length} of {requests.length} total entries
            </p>
          </div>
        </header>

        <div className="adm-toolbar">
          <input
            type="text"
            className="adm-search-input"
            placeholder="Search requests by user name, email, or request type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredRequests.length === 0 ? (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              padding: "2rem 0",
              textAlign: "center",
            }}
          >
            No access requests found matching your query.
          </p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>User Account</th>
                <th>Requested Resource</th>
                <th>Status</th>
                <th>Created</th>
                <th>Decisions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req._id}>
                  <td>
                    <span className="adm-cell-main">{req.userName}</span>
                    <span className="adm-cell-sub">{req.userEmail}</span>
                  </td>
                  <td>
                    <span className="adm-cell-main">{req.type}</span>
                    {req.details && (
                      <span className="adm-cell-sub" style={{ color: "var(--text-muted)" }}>
                        {req.details}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`adm-status adm-status--${req.status}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    <span className="adm-cell-sub">
                      {new Date(req.createdAt).toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="adm-btn adm-btn--success"
                        disabled={
                          savingId === req._id || req.status !== "pending"
                        }
                        onClick={() =>
                          handleStatusChange(req._id, "approved")
                        }
                      >
                        {savingId === req._id && req.status !== "approved"
                          ? "..."
                          : "Approve"}
                      </button>
                      <button
                        className="adm-btn adm-btn--danger"
                        disabled={
                          savingId === req._id || req.status !== "pending"
                        }
                        onClick={() =>
                          handleStatusChange(req._id, "denied")
                        }
                      >
                        {savingId === req._id && req.status !== "denied"
                          ? "..."
                          : "Deny"}
                      </button>
                    </div>
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

export default AdminRequestsPage;