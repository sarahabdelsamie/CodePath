const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporterName: {
      type: String,
      default: "Anonymous",
    },
    reporterEmail: {
      type: String,
      default: "unknown@codepath.com",
    },
    targetType: {
      type: String,
      enum: ["roadmap", "step", "user", "comment", "general"],
      default: "general",
    },
    targetTitle: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "investigating", "resolved", "dismissed"],
      default: "pending",
    },
    resolutionNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", reportSchema);
