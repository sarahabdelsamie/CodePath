const express = require("express");
const router = express.Router();
const { getMentorOverview } = require("../controllers/mentorController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Mentor route requires being logged in and having the role "mentor"
router.get("/overview", protect, restrictTo("mentor"), getMentorOverview);

module.exports = router;
