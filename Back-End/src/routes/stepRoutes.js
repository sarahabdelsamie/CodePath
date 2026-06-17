const express = require("express");
const router = express.Router();
const {
  getStepById,
  completeStep,
  createStep,
  updateStep,
  deleteStep,
} = require("../controllers/stepController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:id", getStepById);
router.post("/:id/complete", protect, completeStep);
router.post("/", protect, createStep);
router.put("/:id", protect, updateStep);
router.delete("/:id", protect, deleteStep);

module.exports = router;
