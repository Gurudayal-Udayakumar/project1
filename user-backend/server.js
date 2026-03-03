import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import passport from "passport";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { rateLimiter, sanitizeRequest, securityHeaders } from "./middleware/securityMiddleware.js";

import "./config/passport.js";

/* ===== ROUTES ===== */
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import shippingRoutes from "./routes/shippingRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import returnRouters from "./routes/returnRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import cookieConsentRoutes from "./routes/cookieConsentRoutes.js";


dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean);

const uniqueAllowedOrigins = [...new Set(allowedOrigins)];

if (isProduction && uniqueAllowedOrigins.length === 0) {
  console.error("❌ Missing required CORS origins. Set CLIENT_URL and ADMIN_URL in production.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ Missing required environment variable: JWT_SECRET");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("❌ Missing required environment variable: MONGO_URI");
  process.exit(1);
}

if (!process.env.CLIENT_URL || !process.env.ADMIN_URL) {
  console.error("❌ Missing required environment variables: CLIENT_URL and ADMIN_URL");
  process.exit(1);
}

/* =========================
   APP & SERVER
========================= */
const app = express();
const httpServer = createServer(app);

/* =========================
   SOCKET.IO (JWT SECURED)
========================= */
const io = new Server(httpServer, {
  cors: {
    origin: uniqueAllowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

/* 🔐 SOCKET AUTH MIDDLEWARE */
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;

    next();
  } catch (error) {
    console.log("AUTH MIDDLEWARE ERROR:", error.message);
    next(new Error("Authentication failed"));
  }
});

/* 🔌 SOCKET CONNECTION */
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

export { io };

/* =========================
   MIDDLEWARE
========================= */
app.use(requestLogger);
app.use(securityHeaders);
app.use(sanitizeRequest);
app.use(rateLimiter({ max: 300, windowMs: 15 * 60 * 1000 }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || uniqueAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

/* =========================
   PASSPORT INIT (IMPORTANT)
========================= */
app.use(passport.initialize());

/* =========================
   STATIC FILES
========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/returns", returnRouters);
app.use("/api/faq", faqRoutes);
app.use("/api/cookie-consent", cookieConsentRoutes);

app.use("/api/newsletter", newsletterRoutes);


/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, uptime: process.uptime() });
});

/* =========================
   404 HANDLER
========================= */
app.use(notFoundHandler);

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use(errorHandler);

/* =========================
   DATABASE + SERVER
========================= */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
