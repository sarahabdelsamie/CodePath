const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },
    completedSteps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LearningStep",
      },
    ],
    progressPercentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "lastUpdated" },
  }
);

// Unique compound index so a user only has one progress document per roadmap
progressSchema.index({ userId: 1, roadmapId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
