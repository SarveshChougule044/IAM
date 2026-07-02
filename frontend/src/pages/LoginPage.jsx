import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser, loginWithGoogle } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const from = location.state?.from;
    const redirectPath =
      from?.pathname && from.pathname !== "/login"
        ? `${from.pathname}${from.search || ""}${from.hash || ""}`
        : "/";

    navigate(redirectPath, { replace: true });
  }, [isAuthenticated, location.state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      toast.success("Login successful!");
      login({
        user: data.user || { email: formData.email },
        token: data.token,
      });
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const data = await loginWithGoogle(credentialResponse.credential);
      toast.success("Google Login successful!");
      login({
        user: data.user,
        token: data.token,
      });
    } catch (err) {
      toast.error(err.message || "Google Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-shell auth-shell--signin">
      <div className="auth-shell__glow auth-shell__glow--one"></div>
      <div className="auth-shell__glow auth-shell__glow--two"></div>

      <div className="auth-layout">
        <div className="auth-showcase">
          <div className="auth-badge">
            <span className="status-dot"></span>
            Security trusted by modern enterprises
          </div>

          <h1 className="auth-title">
            Secure identity. <br />
            Govern access. <br />
            Scale with confidence.
          </h1>

          <p className="auth-description">
            IAMShield gives enterprises a single control layer for workforce,
            privileged, partner, and customer identity across cloud, SaaS, and APIs.
          </p>

          <div className="auth-highlights">
            <div className="auth-highlight-card">
              <span className="auth-highlight-number">99.99%</span>
              <span className="auth-highlight-label">Platform uptime SLA</span>
            </div>

            <div className="auth-highlight-card">
              <span className="auth-highlight-number">12M+</span>
              <span className="auth-highlight-label">Protected identities</span>
            </div>

            <div className="auth-highlight-card">
              <span className="auth-highlight-number">&lt;80ms</span>
              <span className="auth-highlight-label">Average auth latency</span>
            </div>
          </div>

          <div className="auth-points">
            <div className="auth-point">
              Zero-trust architecture with adaptive controls
            </div>
            <div className="auth-point">
              Built-in compliance mapping for regulated industries
            </div>
            <div className="auth-point">
              Passwordless, MFA, PAM, SSO, and lifecycle automation
            </div>
          </div>
        </div>

        <div className="auth-panel-wrap">
          <div className="auth-panel">
            <div className="auth-panel__header">
              <p className="auth-eyebrow">Welcome back</p>
              <h2>Sign in to IAMShield</h2>
              <p className="auth-panel__subtext">
                Access your identity workspace and continue your secure access
                operations.
              </p>
            </div>

            <div className="auth-single-role">
              <span className="auth-single-role__label">
                Organization account
              </span>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="email">Work Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <div className="auth-input-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-input-action"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="auth-form__meta">
                <label className="auth-check">
                  <input type="checkbox" />
                  <span>Remember this device</span>
                </label>

                <Link to="/forgot-password" className="auth-link">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="auth-btn auth-btn--primary"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in →"}
              </button>

              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google Login Failed")}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />
              </div>

              <p className="auth-footer">
                Don&apos;t have access yet? <Link to="/signup">Create account →</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;