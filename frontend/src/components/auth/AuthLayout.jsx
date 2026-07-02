import "../../styles/auth.css";

const AuthLayout = ({ title, subtitle, children, sideTitle, sideText }) => {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__left">
          <p className="auth-badge">Smart Platform</p>
          <h1>{sideTitle}</h1>
          <p>{sideText}</p>
        </div>

        <div className="auth-card__right">
          <div className="auth-form-wrapper">
            <h2>{title}</h2>
            <p>{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;