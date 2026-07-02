import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { signupUser, loginWithGoogle } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function SignupPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      toast.error("Username must not contain numbers or special characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const data = await signupUser({
        fullName: formData.fullName,
        email: formData.email,
        company: formData.company,
        password: formData.password,
      });

      register({
        user:
          data.user || {
            fullName: formData.fullName,
            email: formData.email,
            company: formData.company,
          },
        token: data.token,
      });

      toast.success(data.message || "Account created successfully");

      setFormData({
        fullName: "",
        email: "",
        company: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1200);
    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const data = await loginWithGoogle(credentialResponse.credential);
      toast.success("Google Signup/Login successful!");
      register({
        user: data.user,
        token: data.token,
      });
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1200);
    } catch (err) {
      toast.error(err.message || "Google Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-shell auth-shell--signup">
      <div className="auth-shell__glow auth-shell__glow--one"></div>
      <div className="auth-shell__glow auth-shell__glow--two"></div>

      <div className="auth-layout">
        <div className="auth-showcase">
          <div className="auth-badge">
            <span className="status-dot"></span>
            Enterprise onboarding with identity-first security
          </div>

          <h1 className="auth-title">
            Create secure access <br />
            journeys for every <br />
            team and user.
          </h1>

          <p className="auth-description">
            Build a stronger access foundation with IAMShield for workforce,
            customers, developers, and privileged operations in one modern platform.
          </p>

          <div className="auth-highlights">
            <div className="auth-highlight-card">
              <span className="auth-highlight-number">500+</span>
              <span className="auth-highlight-label">Enterprise integrations</span>
            </div>

            <div className="auth-highlight-card">
              <span className="auth-highlight-number">24/7</span>
              <span className="auth-highlight-label">Threat-ready monitoring</span>
            </div>

            <div className="auth-highlight-card">
              <span className="auth-highlight-number">Zero-trust</span>
              <span className="auth-highlight-label">Built into every access flow</span>
            </div>
          </div>

          <div className="auth-points">
            <div className="auth-point">Fast onboarding for security and IT teams</div>
            <div className="auth-point">Fine-grained access policies with strong auditing</div>
            <div className="auth-point">Flexible deployment for cloud-first and regulated environments</div>
          </div>
        </div>

        <div className="auth-panel-wrap">
          <div className="auth-panel">
            <div className="auth-panel__header">
              <p className="auth-eyebrow">Get started</p>
              <h2>Create organization account</h2>
              <p className="auth-panel__subtext">
                Set up your IAMShield workspace and start managing identity securely.
              </p>
            </div>

            <div className="auth-single-role">
              <span className="auth-single-role__label">Organization account</span>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>

              <div className="auth-field auth-field--two">
                <div>
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

                <div>
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    type="text"
                    name="company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={handleChange}
                    autoComplete="organization"
                  />
                </div>
              </div>

              <div className="auth-field auth-field--two">
                <div>
                  <label htmlFor="password">Password</label>
                  <div className="auth-input-wrap">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
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

                <div>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="auth-input-wrap">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="auth-input-action"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              <label className="auth-check">
                <input type="checkbox" required />
                <span>I agree to the platform terms and security policy.</span>
              </label>

              <button
                type="submit"
                className="auth-btn auth-btn--primary"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account →"}
              </button>

              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google Authentication Failed")}
                  theme="outline"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                />
              </div>

              <p className="auth-footer">
                Already have an account? <Link to="/login">Sign in →</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignupPage;