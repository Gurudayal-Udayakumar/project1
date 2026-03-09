import express from "express";
import {
  sendContactMessage,
  getAllMessages,
} from "../controllers/contactController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { enforceRequiredFields } from "../middleware/validationMiddleware.js";
import { rateLimiter } from "../middleware/securityMiddleware.js";

const router = express.Router();

const contactLimiter = rateLimiter({ windowMs: 10 * 60 * 1000, max: 20, message: "Too many contact requests" });

// User
router.post("/", contactLimiter, enforceRequiredFields(["name", "email", "subject", "message"]), sendContactMessage);

// Admin
router.get("/", authMiddleware, adminMiddleware, getAllMessages);

export default router;
