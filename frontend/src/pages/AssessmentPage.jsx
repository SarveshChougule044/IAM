import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { getQuestionnaire, submitQuestionnaire } from "../services/assessmentService";
import "../styles/assessment.css";

const SECTION_ICONS = ["🏢", "🔐", "🛡️", "📂", "🔑", "⚖️", "🚀", "🌐", "🤖", "💼", "⭐"];

function AssessmentPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    (async () => {
      try {
        const data = await getQuestionnaire();
        setQuestions(data.questions || []);
      } catch (err) {
        toast.error("Failed to load questionnaire");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Group questions by section
  const sections = questions.reduce((acc, q) => {
    const key = q.section;
    if (!acc[key]) acc[key] = { number: key, title: q.sectionTitle, questions: [] };
    acc[key].questions.push(q);
    return acc;
  }, {});
  const sectionList = Object.values(sections);

  // Progress: answered questions out of total (excluding text & rating which auto-pass)
  const totalCheckboxQ = questions.filter((q) => q.type === "checkbox").length;
  const answeredCheckboxQ = questions.filter(
    (q) => q.type === "checkbox" && answers[q.id] && answers[q.id].length > 0
  ).length;
  const progressPct = totalCheckboxQ > 0 ? Math.round((answeredCheckboxQ / totalCheckboxQ) * 100) : 0;

  // Toggle checkbox
  const toggleCheckbox = useCallback((qId, optId) => {
    setAnswers((prev) => {
      const current = prev[qId] || [];
      const next = current.includes(optId)
        ? current.filter((x) => x !== optId)
        : [...current, optId];
      return { ...prev, [qId]: next };
    });
  }, []);

  // Update text/rating
  const updateAnswer = useCallback((qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }, []);

  // Rating update (nested key: q56.r_sso = 4)
  const updateRating = useCallback((qId, capId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...(prev[qId] || {}), [capId]: value },
    }));
  }, []);

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(Number(entry.target.dataset.section));
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -60% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sectionList.length]);

  const scrollToSection = (num) => {
    sectionRefs.current[num]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const result = await submitQuestionnaire(answers);

      const payload = {
        answers,
        result: result.result,
        submittedAt: new Date().toISOString(),
      };

      const storageKey =
        isAuthenticated && user ? `assessmentResult_${user.uid}` : "assessmentResult_guest";
      localStorage.setItem(storageKey, JSON.stringify(payload));

      if (isAuthenticated) {
        navigate("/recommendations", { replace: true });
      } else {
        toast("Login to view your recommendations", { icon: "🔒", duration: 5000 });
        navigate("/login", {
          replace: true,
          state: { from: { pathname: "/recommendations" } },
        });
      }
    } catch (err) {
      toast.error(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="iam-qs-loading">
        <div className="iam-qs-spinner" />
        <p>Loading questionnaire…</p>
      </div>
    );
  }

  return (
    <div className="iam-qs-root">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="iam-qs-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`iam-qs-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="iam-qs-sidebar-header">
          <span className="iam-qs-brand">IAMShield</span>
          <span className="iam-qs-brand-sub">Questionnaire</span>
        </div>

        {/* Progress ring */}
        <div className="iam-qs-progress-wrap">
          <svg viewBox="0 0 64 64" className="iam-qs-ring">
            <circle cx="32" cy="32" r="28" className="iam-qs-ring-bg" />
            <circle
              cx="32"
              cy="32"
              r="28"
              className="iam-qs-ring-fill"
              strokeDasharray={`${progressPct * 1.759} 175.9`}
            />
          </svg>
          <span className="iam-qs-ring-pct">{progressPct}%</span>
        </div>
        <p className="iam-qs-progress-label">
          {answeredCheckboxQ} / {totalCheckboxQ} questions answered
        </p>

        <nav className="iam-qs-nav">
          {sectionList.map((sec) => {
            const icon = SECTION_ICONS[sec.number - 1] || "📋";
            const secAnswered = sec.questions.filter(
              (q) => q.type === "checkbox" && answers[q.id]?.length > 0
            ).length;
            const secTotal = sec.questions.filter((q) => q.type === "checkbox").length;
            const complete = secTotal > 0 && secAnswered === secTotal;
            return (
              <button
                key={sec.number}
                className={`iam-qs-nav-item ${activeSection === sec.number ? "active" : ""} ${complete ? "done" : ""}`}
                onClick={() => scrollToSection(sec.number)}
              >
                <span className="iam-qs-nav-icon">{icon}</span>
                <span className="iam-qs-nav-text">
                  <strong>Section {sec.number}</strong>
                  <span>{sec.title}</span>
                </span>
                {complete && <span className="iam-qs-nav-check">✓</span>}
              </button>
            );
          })}
        </nav>

        <div className="iam-qs-sidebar-footer">
          <button
            className="iam-qs-submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="iam-qs-btn-spinner" />
                Submitting…
              </>
            ) : (
              "Get Recommendations →"
            )}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="iam-qs-main">
        {/* Mobile top bar */}
        <div className="iam-qs-topbar">
          <button
            className="iam-qs-menu-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <span className="iam-qs-topbar-title">IAMShield Questionnaire</span>
          <span className="iam-qs-topbar-pct">{progressPct}%</span>
        </div>

        {/* Progress bar (mobile) */}
        <div className="iam-qs-mobile-progress">
          <div className="iam-qs-mobile-bar" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Hero */}
        <header className="iam-qs-hero">
          <div className="iam-qs-hero-badge">IAMShield Assessment</div>
          <h1 className="iam-qs-hero-title">
            Identity &amp; Access Management<br />
            <span className="iam-qs-hero-gradient">Needs Assessment</span>
          </h1>
          <p className="iam-qs-hero-sub">
            Complete the questionnaire below. Your answers will be used to generate a tailored IAM product recommendation and executive strategy report.
          </p>
          <div className="iam-qs-hero-stats">
            <div className="iam-qs-stat">
              <strong>55</strong><span>Questions</span>
            </div>
            <div className="iam-qs-stat-divider" />
            <div className="iam-qs-stat">
              <strong>11</strong><span>Sections</span>
            </div>
            <div className="iam-qs-stat-divider" />
            <div className="iam-qs-stat">
              <strong>~15 min</strong><span>Estimated time</span>
            </div>
          </div>
        </header>

        {/* Sections */}
        <div className="iam-qs-sections">
          {sectionList.map((sec) => {
            const icon = SECTION_ICONS[sec.number - 1] || "📋";
            return (
              <section
                key={sec.number}
                className="iam-qs-section"
                data-section={sec.number}
                ref={(el) => (sectionRefs.current[sec.number] = el)}
              >
                <div className="iam-qs-section-header">
                  <span className="iam-qs-section-icon">{icon}</span>
                  <div>
                    <p className="iam-qs-section-label">Section {sec.number}</p>
                    <h2 className="iam-qs-section-title">{sec.title}</h2>
                  </div>
                </div>

                <div className="iam-qs-questions">
                  {sec.questions.map((q) => (
                    <div key={q.id} className="iam-qs-question">
                      <p className="iam-qs-question-num">Q{q.number}</p>
                      <h3 className="iam-qs-question-text">{q.text}</h3>

                      {/* CHECKBOX question */}
                      {q.type === "checkbox" && (
                        <div className="iam-qs-options">
                          {q.options.map((opt) => {
                            const checked = (answers[q.id] || []).includes(opt.id);
                            return (
                              <label key={opt.id} className={`iam-qs-option ${checked ? "checked" : ""}`}>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleCheckbox(q.id, opt.id)}
                                />
                                <span className="iam-qs-checkbox">
                                  {checked && <svg viewBox="0 0 12 10" fill="none"><polyline points="1,5 4,9 11,1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </span>
                                <span className="iam-qs-option-label">{opt.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* TEXT question */}
                      {q.type === "text" && (
                        <textarea
                          className="iam-qs-textarea"
                          placeholder={q.placeholder}
                          rows={4}
                          value={answers[q.id] || ""}
                          onChange={(e) => updateAnswer(q.id, e.target.value)}
                        />
                      )}

                      {/* RATING question (Section 11) */}
                      {q.type === "rating" && (
                        <div className="iam-qs-rating-table-wrap">
                          <div className="iam-qs-rating-header">
                            <span className="iam-qs-rating-capability-col">Capability</span>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <span key={n} className="iam-qs-rating-num">{n}</span>
                            ))}
                          </div>
                          {q.options.map((cap) => {
                            const current = answers[q.id]?.[cap.id] || 0;
                            return (
                              <div key={cap.id} className="iam-qs-rating-row">
                                <span className="iam-qs-rating-label">{cap.label}</span>
                                <div className="iam-qs-rating-stars">
                                  {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                      key={n}
                                      type="button"
                                      className={`iam-qs-star ${current >= n ? "active" : ""}`}
                                      onClick={() => updateRating(q.id, cap.id, n)}
                                      aria-label={`Rate ${cap.label} ${n}`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom submit */}
        <div className="iam-qs-bottom-bar">
          <div className="iam-qs-bottom-progress">
            <div className="iam-qs-bottom-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="iam-qs-bottom-content">
            <div className="iam-qs-bottom-info">
              <strong>{progressPct}% complete</strong>
              <span>{answeredCheckboxQ} of {totalCheckboxQ} questions answered</span>
            </div>
            <button
              className="iam-qs-submit-main"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Generating Report…" : "Submit & Get Recommendations"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AssessmentPage;