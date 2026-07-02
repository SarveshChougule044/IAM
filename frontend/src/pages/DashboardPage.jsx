import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

function DashboardPage() {
  const { user } = useAuth();
  const [assessmentDate, setAssessmentDate] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
    
    // Check if the user has completed an assessment recently
    const result = localStorage.getItem(`assessmentResult_${user.uid}`);
    if (result) {
      try {
        const parsed = JSON.parse(result);
        if (parsed.submittedAt) {
          setAssessmentDate(new Date(parsed.submittedAt).toLocaleDateString());
        }
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  const displayName = user?.fullName || user?.name || user?.email || "User";

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <p className="dashboard-eyebrow">Identity Workspace</p>
        <h1>Welcome back, {displayName}</h1>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card__icon">🛡️</div>
          <h3>Security Assessment</h3>
          <p>
            Evaluate your current IAM infrastructure, identify vulnerabilities, and
            get a comprehensive security score based on zero-trust principles.
          </p>
          <Link to="/assessment" className="dashboard-card__action">
            {assessmentDate ? "Retake Assessment" : "Start Assessment"}
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card__icon">📊</div>
          <h3>Recommendations</h3>
          <p>
            Review AI-generated recommendations and actionable steps to improve your
            identity governance and compliance posture.
          </p>
          <Link to="/recommendations" className="dashboard-card__action">
            View Recommendations
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card__icon">⚙️</div>
          <h3>Account Settings</h3>
          <p>
            Manage your personal profile, security preferences, and view your
            organization's identity configurations.
          </p>
          <button type="button" className="dashboard-card__action" onClick={() => alert('Settings coming soon')}>
            Manage Settings
          </button>
        </div>
      </div>

      <section className="dashboard-stats-section">
        <p className="dashboard-eyebrow">Your Activity</p>
        <div className="dashboard-stats">
          <div className="stat-box">
            <div className="stat-box__value">{assessmentDate ? "1" : "0"}</div>
            <div className="stat-box__label">Assessments Completed</div>
          </div>
          <div className="stat-box">
            <div className="stat-box__value">{assessmentDate ? "Last 7 days" : "Never"}</div>
            <div className="stat-box__label">Last Activity</div>
          </div>
          <div className="stat-box">
            <div className="stat-box__value">Active</div>
            <div className="stat-box__label">Account Status</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;