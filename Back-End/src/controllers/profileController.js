const User = require("../models/User");
const Progress = require("../models/Progress");
const { updateProfileSchema } = require("./validation/authValidation");

const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    // Fetch the user's progress history
    const progressHistory = await Progress.find({ userId }).populate({
      path: "roadmapId",
      populate: {
        path: "steps",
        options: { sort: { order: 1 } },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        learningHistory: progressHistory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { error } = updateProfileSchema(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, learningPath, skillLevel } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    // Only allow learners to update learningPath and skillLevel
    if (user.role === "learner") {
      if (learningPath !== undefined) {
        user.learningPath = learningPath;
      }
      if (skillLevel !== undefined) {
        user.skillLevel = skillLevel;
      }
    }

    await user.save();

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      learningPath: user.learningPath,
      skillLevel: user.skillLevel,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
