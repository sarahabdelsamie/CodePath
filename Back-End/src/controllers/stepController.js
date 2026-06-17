const LearningStep = require("../models/LearningStep");
const Progress = require("../models/Progress");
const Roadmap = require("../models/Roadmap");

const getStepById = async (req, res) => {
  try {
    const { id } = req.params;
    const step = await LearningStep.findById(id);

    if (!step) {
      return res.status(404).json({
        success: false,
        message: "Learning step not found",
      });
    }

    res.status(200).json({
      success: true,
      data: step,
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
    const { id } = req.params;
    const step = await LearningStep.findById(id);

    if (!step) {
      return res.status(404).json({
        success: false,
        message: "Learning step not found",
      });
    }

    const roadmapId = step.roadmapId;
    const userId = req.user._id;

    // Get total steps in this roadmap
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found for this step",
      });
    }

    const totalStepsCount = roadmap.steps.length;

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
    const stepIdString = id.toString();
    const alreadyCompleted = progress.completedSteps.some(
      (completedStepId) => completedStepId.toString() === stepIdString
    );

    if (!alreadyCompleted) {
      progress.completedSteps.push(id);
    }

    // Calculate percentage
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

const createStep = async (req, res) => {
  try {
    const { title, content, resources, exercises, order, roadmapId } = req.body;

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found for this step",
      });
    }

    const step = await LearningStep.create({
      title,
      content,
      resources,
      exercises,
      order,
      roadmapId,
    });

    roadmap.steps.push(step._id);
    await roadmap.save();

    res.status(201).json({
      success: true,
      data: step,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, resources, exercises, order } = req.body;

    const step = await LearningStep.findByIdAndUpdate(
      id,
      { title, content, resources, exercises, order },
      { new: true, runValidators: true }
    );

    if (!step) {
      return res.status(404).json({
        success: false,
        message: "Learning step not found",
      });
    }

    res.status(200).json({
      success: true,
      data: step,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteStep = async (req, res) => {
  try {
    const { id } = req.params;
    const step = await LearningStep.findByIdAndDelete(id);

    if (!step) {
      return res.status(404).json({
        success: false,
        message: "Learning step not found",
      });
    }

    await Roadmap.findByIdAndUpdate(step.roadmapId, {
      $pull: { steps: step._id },
    });

    res.status(200).json({
      success: true,
      message: "Learning step deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getStepById,
  completeStep,
  createStep,
  updateStep,
  deleteStep,
};
