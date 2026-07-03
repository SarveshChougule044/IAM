// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

// ----------------------
// Security middleware
// ----------------------

// Security headers
app.use(helmet());

// Remove Express fingerprint
app.disable("x-powered-by");

// CORS: allow both dev and deployed frontend
const allowedOrigins = [
  "http://localhost:5173",           // Vite dev
  "https://iam00.onrender.com",      // Render frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Rate limiting on all /api routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api/", apiLimiter);

// Only allow safe HTTP methods globally
app.use((req, res, next) => {
  const allowed = ["GET", "POST", "PUT", "DELETE"];
  if (!allowed.includes(req.method)) {
    return res.status(405).json({ error: "Method not allowed" });
  }
  next();
});

// Path traversal protection
app.use((req, res, next) => {
  const safePath = path.normalize(req.path);
  if (safePath.includes("..")) {
    return res.status(400).json({ error: "Invalid path" });
  }
  next();
});

// ----------------------
// Body parsing + sanitization
// ----------------------
app.use(express.json());

// Basic input sanitization (strip $ and . from keys)
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    const sanitize = (obj) => {
      for (const key of Object.keys(obj)) {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          sanitize(obj[key]);
        }
      }
    };
    sanitize(req.body);
  }
  next();
});

// ----------------------
// Routes
// ----------------------
const authRoutes = require("./routes/authRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/admin", adminAuthRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", storage: "file-based" });
});

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (file-based storage)`);
});