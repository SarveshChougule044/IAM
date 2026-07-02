import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/recommendations.css";

const PRODUCT_COLORS = {
  okta: { from: "#00A1EA", to: "#0069b4", glow: "rgba(0,161,234,0.25)" },
  entra: { from: "#0078D4", to: "#004e8c", glow: "rgba(0,120,212,0.25)" },
  cyberark: { from: "#C8102E", to: "#8b0000", glow: "rgba(200,16,46,0.25)" },
  sailpoint: { from: "#1A73E8", to: "#0d4ea6", glow: "rgba(26,115,232,0.25)" },
  ping: { from: "#FF5733", to: "#c73e1d", glow: "rgba(255,87,51,0.25)" },
  hashicorp: { from: "#7B42BC", to: "#4e2880", glow: "rgba(123,66,188,0.25)" },
  forgerock: { from: "#2E7D32", to: "#1b5e20", glow: "rgba(46,125,50,0.25)" },
};

const PRODUCT_LOGOS = {
  okta: "🔐",
  entra: "☁️",
  cyberark: "🔒",
  sailpoint: "⚓",
  ping: "🌐",
  hashicorp: "🗝️",
  forgerock: "🌿",
};

const CAPABILITY_LABELS = {
  r_sso: "SSO",
  r_mfa: "MFA",
  r_passwordless: "Passwordless",
  r_iga: "IGA",
  r_scim: "SCIM Provisioning",
  r_pam: "PAM",
  r_session: "Session Recording",
  r_directory: "Directory",
  r_api: "API / SDKs",
  r_compliance: "Compliance Reports",
  r_zerotrust: "Zero Trust",
  r_siem: "SIEM Integration",
  r_ai: "AI / ML",
  r_secrets: "Secrets Mgmt",
  r_ciam: "CIAM",
  r_epm: "Endpoint PM",
  r_adaptive: "Adaptive Auth",
  r_certify: "Access Reviews",
};

function ScoreBar({ score, max, color }) {
  const pct = max > 0 ? Math.min((score / max) * 100, 100) : 0;
  return (
    <div className="rec-score-bar-wrap">
      <div className="rec-score-bar-track">
        <div
          className="rec-score-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="rec-score-val">{Math.round(score)}</span>
    </div>
  );
}

function RecommendationsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const key = user?.uid ? `assessmentResult_${user.uid}` : "assessmentResult_guest";
    const raw = localStorage.getItem(key);
    if (raw) {
      try { setData(JSON.parse(raw)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, [user]);

  const result = data?.result;
  const answers = data?.answers || {};

  const maxScore = useMemo(() => {
    if (!result?.scores) return 1;
    return Math.max(...Object.values(result.scores), 1);
  }, [result]);

  const capabilityRatings = useMemo(() => {
    const ratings = answers.q56 || {};
    return Object.entries(CAPABILITY_LABELS).map(([id, label]) => ({
      id, label, rating: Number(ratings[id] || 0),
    }));
  }, [answers]);

  const topRatedCapabilities = capabilityRatings
    .filter((c) => c.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  if (loading) {
    return (
      <div className="rec-loading">
        <div className="rec-spinner" />
        <p>Generating your IAM strategy report…</p>
      </div>
    );
  }

  if (!data || !result) {
    return (
      <div className="rec-empty">
        <div className="rec-empty-icon">🛡️</div>
        <h1>No Assessment Found</h1>
        <p>Complete the IAMShield questionnaire to get your personalised recommendations.</p>
        <Link to="/assessment" className="rec-cta-btn">Start Assessment →</Link>
      </div>
    );
  }

  const { topProduct, otherProducts, scores } = result;
  const allProducts = result?.scores ? Object.entries(scores).sort((a,b)=>b[1]-a[1]) : [];

  return (
    <div className="rec-root">
      {/* ── PAGE HEADER ── */}
      <header className="rec-page-header">
        <div className="rec-page-header-inner">
          <div className="rec-header-left">
            <Link to="/" className="rec-back-link">← Back to Home</Link>
            <div className="rec-badge">Confidential Report</div>
            <h1 className="rec-page-title">Your IAM Strategy Report</h1>
            <p className="rec-page-sub">
              Generated from your {Object.keys(answers).length} questionnaire responses
            </p>
          </div>
          <Link to="/assessment" className="rec-retake-btn">Retake Assessment</Link>
        </div>

        {/* Tab nav */}
        <div className="rec-tab-nav">
          {[
            { id: "overview", label: "Overview" },
            { id: "products", label: "Product Match" },
            { id: "capabilities", label: "Capabilities" },
            { id: "scores", label: "All Scores" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`rec-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="rec-main">

        {/* ════ TAB: OVERVIEW ════ */}
        {activeTab === "overview" && (
          <div className="rec-tab-content">
            {/* Hero recommendation card */}
            {topProduct && (() => {
              const colors = PRODUCT_COLORS[topProduct.id] || PRODUCT_COLORS.okta;
              const logo = PRODUCT_LOGOS[topProduct.id] || "🔐";
              return (
                <div
                  className="rec-hero-card"
                  style={{
                    background: `linear-gradient(135deg, ${colors.from}22 0%, ${colors.to}11 100%)`,
                    borderColor: `${colors.from}44`,
                    boxShadow: `0 8px 60px ${colors.glow}`,
                  }}
                >
                  <div className="rec-hero-left">
                    <div className="rec-hero-badge-row">
                      <span
                        className="rec-hero-rank"
                        style={{ background: colors.from }}
                      >
                        #1 Recommended
                      </span>
                    </div>
                    <div
                      className="rec-hero-logo"
                      style={{ background: `${colors.from}22`, borderColor: `${colors.from}44` }}
                    >
                      {logo}
                    </div>
                    <h2 className="rec-hero-name" style={{ color: colors.from }}>
                      {topProduct.name}
                    </h2>
                    <p className="rec-hero-tagline">{topProduct.tagline}</p>
                    <p className="rec-hero-desc">{topProduct.description}</p>
                  </div>

                  <div className="rec-hero-right">
                    <div className="rec-hero-fit">
                      <h4>Best Fit For</h4>
                      <ul>
                        {topProduct.bestFor.map((item, i) => (
                          <li key={i}><span className="rec-check">✓</span> {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rec-pros-cons">
                    <div className="rec-pros">
                      <h4>✅ Advantages</h4>
                      <ul>
                        {topProduct.advantages?.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                    <div className="rec-cons">
                      <h4>⚠️ Considerations</h4>
                      <ul>
                        {topProduct.disadvantages?.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Key priorities from ratings */}
            {topRatedCapabilities.length > 0 && (
              <div className="rec-section">
                <h2 className="rec-section-title">Your Top Priorities</h2>
                <div className="rec-priority-grid">
                  {topRatedCapabilities.map((cap) => (
                    <div key={cap.id} className="rec-priority-card">
                      <div className="rec-priority-stars">
                        {[1,2,3,4,5].map((n) => (
                          <span key={n} className={`rec-star ${cap.rating >= n ? "lit" : ""}`}>★</span>
                        ))}
                      </div>
                      <p className="rec-priority-label">{cap.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ TAB: PRODUCT MATCH ════ */}
        {activeTab === "products" && (
          <div className="rec-tab-content">
            <div className="rec-section">
              <h2 className="rec-section-title">Top Recommended Platform</h2>
              {topProduct && (() => {
                const colors = PRODUCT_COLORS[topProduct.id] || PRODUCT_COLORS.okta;
                const logo = PRODUCT_LOGOS[topProduct.id] || "🔐";
                return (
                  <div className="rec-product-full" style={{ borderColor: `${colors.from}44` }}>
                    <div className="rec-product-full-header" style={{ background: `${colors.from}15` }}>
                      <span className="rec-product-full-logo">{logo}</span>
                      <div>
                        <h3 style={{ color: colors.from }}>{topProduct.name}</h3>
                        <p>{topProduct.tagline}</p>
                      </div>
                      <div className="rec-product-score-badge" style={{ background: colors.from }}>
                        Score: {Math.round(topProduct.score)}
                      </div>
                    </div>
                    <div className="rec-product-full-body">
                      <p>{topProduct.description}</p>
                      <div className="rec-product-sections">
                        <div>
                          <h4>Best Fit Scenarios</h4>
                          <ul className="rec-feature-list">
                            {topProduct.bestFor.map((f,i)=><li key={i}>{f}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4>Advantages</h4>
                          <ul className="rec-feature-list green">
                            {topProduct.advantages?.map((a,i)=><li key={i}>{a}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4>Considerations</h4>
                          <ul className="rec-feature-list amber">
                            {topProduct.disadvantages?.map((d,i)=><li key={i}>{d}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {otherProducts?.length > 0 && (
              <div className="rec-section">
                <h2 className="rec-section-title">Alternative Recommendations</h2>
                <div className="rec-alt-grid">
                  {otherProducts.map((prod) => {
                    const colors = PRODUCT_COLORS[prod.id] || { from: "#818cf8", glow: "rgba(129,140,248,0.2)" };
                    const logo = PRODUCT_LOGOS[prod.id] || "🔐";
                    return (
                      <div
                        key={prod.id}
                        className="rec-alt-card"
                        style={{ borderColor: `${colors.from}33`, boxShadow: `0 4px 24px ${colors.glow}` }}
                      >
                        <div className="rec-alt-header">
                          <span className="rec-alt-logo">{logo}</span>
                          <div>
                            <h3 style={{ color: colors.from }}>{prod.name}</h3>
                            <p>{prod.tagline}</p>
                          </div>
                        </div>
                        <p className="rec-alt-desc">{prod.description}</p>
                        <div className="rec-alt-tags">
                          {prod.bestFor.slice(0, 3).map((f, i) => (
                            <span key={i} className="rec-alt-tag" style={{ borderColor: `${colors.from}44`, color: colors.from }}>
                              {f}
                            </span>
                          ))}
                        </div>
                        <div className="rec-alt-score" style={{ color: colors.from }}>
                          Score: <strong>{Math.round(prod.score)}</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ TAB: CAPABILITIES ════ */}
        {activeTab === "capabilities" && (
          <div className="rec-tab-content">
            <div className="rec-section">
              <h2 className="rec-section-title">Capability Priority Ratings</h2>
              <p className="rec-section-sub">Based on your Section 11 ratings (1 = low, 5 = critical)</p>
              <div className="rec-cap-grid">
                {capabilityRatings.map((cap) => (
                  <div key={cap.id} className="rec-cap-card">
                    <div className="rec-cap-top">
                      <span className="rec-cap-label">{cap.label}</span>
                      <span className={`rec-cap-badge ${cap.rating >= 5 ? "critical" : cap.rating >= 4 ? "high" : cap.rating >= 3 ? "med" : "low"}`}>
                        {cap.rating >= 5 ? "Critical" : cap.rating >= 4 ? "High" : cap.rating >= 3 ? "Medium" : cap.rating > 0 ? "Low" : "Not rated"}
                      </span>
                    </div>
                    <div className="rec-cap-stars">
                      {[1,2,3,4,5].map((n) => (
                        <span key={n} className={`rec-star ${cap.rating >= n ? "lit" : ""}`}>★</span>
                      ))}
                    </div>
                    <div className="rec-cap-bar">
                      <div className="rec-cap-bar-fill" style={{ width: `${(cap.rating / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ TAB: ALL SCORES ════ */}
        {activeTab === "scores" && (
          <div className="rec-tab-content">
            <div className="rec-section">
              <h2 className="rec-section-title">Platform Fit Scores</h2>
              <p className="rec-section-sub">Based on your questionnaire answers across all 11 sections</p>
              <div className="rec-scores-list">
                {allProducts.map(([id, score], idx) => {
                  const colors = PRODUCT_COLORS[id] || { from: "#818cf8" };
                  const logo = PRODUCT_LOGOS[id] || "🔐";
                  const prod = result?.topProduct?.id === id ? result.topProduct :
                    result?.otherProducts?.find(p => p.id === id) || { name: id };
                  return (
                    <div key={id} className="rec-score-row">
                      <span className="rec-score-rank" style={{ color: idx === 0 ? "#fbbf24" : "#64748b" }}>
                        #{idx + 1}
                      </span>
                      <span className="rec-score-logo">{logo}</span>
                      <div className="rec-score-info">
                        <span className="rec-score-name" style={{ color: colors.from }}>{prod.name || id}</span>
                        <ScoreBar score={score} max={maxScore} color={colors.from} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default RecommendationsPage;