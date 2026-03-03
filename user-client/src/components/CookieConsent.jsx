import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/CookieConsent.css";
import { API_BASE_URL } from "../config/env";

const BACKEND_URL =
  API_BASE_URL;

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem("cookieConsent");
    if (!local) setVisible(true);
  }, []);

  const saveConsent = async (consent) => {
    // 1️⃣ Save locally (instant UX)
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({ consent, date: new Date().toISOString() })
    );

    // 2️⃣ Save on backend (persistent)
    try {
      await axios.post(`${BACKEND_URL}/api/cookie-consent`, { consent });
    } catch (err) {
      console.warn("Consent backend save failed (safe)");
    }

    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p>
        We use cookies to improve your experience. Read our{" "}
        <Link to="/cookie-policy">Cookie Policy</Link>.
      </p>

      <div className="cookie-actions">
        <button className="reject-btn" onClick={() => saveConsent(false)}>
          Reject
        </button>
        <button className="accept-btn" onClick={() => saveConsent(true)}>
          Accept
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
