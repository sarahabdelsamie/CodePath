const mongoose = require("mongoose");
const Roadmap = require("../models/Roadmap");

const getAllRoadmaps = async (req, res) => {
  try {
    const { category, difficultyLevel } = req.query;
    const filter = {};

    if (category) {
      filter.category = category.toLowerCase();
    }
    if (difficultyLevel) {
      filter.difficultyLevel = difficultyLevel.toLowerCase();
    }

    // Populate steps sorted by order
    const roadmaps = await Roadmap.find(filter).populate({
      path: "steps",
      options: { sort: { order: 1 } },
    });

    res.status(200).json({
      success: true,
      data: roadmaps,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;
    let roadmap;

    if (mongoose.Types.ObjectId.isValid(id)) {
      roadmap = await Roadmap.findById(id).populate({
        path: "steps",
        options: { sort: { order: 1 } },
      });
    } else {
      // If it is not a valid ObjectId, try finding it as a category name
      roadmap = await Roadmap.findOne({ category: id.toLowerCase() }).populate({
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

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createRoadmap = async (req, res) => {
  try {
    const { title, description, category, difficultyLevel } = req.body;
    
    const roadmap = await Roadmap.create({
      title,
      description,
      category: category ? category.toLowerCase() : undefined,
      difficultyLevel: difficultyLevel ? difficultyLevel.toLowerCase() : undefined,
      steps: [],
    });

    res.status(201).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, difficultyLevel } = req.body;

    const roadmap = await Roadmap.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category: category ? category.toLowerCase() : undefined,
        difficultyLevel: difficultyLevel ? difficultyLevel.toLowerCase() : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const roadmap = await Roadmap.findByIdAndDelete(id);

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Roadmap deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllRoadmaps,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
};
