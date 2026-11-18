const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getAdminRoadmaps,
  getReports,
  createReport,
  updateReportStatus,
  getSettings,
  updateSettings,
} = require("../controllers/adminController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Any authenticated user can submit a report or violation
router.post("/reports", protect, createReport);

// All other admin routes strictly require role: "admin"
router.use(protect, restrictTo("admin"));

// Statistics & Overview
router.get("/stats", getAdminStats);

// User Management
router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Roadmaps / Content Overview
router.get("/roadmaps", getAdminRoadmaps);

// Reports Management
router.get("/reports", getReports);
router.put("/reports/:id", updateReportStatus);

// System Configuration & Settings
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

module.exports = router;
