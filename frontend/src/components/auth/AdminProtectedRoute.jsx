import { Navigate, Outlet, useLocation } from "react-router-dom";

function AdminProtectedRoute() {
  const location = useLocation();
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
