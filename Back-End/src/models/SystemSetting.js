const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: "CodePath Platform",
    },
    allowUserRegistration: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    defaultLearningPath: {
      type: String,
      default: "frontend",
    },
    supportEmail: {
      type: String,
      default: "support@codepath.com",
    },
    maxMenteesPerMentor: {
      type: Number,
      default: 15,
    },
    announcementBanner: {
      type: String,
      default: "Welcome to CodePath 2.0! Explore verified tech career roadmaps.",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SystemSetting", systemSettingSchema);
