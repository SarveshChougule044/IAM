import "../../styles/auth.css";

const AuthLayout = ({ title, subtitle, sideTitle, sideText, children }) => {
  return (
    <section className="auth-shell">
      <div className="auth-panel">
        <div className="auth-panel__content">
          <div className="auth-panel__intro">
            <span className="auth-kicker">Assessment Platform</span>
            <h1>{sideTitle}</h1>
            <p>{sideText}</p>
          </div>

          <div className="auth-panel__form">
            <div className="auth-heading">
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;