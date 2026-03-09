const WINDOW_MS = 15 * 60 * 1000;

const bucketStore = new Map();

const getClientKey = (req) => req.ip || req.headers["x-forwarded-for"] || "unknown";

export const rateLimiter = ({ windowMs = WINDOW_MS, max = 100, message = "Too many requests" } = {}) => {
  return (req, res, next) => {
    const key = `${getClientKey(req)}:${req.baseUrl || ""}:${req.path}`;
    const now = Date.now();

    const entry = bucketStore.get(key);
    if (!entry || now > entry.resetAt) {
      bucketStore.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
      console.warn(`[SECURITY] Rate limit exceeded for ${key}`);
      return res.status(429).json({ success: false, message });
    }

    entry.count += 1;
    return next();
  };
};

export const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  next();
};

const scrubValue = (value) => {
  if (typeof value === "string") {
    return value.replace(/[<>$]/g, "").trim();
  }

  if (Array.isArray(value)) {
    return value.map((item) => scrubValue(item));
  }

  if (value && typeof value === "object") {
    const cleaned = {};
    for (const [key, nested] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) continue;
      cleaned[key] = scrubValue(nested);
    }
    return cleaned;
  }

  return value;
};

const sanitizeObjectInPlace = (target) => {
  if (!target || typeof target !== "object") return;

  const cleaned = scrubValue(target);

  if (!cleaned || typeof cleaned !== "object") return;

  for (const key of Object.keys(target)) {
    if (!(key in cleaned)) {
      delete target[key];
    }
  }

  Object.assign(target, cleaned);
};

export const sanitizeRequest = (req, res, next) => {
  sanitizeObjectInPlace(req.body);
  sanitizeObjectInPlace(req.query);
  sanitizeObjectInPlace(req.params);
  next();
};
