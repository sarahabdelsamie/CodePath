const express = require("express");
const router = express.Router();
const { getAllRoadmaps, getRoadmapById } = require("../controllers/roadmapController");

router.get("/", getAllRoadmaps);
router.get("/:id", getRoadmapById);

module.exports = router;
