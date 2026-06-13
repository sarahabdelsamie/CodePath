const express = require("express");
const router = express.Router();
const { getProgress, getProgressByRoadmapId } = require("../controllers/progressController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // All progress routes require authentication

router.get("/", getProgress);
router.get("/:roadmapId", getProgressByRoadmapId);

module.exports = router;
