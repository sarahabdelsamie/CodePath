const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // Require authentication for all dashboard routes

router.get("/", getDashboardData);

module.exports = router;
