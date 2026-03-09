const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email) => typeof email === "string" && emailRegex.test(email.toLowerCase());

export const enforceRequiredFields = (fields = []) => (req, res, next) => {
  const missing = fields.filter((field) => !req.body?.[field]);
  if (missing.length) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missing.join(", ")}`,
    });
  }
  next();
};

export const validateAuthPayload = (req, res, next) => {
  const { email, password } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  if (typeof password !== "string" || password.length < 1 || password.length > 128) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  next();
};

export const validateRegisterPayload = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: "Name must be at least 2 characters" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  if (typeof password !== "string" || password.length < 1 || password.length > 128) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  next();
};
