const Roadmap = require("../models/Roadmap");

const getAllRoadmaps = async (req, res) => {
  try {
    const { category, difficultyLevel } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (difficultyLevel) {
      filter.difficultyLevel = difficultyLevel;
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
    const roadmap = await Roadmap.findById(id).populate({
      path: "steps",
      options: { sort: { order: 1 } },
    });

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

module.exports = {
  getAllRoadmaps,
  getRoadmapById,
};
