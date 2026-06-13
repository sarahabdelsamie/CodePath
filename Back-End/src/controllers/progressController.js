const Progress = require("../models/Progress");

const getProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const progressList = await Progress.find({ userId }).populate("roadmapId");

    res.status(200).json({
      success: true,
      data: progressList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProgressByRoadmapId = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roadmapId } = req.params;

    const progress = await Progress.findOne({ userId, roadmapId }).populate("roadmapId");

    if (!progress) {
      return res.status(200).json({
        success: true,
        data: {
          userId,
          roadmapId,
          completedSteps: [],
          progressPercentage: 0,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProgress,
  getProgressByRoadmapId,
};
