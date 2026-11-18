const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const stepRoutes = require("./routes/stepRoutes");
const progressRoutes = require("./routes/progressRoutes");
const profileRoutes = require("./routes/profileRoutes");
const mentorRoutes = require("./routes/mentorRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Ensure database connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("DB connection error in middleware:", err.message);
  }
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/steps", stepRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "An unexpected error occurred",
  });
});

module.exports = app;