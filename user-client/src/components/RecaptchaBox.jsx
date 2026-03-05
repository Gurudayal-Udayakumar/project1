import { useEffect, useRef } from "react";

export default function RecaptchaBox({ onChange }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (window.grecaptcha && widgetIdRef.current === null) {
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => onChange?.(token),
          "expired-callback": () => onChange?.(""),
          "error-callback": () => onChange?.(""),
        });
        clearInterval(timer);
      }

      if (attempts > 30) clearInterval(timer);
    }, 200);

    return () => clearInterval(timer);
  }, [onChange, siteKey]);

  if (!siteKey) {
    return <p className="login-error">Security check is unavailable. Please contact support.</p>;
  }

  return <div className="recaptcha-wrap" ref={containerRef} />;
}
