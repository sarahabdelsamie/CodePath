const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["frontend", "backend", "ai", "mobile"],
      required: true,
    },
    difficultyLevel: {
      type: String,
      required: true,
    },
    steps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LearningStep",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);
