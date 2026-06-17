const express = require("express");
const router = express.Router();
const {
  getAllRoadmaps,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
} = require("../controllers/roadmapController");

router.get("/", getAllRoadmaps);
router.get("/:id", getRoadmapById);
router.post("/", createRoadmap);
router.put("/:id", updateRoadmap);
router.delete("/:id", deleteRoadmap);

module.exports = router;
