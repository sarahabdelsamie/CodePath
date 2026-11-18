const express = require("express");
const router = express.Router();
const {
  getStepById,
  completeStep,
  createStep,
  updateStep,
  deleteStep,
} = require("../controllers/stepController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.get("/:id", getStepById);
router.post("/:id/complete", protect, completeStep);
router.post("/", protect, restrictTo("admin"), createStep);
router.put("/:id", protect, restrictTo("admin"), updateStep);
router.delete("/:id", protect, restrictTo("admin"), deleteStep);

module.exports = router;
