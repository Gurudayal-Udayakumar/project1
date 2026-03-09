import { Link } from "react-router-dom";

export default function AuthFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="auth-footer">
      <div className="auth-footer-inner">
        <p><strong>KidsStore</strong> • support@kidsstore.com</p>
        <div className="auth-footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
        </div>
        <p>© {year} KidsStore. All rights reserved.</p>
      </div>
    </footer>
  );
}
