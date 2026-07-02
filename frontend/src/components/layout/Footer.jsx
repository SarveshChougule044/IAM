import { Link } from "react-router-dom";
import "../../styles/footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__logo">
            IAMShield
          </Link>
          <p className="site-footer__text">
            Identity security and access governance for modern enterprises.
          </p>
          <p className="site-footer__trust">
            Secure access. Risk visibility. Actionable recommendations.
          </p>
        </div>

        <div className="site-footer__links">
          <div className="site-footer__column">
            <h3>Product</h3>
            <Link to="/">Home</Link>
            <Link to="/assessment">Assessment</Link>
            <Link to="/recommendations">Recommendations</Link>
            <Link to="/request-demo">Request Demo</Link>
          </div>

          <div className="site-footer__column">
            <h3>Account</h3>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/forgot-password">Forgot Password</Link>
          </div>

          <div className="site-footer__column">
            <h3>Company</h3>
            <a href="mailto:support@iamshield.com">support@iamshield.com</a>
            <a href="tel:+911234567890">+91 12345 67890</a>
            <span>Bengaluru, India</span>
          </div>

          <div className="site-footer__column">
            <h3>Legal</h3>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/security">Security</Link>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© 2026 IAMShield. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;