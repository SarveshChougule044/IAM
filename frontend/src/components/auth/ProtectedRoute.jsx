// frontend/src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  const adminToken = localStorage.getItem("adminToken");
  const hasAccess = isAuthenticated || Boolean(adminToken);

  if (authLoading) {
    return (
      <div style={{ padding: "2rem", color: "#fff" }}>
        Checking access...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;