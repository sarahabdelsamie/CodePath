const mongoose = require("mongoose");

const learningStepSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    resources: [
      {
        type: String,
      },
    ],
    exercises: [
      {
        type: String,
      },
    ],
    order: {
      type: Number,
      required: true,
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LearningStep", learningStepSchema);
