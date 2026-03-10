import { useEffect, useMemo, useRef } from "react";

const getMappedKeyByHost = (mappedKeys, host) => {
  if (!mappedKeys || !host) return null;

  if (mappedKeys[host]) {
    return mappedKeys[host];
  }

  const wildcardKey = Object.entries(mappedKeys).find(([pattern]) => {
    if (!pattern.startsWith("*.")) return false;
    const suffix = pattern.slice(1); // ".example.com"
    return host.endsWith(suffix);
  });

  if (wildcardKey) {
    return wildcardKey[1];
  }

  return mappedKeys.default || null;
};

const resolveSiteKey = () => {
  const directKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const mappedKeysRaw = import.meta.env.VITE_RECAPTCHA_SITE_KEY_BY_DOMAIN;

  if (mappedKeysRaw && typeof window !== "undefined") {
    try {
      const mappedKeys = JSON.parse(mappedKeysRaw);
      const host = window.location.hostname;
      const mappedKey = getMappedKeyByHost(mappedKeys, host);

      if (mappedKey) {
        return mappedKey;
      }
    } catch {
      // fall back to direct key below
    }
  }

  return directKey;
};

export default function RecaptchaBox({ onChange }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const siteKey = useMemo(resolveSiteKey, []);

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
    return (
      <p className="login-error">
        Security check unavailable: missing reCAPTCHA site key configuration.
      </p>
    );
  }

  return <div className="recaptcha-wrap" ref={containerRef} />;
}
