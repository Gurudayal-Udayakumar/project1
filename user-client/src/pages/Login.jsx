import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "../styles/Login.css";
import { API_BASE_URL } from "../config/env";
import RecaptchaBox from "../components/RecaptchaBox";
import AuthFooter from "../components/AuthFooter";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const navigate = useNavigate();

  /* ======================
     HELPERS FOR UI HINTS
  ====================== */
  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length > 0;

  const passwordValid = password.length >= 6;

  /* ======================
     VALIDATION
  ====================== */
  const validate = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }

    if (!emailValid) {
      setError("Enter a valid email address");
      return false;
    }

    if (!passwordValid) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA verification");
      return false;
    }

    setError("");
    return true;
  };

  /* ======================
     LOGIN SUBMIT
  ====================== */
  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await loginUser({ email, password, recaptchaToken });

      if (!res?.token) {
        setError(res?.message || "Login failed");
        return;
      }

      // ✅ STORE TOKEN
      localStorage.setItem("userToken", res.token);

      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
      }

      navigate("/home");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     GOOGLE LOGIN
  ====================== */
  const googleLogin = () => {
 window.location.href = `${API_BASE_URL}/api/auth/google?prompt=select_account`;
};

  /* ======================
     UI
  ====================== */
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="brand-mark" aria-hidden="true">KS</div>
        <h1 className="site-title">KidsStore</h1>
        <p className="site-tagline">Official online store</p>
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your account</p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={submit}>
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p
            className={`input-hint ${
              email.length === 0
                ? ""
                : emailValid
                ? "valid"
                : "invalid"
            }`}
          >
            Enter a valid email (example@domain.com)
          </p>

          {/* PASSWORD */}
          <div className="password-field">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="eye" onClick={() => setShow(!show)}>
              {show ? "👁️" : "🙈"}
            </span>
          </div>
          <p
            className={`input-hint ${
              password.length === 0
                ? ""
                : passwordValid
                ? "valid"
                : "invalid"
            }`}
          >
            Password must be at least 6 characters
          </p>

          <RecaptchaBox onChange={setRecaptchaToken} />

          <button className="primary-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="link" onClick={() => navigate("/forgot")}>
          Forgot password?
        </p>

        <div className="divider">OR</div>

        <button className="google-btn" onClick={googleLogin}>
          Continue with Google
        </button>

        <p className="switch">
          Don’t have an account?
          <span onClick={() => navigate("/register")}> Register</span>
        </p>
      </div>
      <AuthFooter />
    </div>
  );
}
