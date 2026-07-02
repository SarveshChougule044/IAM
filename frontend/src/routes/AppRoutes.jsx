// frontend/src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/admin/AdminLayout";

// Auth guard
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminProtectedRoute from "../components/auth/AdminProtectedRoute";

// User pages
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import AssessmentPage from "../pages/AssessmentPage";
import RecommendationsPage from "../pages/RecommendationsPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import RequestDemoPage from "../pages/RequestDemoPage";
import DashboardPage from "../pages/DashboardPage";

// Admin auth pages (public)
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminRegisterPage from "../pages/admin/AdminRegisterPage";

// Admin pages (protected)
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminRequestsPage from "../pages/admin/AdminRequestsPage";
import AdminLogsPage from "../pages/admin/AdminLogsPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public user area with main layout */}
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="request-demo" element={<RequestDemoPage />} />
      </Route>

      {/* Public admin auth routes */}
      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route path="admin/register" element={<AdminRegisterPage />} />

      {/* Assessment — publicly accessible; submission redirects to login if unauthenticated */}
      <Route element={<MainLayout />}>
        <Route path="assessment" element={<AssessmentPage />} />
      </Route>

      {/* Protected routes (require user auth) */}
      <Route element={<ProtectedRoute />}>
        {/* Protected user routes under MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
        </Route>
      </Route>

      {/* Protected admin routes (require admin auth) */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="requests" element={<AdminRequestsPage />} />
          <Route path="logs" element={<AdminLogsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;