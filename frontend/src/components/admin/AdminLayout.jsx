// frontend/src/components/admin/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../styles/admin-dashboard.css";

function AdminLayout() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("adminName") || "Admin User";
  const adminRole = localStorage.getItem("adminRole") || "Administrator";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminRole");
    navigate("/admin/login");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <div>
          <div className="adm-sidebar__brand">
            <div className="adm-logo">IS</div>
            <div>
              <div className="adm-eyebrow">IAMShield</div>
              <div className="adm-brand-title">Admin Console</div>
            </div>
          </div>

          <nav className="adm-nav">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                isActive ? "adm-nav__link adm-nav__link--active" : "adm-nav__link"
              }
            >
              <span>📊</span> Overview
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? "adm-nav__link adm-nav__link--active" : "adm-nav__link"
              }
            >
              <span>👥</span> Users & Admins
            </NavLink>

            <NavLink
              to="/admin/requests"
              className={({ isActive }) =>
                isActive ? "adm-nav__link adm-nav__link--active" : "adm-nav__link"
              }
            >
              <span>🔑</span> Requests
            </NavLink>

            <NavLink
              to="/admin/logs"
              className={({ isActive }) =>
                isActive ? "adm-nav__link adm-nav__link--active" : "adm-nav__link"
              }
            >
              <span>📜</span> Activity Logs
            </NavLink>
          </nav>
        </div>

        <div className="adm-sidebar__footer">
          <div className="adm-profile-badge">
            <div className="adm-avatar">{getInitials(adminName)}</div>
            <div className="adm-profile-info">
              <span className="adm-profile-name" title={adminName}>
                {adminName}
              </span>
              <span className="adm-profile-role">{adminRole}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="adm-layout-logout-btn">
            🚪 Sign Out
          </button>
        </div>
      </aside>

      <main className="adm-main">
        <header className="adm-header">
          <h1 className="adm-page-title">🛡️ IAMShield Control Center</h1>
        </header>

        <div className="adm-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;