import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/layout.css";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Assessment", to: "/assessment" },
  { label: "Recommendations", to: "/recommendations" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, authLoading } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email ||
    "";

  if (authLoading) {
    return null;
  }

  return (
    <header className="iam-navbar">
      <div className="iam-navbar__inner">
        <Link to="/" className="iam-brand" onClick={() => setIsOpen(false)}>
          <div className="iam-brand__icon">🛡</div>
          <div className="iam-brand__text">
            <span className="iam-brand__light">IAM</span>
            <span className="iam-brand__accent"> Shield</span>
          </div>
        </Link>

        <button
          className="iam-navbar__toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          type="button"
        >
          ☰
        </button>

        <nav className={`iam-navbar__menu ${isOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                isActive ? "iam-navbar__link active" : "iam-navbar__link"
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* {isAuthenticated && (
            <NavLink
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                isActive ? "iam-navbar__link active" : "iam-navbar__link"
              }
            >
              Dashboard
            </NavLink>
          )} */}

          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive ? "iam-navbar__link active" : "iam-navbar__link"
                }
              >
                Sign In
              </NavLink>

              <NavLink
                to="/signup"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive ? "iam-navbar__link active" : "iam-navbar__link"
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>

        <div className="iam-navbar__right">
          {isAuthenticated && displayName && (
            <div className="iam-navbar__user">Hello, {displayName}</div>
          )}

          {isAuthenticated && (
            <button
              type="button"
              className="iam-navbar__logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}

          <div className="iam-navbar__badge">
            <span className="status-dot"></span>
            Enterprise IAM Platform
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;