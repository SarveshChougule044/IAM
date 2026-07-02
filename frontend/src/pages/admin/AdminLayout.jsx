import { NavLink, Outlet } from "react-router-dom";
import "../../styles/admin-dashboard.css";

function AdminLayout() {
  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-sidebar__brand">
          <div className="adm-logo">IS</div>
          <div>
            <div className="adm-eyebrow">IAMShield</div>
            <div className="adm-brand-title">Admin</div>
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
            Overview
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? "adm-nav__link adm-nav__link--active" : "adm-nav__link"
            }
          >
            Users
          </NavLink>

          <NavLink
            to="/admin/requests"
            className={({ isActive }) =>
              isActive ? "adm-nav__link adm-nav__link--active" : "adm-nav__link"
            }
          >
            Requests
          </NavLink>

          {/* Later: Logs, Settings */}
        </nav>
      </aside>

      <main className="adm-main">
        <header className="adm-header">
          <h1 className="adm-page-title">IAMShield Admin</h1>
        </header>
        <div className="adm-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;