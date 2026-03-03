import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

import "../styles/Footer.css";
import { API_BASE_URL } from "../config/env";

const BACKEND_URL =
  API_BASE_URL;

export default function Footer({ showNewsletter = true }) {
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  /* =========================
     📩 NEWSLETTER SUBSCRIBE
  ========================= */
  const handleSubscribe = async () => {
    if (!email.trim()) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await axios.post(
        `${BACKEND_URL}/api/newsletter/subscribe`,
        { email }
      );

      setMessage(res.data.message || "Subscribed successfully 🎉");
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Subscription failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      {/* ================= NEWSLETTER ================= */}
      {showNewsletter && (
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3>Stay Updated</h3>
            <p>Get offers, new arrivals & kids fashion updates</p>

            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || subscribed}
              />

              <button
                className="newsletter-btn"
                onClick={handleSubscribe}
                disabled={loading || subscribed}
              >
                {subscribed
                  ? "Subscribed ✓"
                  : loading
                  ? "Subscribing..."
                  : "Subscribe"}
              </button>
            </div>

            {message && (
              <p className="newsletter-success">{message}</p>
            )}
            {error && (
              <p className="newsletter-error">{error}</p>
            )}
          </div>
        </div>
      )}

      {/* ================= MAIN FOOTER ================= */}
      <div className="footer-main">
        <div className="footer-grid">

          {/* ABOUT */}
          <div className="footer-column">
            <div className="footer-logo">
              Kids<span>Store</span>
            </div>
            <p className="footer-desc">
              Quality kids wear designed with comfort, care,
              and happiness in mind.
            </p>

            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <FaTwitter />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-column">
            <h4>Shop</h4>
            <ul className="footer-links">
              <li><Link to="/boys">Boys</Link></li>
              <li><Link to="/girls">Girls</Link></li>
              <li><Link to="/offers">Offers</Link></li>
              <li><Link to="/favorites">Wishlist</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div className="footer-column">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="footer-column">
            <h4>Contact</h4>
            <ul className="contact-info">
              <li>
                <FaMapMarkerAlt />
                <span>123 Kids Avenue, NY 10001</span>
              </li>
              <li>
                <FaPhone />
                <a href="tel:+919361876698">+91 93618 76698</a>
              </li>
              <li>
                <FaEnvelope />
                <a href="mailto:support@kidsstore.com">
                  support@kidsstore.com
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ================= FOOTER BOTTOM ================= */}
      <div className="footer-bottom">
        <p>
          © {currentYear} <strong>KidsStore</strong>. All rights reserved.
        </p>

        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <span>•</span>
          <Link to="/terms">Terms of Service</Link>
          <span>•</span>
          <Link to="/cookie-policy">Cookie Policy</Link>
        </div>

        <p className="made-with">
          Made with <FaHeart className="heart-icon" /> for kids everywhere
        </p>
      </div>
    </footer>
  );
}
