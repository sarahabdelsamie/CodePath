const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["learner", "mentor", "admin"],
      default: "learner",
    },
    learningPath: {
      type: String,
      enum: ["frontend", "backend", "ai", "mobile"],
      required: function() {
        return this.role === "learner";
      },
    },
    skillLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: function() {
        return this.role === "learner";
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);