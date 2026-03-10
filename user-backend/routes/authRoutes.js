import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/User.js";
import { validateAuthPayload, validateRegisterPayload } from "../middleware/validationMiddleware.js";
import { rateLimiter } from "../middleware/securityMiddleware.js";
import { verifyRecaptcha } from "../middleware/recaptchaMiddleware.js";

const router = express.Router(); // Single router instance for auth routes.

const getSafeClientRedirectUrl = () => {
  try {
    const url = new URL(process.env.CLIENT_URL);
    return url.origin;
  } catch {
    return null;
  }
};

const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again later.",
});

/* =========================
   COMMON TOKEN CREATOR
========================= */
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

/* =========================
   USER LOGIN
========================= */
router.post(
  "/login",
  authRateLimiter,
  validateAuthPayload,
  verifyRecaptcha,
  async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email: normalizedEmail, role: "user" });
    if (!user) {
      console.warn(`[AUTH] Failed user login for ${normalizedEmail}`);
      return res.status(401).json({
        success: false,
        message: "Invalid user credentials",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({ success: false, message: "Account is disabled" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`[AUTH] Invalid password for ${normalizedEmail}`);
      return res.status(401).json({
        success: false,
        message: "Invalid user credentials",
      });
    }

    const token = createToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("USER LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   ADMIN LOGIN
========================= */
router.post("/admin/login", authRateLimiter, validateAuthPayload, async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const admin = await User.findOne({ email: normalizedEmail });

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });
    }

    if (admin.isActive === false) {
      return res.status(403).json({ success: false, message: "Account is disabled" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.warn(`[AUTH] Invalid admin password for ${normalizedEmail}`);
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const token = createToken(admin);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   USER REGISTER
========================= */
router.post(
  "/register",
  authRateLimiter,
  validateRegisterPayload,
  verifyRecaptcha,
  async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      success: true,
      message: "Registered successfully",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================
   GOOGLE LOGIN
========================= */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/logout", (req, res) => {
  try {
    if (req.logout) {
      req.logout(() => {});
    }
    res.clearCookie("connect.sid");
    res.json({ success: true });
  } catch {
    res.json({ success: true });
  }
});

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = createToken(req.user);
    const safeClientOrigin = getSafeClientRedirectUrl();

    if (!safeClientOrigin) {
      return res.status(500).json({ success: false, message: "Invalid CLIENT_URL configuration" });
    }

    return res.redirect(`${safeClientOrigin}/google-success?token=${token}`);
  }
);

export default router;
