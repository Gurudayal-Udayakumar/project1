import express from "express";
import {
  subscribeEmail,
  sendOfferToSubscribers,
} from "../controllers/newsletterController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { enforceRequiredFields } from "../middleware/validationMiddleware.js";
import { rateLimiter } from "../middleware/securityMiddleware.js";

const router = express.Router();

const newsletterLimiter = rateLimiter({ windowMs: 10 * 60 * 1000, max: 15, message: "Too many subscription requests" });

router.post("/subscribe", newsletterLimiter, enforceRequiredFields(["email"]), subscribeEmail);
router.post("/send-offer", authMiddleware, adminMiddleware, enforceRequiredFields(["title", "description"]), sendOfferToSubscribers); // admin only

export default router;
