import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

// ── Animated hex grid canvas ──────────────────────────────────────────────────
function HexGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animFrame;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const hexSize = 36;
    const hexW = hexSize * 2;
    const hexH = Math.sqrt(3) * hexSize;

    function drawHex(cx, cy, size, alpha, pulse) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + size * Math.cos(angle);
        const y = cy + size * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(107, 128, 255, ${alpha * pulse})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();

      if (pulse > 0.7) {
        ctx.fillStyle = `rgba(107, 128, 255, ${0.03 * pulse})`;
        ctx.fill();
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      const cols = Math.ceil(canvas.width / (hexW * 0.75)) + 2;
      const rows = Math.ceil(canvas.height / hexH) + 2;

      for (let col = -1; col < cols; col++) {
        for (let row = -1; row < rows; row++) {
          const cx = col * hexW * 0.75;
          const cy = row * hexH + (col % 2 === 0 ? 0 : hexH / 2);

          const dist = Math.sqrt(
            Math.pow((cx - canvas.width * 0.5) / canvas.width, 2) +
            Math.pow((cy - canvas.height * 0.5) / canvas.height, 2)
          );

          const wave = Math.sin(t - dist * 8 + col * 0.3 + row * 0.2);
          const alpha = 0.04 + 0.08 * ((wave + 1) / 2);
          const pulse = 0.3 + 0.7 * ((Math.sin(t * 0.5 + col * 0.7 + row * 0.5) + 1) / 2);

          drawHex(cx, cy, hexSize - 2, alpha, pulse);
        }
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="hex-canvas" />;
}

// ── Binary rain column ────────────────────────────────────────────────────────
function BinaryRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animFrame;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 11;
    const chars = "01アイウエオカキクケコサシスセソ01ABCDEF0101";
    let drops = [];

    const initDrops = () => {
      const cols = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: cols }, () => Math.random() * -canvas.height);
    };
    initDrops();
    window.addEventListener("resize", initDrops);

    const draw = () => {
      ctx.fillStyle = "rgba(5, 10, 20, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const progress = drops[i] / canvas.height;

        ctx.fillStyle =
          progress < 0.1
            ? `rgba(180, 190, 255, 0.9)`
            : `rgba(80, 100, 220, ${Math.max(0, 0.5 - progress * 0.4)})`;

        ctx.font = `${fontSize}px "Courier New", monospace`;
        ctx.fillText(char, i * fontSize, drops[i]);

        drops[i] += fontSize * 0.8;
        if (drops[i] > canvas.height + 50) {
          drops[i] = Math.random() * -200;
        }
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", initDrops);
    };
  }, []);

  return <canvas ref={canvasRef} className="rain-canvas" />;
}

