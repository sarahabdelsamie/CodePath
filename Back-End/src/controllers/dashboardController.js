const Progress = require("../models/Progress");
const Roadmap = require("../models/Roadmap");
const LearningStep = require("../models/LearningStep");

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all progress records for the user, sorted by lastUpdated descending
    const progressList = await Progress.find({ userId })
      .sort({ lastUpdated: -1 })
      .populate("roadmapId")
      .populate("completedSteps");

    // Calculate total completed steps count across all roadmaps
    const totalCompletedStepsCount = progressList.reduce(
      (sum, progress) => sum + (progress.completedSteps ? progress.completedSteps.length : 0),
      0
    );

    if (progressList.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          activeRoadmap: null,
          recentlyCompletedSteps: [],
          recommendedNextStep: null,
          totalCompletedStepsCount: 0,
        },
      });
    }

    // Determine the active roadmap based on the most recently updated progress record
    const activeProgress = progressList[0];
    
    // Fetch full active roadmap and populate steps (sorted by order)
    let activeRoadmapData = null;
    let recommendedNextStep = null;

    if (activeProgress.roadmapId) {
      const activeRoadmap = await Roadmap.findById(activeProgress.roadmapId._id).populate({
        path: "steps",
        options: { sort: { order: 1 } },
      });

      if (activeRoadmap) {
        activeRoadmapData = {
          _id: activeRoadmap._id,
          title: activeRoadmap.title,
          description: activeRoadmap.description,
          category: activeRoadmap.category,
          difficultyLevel: activeRoadmap.difficultyLevel,
          progressPercentage: activeProgress.progressPercentage,
          completedStepsCount: activeProgress.completedSteps.length,
          totalStepsCount: activeRoadmap.steps.length,
        };

        // Determine recommended next step: the first incomplete step in the active roadmap
        const completedStepIds = activeProgress.completedSteps.map((step) =>
          step._id.toString()
        );

        recommendedNextStep = activeRoadmap.steps.find(
          (step) => !completedStepIds.includes(step._id.toString())
        ) || null;
      }
    }

    // Get recently completed steps (last 5 across all roadmaps)
    const completedStepsWithMetadata = [];
    for (const progress of progressList) {
      if (!progress.roadmapId || !progress.completedSteps) continue;

      // Reverse completedSteps to get the most recent first
      const steps = [...progress.completedSteps].reverse();
      for (const step of steps) {
        completedStepsWithMetadata.push({
          _id: step._id,
          title: step.title,
          order: step.order,
          roadmapId: progress.roadmapId._id,
          roadmapTitle: progress.roadmapId.title,
          completedAt: progress.lastUpdated, // Proxy date
        });
      }
    }

    const recentlyCompletedSteps = completedStepsWithMetadata.slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        activeRoadmap: activeRoadmapData,
        recentlyCompletedSteps,
        recommendedNextStep,
        totalCompletedStepsCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardData,
};
