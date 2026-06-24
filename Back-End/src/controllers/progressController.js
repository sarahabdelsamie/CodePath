const mongoose = require("mongoose");
const Progress = require("../models/Progress");
const Roadmap = require("../models/Roadmap");
const LearningStep = require("../models/LearningStep");

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

    let roadmap;
    if (mongoose.Types.ObjectId.isValid(roadmapId)) {
      roadmap = await Roadmap.findById(roadmapId).populate({
        path: "steps",
        options: { sort: { order: 1 } },
      });
    } else {
      roadmap = await Roadmap.findOne({ category: roadmapId.toLowerCase() }).populate({
        path: "steps",
        options: { sort: { order: 1 } },
      });
    }

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    const progress = await Progress.findOne({ userId, roadmapId: roadmap._id });

    const completedSteps = progress ? progress.completedSteps : [];
    const progressPercentage = progress ? progress.progressPercentage : 0;

    const stepsWithCompletion = roadmap.steps.map((step) => {
      const isCompleted = completedSteps.some(
        (completedId) => completedId.toString() === step._id.toString()
      );
      return {
        ...step.toObject(),
        completed: isCompleted,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        completedSteps,
        progressPercentage,
        steps: stepsWithCompletion,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const completeStep = async (req, res) => {
  try {
    const { roadmapId, stepId } = req.params;
    const userId = req.user._id;

    // Check if roadmap exists
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    // Check if step exists
    const step = await LearningStep.findById(stepId);
    if (!step) {
      return res.status(404).json({
        success: false,
        message: "Learning step not found",
      });
    }

    // Check if the step belongs to the roadmap
    if (step.roadmapId.toString() !== roadmapId) {
      return res.status(400).json({
        success: false,
        message: "This step does not belong to the specified roadmap",
      });
    }

    // Find or create progress document
    let progress = await Progress.findOne({ userId, roadmapId });
    if (!progress) {
      progress = new Progress({
        userId,
        roadmapId,
        completedSteps: [],
      });
    }

    // Add step to completedSteps if it's not already there
    const stepIdString = stepId.toString();
    const alreadyCompleted = progress.completedSteps.some(
      (completedStepId) => completedStepId.toString() === stepIdString
    );

    if (!alreadyCompleted) {
      progress.completedSteps.push(stepId);
    }

    // Calculate percentage
    const totalStepsCount = roadmap.steps.length;
    if (totalStepsCount > 0) {
      progress.progressPercentage = Math.round(
        (progress.completedSteps.length / totalStepsCount) * 100
      );
    } else {
      progress.progressPercentage = 0;
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Step completed successfully",
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
  completeStep,
};
