const express = require("express");
const router = express.Router();
const {
  getAllRoadmaps,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
} = require("../controllers/roadmapController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.get("/", getAllRoadmaps);
router.get("/:id", getRoadmapById);
router.post("/", protect, restrictTo("admin"), createRoadmap);
router.put("/:id", protect, restrictTo("admin"), updateRoadmap);
router.delete("/:id", protect, restrictTo("admin"), deleteRoadmap);

module.exports = router;
