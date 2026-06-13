const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // All profile routes require authentication

router.get("/", getProfile);
router.put("/", updateProfile);

module.exports = router;