// ── Network nodes animation ───────────────────────────────────────────────────
function NodeNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animFrame;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const nodeCount = 28;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.04,
      r: Math.random() * 2.5 + 1.5,
      pulse: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;

      const w = canvas.width;
      const h = canvas.height;

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 100) n.vx *= -1;
        if (n.y < 0 || n.y > 100) n.vy *= -1;
      });

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 22) {
            const alpha = (1 - dist / 22) * 0.35;
            ctx.beginPath();
            ctx.moveTo((nodes[i].x / 100) * w, (nodes[i].y / 100) * h);
            ctx.lineTo((nodes[j].x / 100) * w, (nodes[j].y / 100) * h);

            const pulse = Math.sin(t * 2 + i * 0.5) * 0.5 + 0.5;
            ctx.strokeStyle = `rgba(107, 128, 255, ${alpha * (0.5 + pulse * 0.5)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Traveling dot
            const progress = (Math.sin(t + i * 1.3 + j * 0.7) + 1) / 2;
            const dotX = nodes[i].x + (nodes[j].x - nodes[i].x) * progress;
            const dotY = nodes[i].y + (nodes[j].y - nodes[i].y) * progress;
            ctx.beginPath();
            ctx.arc((dotX / 100) * w, (dotY / 100) * h, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(140, 160, 255, ${alpha * 1.5})`;
            ctx.fill();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = (Math.sin(t * 1.5 + n.pulse) + 1) / 2;
        const nx = (n.x / 100) * w;
        const ny = (n.y / 100) * h;

        // Outer ring
        ctx.beginPath();
        ctx.arc(nx, ny, n.r * 2.5 + pulse * 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(107, 128, 255, ${0.15 * pulse})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Core
        ctx.beginPath();
        ctx.arc(nx, ny, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(107, 128, 255, ${0.6 + pulse * 0.4})`;
        ctx.fill();
      });

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="network-canvas" />;
}

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(texts, speed = 60, pause = 2200) {
  const [display, setDisplay] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    let timeout;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setTextIdx((i) => (i + 1) % texts.length);
    }

    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  return display;
}

// ── Scroll reveal hook ────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ── Stat counter ──────────────────────────────────────────────────────────────
function StatCounter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useReveal(0.3);

  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [visible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Feature card data ─────────────────────────────────────────────────────────
const features = [
  {
    icon: "⬡",
    tag: "CORE",
    title: "Zero-Trust Architecture",
    desc: "Every access request is continuously verified. No implicit trust — identity, device health, and context are evaluated on every transaction across your entire infrastructure.",
    bullets: ["Adaptive access policies", "Continuous verification engine", "Context-aware enforcement"],
  },
  {
    icon: "◈",
    tag: "IDENTITY",
    title: "Unified IAM Platform",
    desc: "One control plane for workforce, customer, partner, and privileged identities. Manage SSO, MFA, lifecycle automation, and role assignments from a single workspace.",
    bullets: ["SSO & Federated identity", "Automated lifecycle", "Fine-grained RBAC"],
  },
  {
    icon: "◎",
    tag: "INTELLIGENCE",
    title: "Threat Detection & SIEM",
    desc: "AI-powered behavioral analytics detect anomalies in real-time. Correlate signals across identity events, device telemetry, and network activity to surface true threats.",
    bullets: ["ML anomaly detection", "Cross-signal correlation", "Instant threat alerts"],
  },
  {
    icon: "⬙",
    tag: "PRIVILEGE",
    title: "Privileged Access Management",
    desc: "Secure, audit, and control elevated access across cloud, on-prem, and SaaS. Just-in-time provisioning and session recording for every privileged operation.",
    bullets: ["Just-in-time access", "Full session recording", "Vault-based credential mgmt"],
  },
  {
    icon: "◑",
    tag: "COMPLIANCE",
    title: "Compliance Automation",
    desc: "Built-in policy frameworks for SOC 2, ISO 27001, HIPAA, FedRAMP, and GDPR. Automated evidence collection and continuous control monitoring reduce audit burden by 80%.",
    bullets: ["Pre-built control library", "Automated evidence collection", "Continuous monitoring"],
  },
  {
    icon: "⬜",
    tag: "DEVELOPER",
    title: "API & Developer Security",
    desc: "Secure machine-to-machine identity at scale. OAuth 2.0, OIDC, and SAML out of the box. Protect APIs with token validation, rate limiting, and anomaly-aware gateways.",
    bullets: ["OAuth 2.0 / OIDC / SAML", "API token lifecycle", "Developer-first SDKs"],
  },
];

// ── How it works steps ────────────────────────────────────────────────────────
const steps = [
  { n: "01", title: "Connect Your Stack", desc: "Integrate with 500+ enterprise apps via pre-built connectors. Active Directory, Okta, AWS IAM, Google Workspace — all synchronized in minutes." },
  { n: "02", title: "Define Access Policies", desc: "Use our visual policy builder to create fine-grained rules. Set conditions based on role, device posture, location, time, and risk score." },
  { n: "03", title: "Enforce & Monitor", desc: "Policies are enforced at every access point in real-time. Every event is logged, correlated, and analyzed for anomalous behavior automatically." },
  { n: "04", title: "Audit & Comply", desc: "Generate compliance reports with one click. Automated evidence collection keeps you perpetually audit-ready for any regulatory framework." },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  { quote: "IAMShield reduced our mean time to detect identity threats from 14 days to under 4 hours. The behavioral analytics are genuinely unlike anything we've seen.", name: "Sarah Chen", role: "CISO, FinServe Global", initials: "SC" },
  { quote: "We passed our SOC 2 Type II audit with zero findings for the first time. The automated evidence collection alone saved our team 3 weeks of work.", name: "Marcus Webb", role: "VP Engineering, CloudNative Co.", initials: "MW" },
  { quote: "Rolling out zero-trust across 8,000 employees in 6 weeks felt impossible. IAMShield made it routine. The migration tooling is exceptional.", name: "Priya Nair", role: "Head of IT Security, TechCorp India", initials: "PN" },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const typed = useTypewriter([
    "Zero-Trust Security.",
    "Identity Governance.",
    "Privileged Access Control.",
    "Compliance Automation.",
    "Threat Intelligence.",
  ]);

  const [featRef, featVisible] = useReveal(0.05);
  const [stepsRef, stepsVisible] = useReveal(0.1);
  const [statsRef, statsVisible] = useReveal(0.2);
  const [testRef, testVisible] = useReveal(0.1);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="home-root">

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className={`home-nav ${scrolled ? "home-nav--scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-logo">
            <span className="nav-logo__mark">◈</span>
            <span className="nav-logo__text">IAM<span>Shield</span></span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#stats">Platform</a>
            <a href="#testimonials">Customers</a>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="nav-signin">Sign in</Link>
            <Link to="/signup" className="nav-cta">Get Started →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hero">
        <HexGrid />
        <BinaryRain />

        <div className="hero-scan-line" />
        <div className="hero-scan-line hero-scan-line--2" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            <span className="badge-text">SYSTEM OPERATIONAL</span>
            <span className="badge-sep">|</span>
            <span className="badge-sub">v4.2.1 SECURE BUILD</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title__line hero-title__line--1">Enterprise-Grade</span>
            <span className="hero-title__line hero-title__line--2">
              <span className="typed-text">{typed}</span>
              <span className="cursor">▋</span>
            </span>
          </h1>

          <p className="hero-desc">
            IAMShield is the modern identity security platform built for enterprises that
            can't afford to be breached. One platform — complete identity lifecycle,
            privileged access, zero-trust enforcement, and compliance automation.
          </p>

          <div className="hero-actions">
            <Link to="/assessment" className="btn-primary">
              <span>Start Free Trial</span>
              <span className="btn-arrow">→</span>
            </Link>
          </div>

          <div className="hero-trust">
            <span className="trust-label">TRUSTED BY</span>
            {["Fortune 500 Enterprises", "Government Agencies", "Healthcare Networks", "Financial Institutions"].map((t) => (
              <span key={t} className="trust-item">{t}</span>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="terminal-window">
            <div className="terminal-bar">
              <span /><span /><span />
              <span className="terminal-title">iamshield — threat-monitor</span>
            </div>
            <div className="terminal-body">
              <TerminalFeed />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="stats-band" id="stats" ref={statsRef}>
        <div className="stats-grid">
          {[
            { end: 99.99, suffix: "%", label: "Uptime SLA" },
            { end: 12, suffix: "M+", label: "Identities Protected" },
            { end: 500, suffix: "+", label: "Enterprise Integrations" },
            { end: 80, suffix: "ms", label: "Avg Auth Latency" },
            { end: 80, suffix: "%", label: "Audit Cost Reduction" },
          ].map((s) => (
            <div key={s.label} className={`stat-item ${statsVisible ? "stat-item--visible" : ""}`}>
              <span className="stat-number">
                {statsVisible && <StatCounter end={s.end} suffix={s.suffix} />}
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="features-section" id="features" ref={featRef}>
        <div className="section-header">
          <p className="section-eyebrow">CAPABILITIES</p>
          <h2 className="section-title">Everything identity security demands</h2>
          <p className="section-sub">
            Built for security architects and IT leaders who need depth, not demos.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`feature-card ${featVisible ? "feature-card--visible" : ""}`}
              style={{ "--delay": `${i * 80}ms` }}
            >
              <div className="feature-card__top">
                <span className="feature-icon">{f.icon}</span>
                <span className="feature-tag">{f.tag}</span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <ul className="feature-bullets">
                {f.bullets.map((b) => (
                  <li key={b}><span className="bullet-mark">◦</span>{b}</li>
                ))}
              </ul>
              <div className="feature-card__glow" />
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="hiw-section" id="how-it-works" ref={stepsRef}>
        <div className="hiw-inner">
          <div className="hiw-left">
            <p className="section-eyebrow">DEPLOYMENT</p>
            <h2 className="section-title">Up and running in&nbsp;48&nbsp;hours</h2>
            <p className="section-sub">
              No 6-month implementation projects. IAMShield is designed for fast
              time-to-value with a guided setup wizard and dedicated onboarding engineers.
            </p>

            <div className="hiw-steps">
              {steps.map((s, i) => (
                <div
                  key={s.n}
                  className={`hiw-step ${stepsVisible ? "hiw-step--visible" : ""}`}
                  style={{ "--delay": `${i * 120}ms` }}
                >
                  <div className="hiw-step__num">{s.n}</div>
                  <div className="hiw-step__body">
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hiw-right">
            <div className="network-wrapper">
              <NodeNetwork />
              <div className="network-labels">
                {["Identity Broker", "Policy Engine", "Threat Intel", "Audit Log", "MFA Gateway"].map((l, i) => (
                  <span key={l} className="network-label" style={{ "--i": i }}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="testimonials-section" id="testimonials" ref={testRef}>
        <div className="section-header">
          <p className="section-eyebrow">CUSTOMER STORIES</p>
          <h2 className="section-title">Security teams that ship with confidence</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`testimonial-card ${testVisible ? "testimonial-card--visible" : ""}`}
              style={{ "--delay": `${i * 100}ms` }}
            >
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">{t.quote}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <HexGrid />
        <div className="cta-content">
          <p className="section-eyebrow">GET STARTED</p>
          <h2 className="cta-title">Your perimeter starts here.</h2>
          <p className="cta-sub">
            Join 1,400+ enterprises securing their identity infrastructure with IAMShield.
            14-day free trial. No credit card. Full platform access.
          </p>
          <div className="cta-actions">
            <Link to="/signup" className="btn-primary btn-primary--large">
              Create Account →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Terminal feed component ───────────────────────────────────────────────────
const terminalLines = [
  { type: "info",    text: "[ SYS ] IAMShield Threat Monitor v4.2.1 initialized" },
  { type: "ok",      text: "[ OK  ] Identity broker connected — 3 nodes active" },
  { type: "ok",      text: "[ OK  ] Zero-trust policy engine loaded — 248 rules" },
  { type: "warn",    text: "[ WARN] Anomalous login attempt detected: user@corp.io" },
  { type: "block",   text: "[ BLOK] Access denied — risk score 94/100 · MFA required" },
  { type: "ok",      text: "[ OK  ] Behavioral baseline updated for 12,043 identities" },
  { type: "info",    text: "[ INF ] PAM session recorded: admin@infra · 00:04:22" },
  { type: "ok",      text: "[ OK  ] SOC 2 evidence snapshot — 847 controls passing" },
  { type: "warn",    text: "[ WARN] Privilege escalation attempt — user: svc_deploy" },
  { type: "block",   text: "[ BLOK] JIT access revoked — session expired after 30 min" },
  { type: "ok",      text: "[ OK  ] SSO federation synced — 5 identity providers" },
  { type: "info",    text: "[ INF ] Auth requests/sec: 14,882 · latency: 68ms avg" },
];

function TerminalFeed() {
  const [lines, setLines] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= terminalLines.length * 3) return;
    const t = setTimeout(() => {
      setLines((prev) => [...prev.slice(-18), terminalLines[idx % terminalLines.length]]);
      setIdx((i) => i + 1);
    }, 900 + Math.random() * 600);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <div className="terminal-feed">
      {lines.map((l, i) => (
        <div key={i} className={`t-line t-line--${l.type}`}>
          <span className="t-ts">{new Date().toTimeString().slice(0, 8)}</span>
          <span className="t-text">{l.text}</span>
        </div>
      ))}
      <div className="terminal-cursor-line">
        <span className="t-prompt">iamshield@ops:~$</span>
        <span className="t-blink">▋</span>
      </div>
    </div>
  );
}