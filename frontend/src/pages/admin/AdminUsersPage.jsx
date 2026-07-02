// frontend/src/pages/admin/AdminUsersPage.jsx
import { useEffect, useState } from "react";
import { getAdmins, getRegularUsers, toggleUserStatus } from "../../api/adminAuthApi";
import "../../styles/admin-dashboard.css";

function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState("users"); // "users" or "admins"
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null); // tracking individual toggle active status action
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [adminsRes, usersRes] = await Promise.all([
        getAdmins(),
        getRegularUsers(),
      ]);
      setAdmins(adminsRes.data.admins || []);
      setUsers(usersRes.data.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load accounts. Try reloading."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (userId) => {
    setActioningId(userId);
    setError("");
    try {
      const res = await toggleUserStatus(userId);
      // update user locally
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isActive: res.data.user.isActive } : u))
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update user account status."
      );
    } finally {
      setActioningId(null);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredAdmins = admins.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.email && a.email.toLowerCase().includes(q))
    );
  });

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <section className="adm-dashboard">
        <p style={{ color: "#a1a1aa" }}>Loading account records...</p>
      </section>
    );
  }

  return (
    <section className="adm-dashboard">
      <header className="adm-dashboard__header">
        <h1>Identities & Accounts</h1>
        <p>Manage administrative roles and user access credentials.</p>
      </header>

      {error && <p className="adm-auth-error">{error}</p>}

      <div className="adm-tabs">
        <button
          className={`adm-tab-btn ${activeTab === "users" ? "adm-tab-btn--active" : ""}`}
          onClick={() => {
            setActiveTab("users");
            setSearchQuery("");
          }}
        >
          Regular Users ({users.length})
        </button>
        <button
          className={`adm-tab-btn ${activeTab === "admins" ? "adm-tab-btn--active" : ""}`}
          onClick={() => {
            setActiveTab("admins");
            setSearchQuery("");
          }}
        >
          Admin Accounts ({admins.length})
        </button>
      </div>

      <div className="adm-panel">
        <div className="adm-toolbar">
          <input
            type="text"
            className="adm-search-input"
            placeholder={
              activeTab === "users"
                ? "Search users by name or email..."
                : "Search admins by name or email..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {activeTab === "users" ? (
          filteredUsers.length === 0 ? (
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                padding: "2rem 0",
                textAlign: "center",
              }}
            >
              No user accounts found.
            </p>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact Email</th>
                  <th>System Role</th>
                  <th>Status</th>
                  <th>Last Session</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="adm-table-avatar-cell">
                        <div className="adm-table-avatar">
                          {getInitials(user.fullName || "User")}
                        </div>
                        <div>
                          <span className="adm-cell-main">{user.fullName}</span>
                          <span className="adm-cell-sub">
                            Registered {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="adm-cell-main">{user.email}</span>
                    </td>
                    <td>
                      <span
                        className="adm-status"
                        style={{ background: "rgba(255, 255, 255, 0.03)", color: "var(--text-main)" }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`adm-status ${user.isActive ? "adm-status--active" : "adm-status--inactive"}`}
                      >
                        {user.isActive ? "active" : "disabled"}
                      </span>
                    </td>
                    <td>
                      <span className="adm-cell-sub">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleString()
                          : "Never"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        className={`adm-btn ${user.isActive ? "adm-btn--danger" : "adm-btn--success"}`}
                        disabled={actioningId === user._id}
                      >
                        {actioningId === user._id
                          ? "Loading..."
                          : user.isActive
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : filteredAdmins.length === 0 ? (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              padding: "2rem 0",
              textAlign: "center",
            }}
          >
            No admin accounts found.
          </p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Administrator Name</th>
                <th>Access Email</th>
                <th>System Role</th>
                <th>Created Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin._id}>
                  <td>
                    <div className="adm-table-avatar-cell">
                      <div
                        className="adm-table-avatar"
                        style={{ color: "var(--accent-primary)", borderColor: "rgba(139, 92, 246, 0.2)" }}
                      >
                        {getInitials(admin.name || "Admin")}
                      </div>
                      <div>
                        <span className="adm-cell-main">{admin.name}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="adm-cell-main">{admin.email}</span>
                  </td>
                  <td>
                    <span
                      className="adm-status"
                      style={{ background: "rgba(139, 92, 246, 0.1)", color: "var(--accent-primary)" }}
                    >
                      {admin.role}
                    </span>
                  </td>
                  <td>
                    <span className="adm-cell-sub">
                      {new Date(admin.createdAt).toLocaleString()}
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

export default AdminUsersPage;