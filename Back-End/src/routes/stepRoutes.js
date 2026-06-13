const express = require("express");
const router = express.Router();
const { getStepById, completeStep } = require("../controllers/stepController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:id", getStepById);
router.post("/:id/complete", protect, completeStep);

module.exports = router;
