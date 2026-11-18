const User = require("../models/User");
const Roadmap = require("../models/Roadmap");
const LearningStep = require("../models/LearningStep");
const Progress = require("../models/Progress");
const Report = require("../models/Report");
const SystemSetting = require("../models/SystemSetting");

// 1. Admin Statistics Overview
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const learnerCount = await User.countDocuments({ role: "learner" });
    const mentorCount = await User.countDocuments({ role: "mentor" });
    const adminCount = await User.countDocuments({ role: "admin" });

    const totalRoadmaps = await Roadmap.countDocuments();
    const totalSteps = await LearningStep.countDocuments();
    const totalProgressRecords = await Progress.countDocuments();

    const progressRecords = await Progress.find().select("completedSteps");
    const totalCompletedSteps = progressRecords.reduce(
      (sum, p) => sum + (p.completedSteps ? p.completedSteps.length : 0),
      0
    );

    const pendingReportsCount = await Report.countDocuments({ status: "pending" });

    // Category breakdown
    const categories = ["frontend", "backend", "ai", "mobile"];
    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const roadmaps = await Roadmap.countDocuments({ category: cat });
        const learners = await User.countDocuments({ role: "learner", learningPath: cat });
        return { category: cat, roadmaps, learners };
      })
    );

    // Recent 5 users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password");

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        learnerCount,
        mentorCount,
        adminCount,
        totalRoadmaps,
        totalSteps,
        totalProgressRecords,
        totalCompletedSteps,
        pendingReportsCount,
        categoryStats,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. User Management
const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};

    if (role && role !== "all") {
      filter.role = role.toLowerCase();
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["learner", "mentor", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Clean up user progress
    await Progress.deleteMany({ userId: id });

    res.status(200).json({
      success: true,
      message: "User and associated progress deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. Content Management (Roadmaps & Steps)
const getAdminRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find()
      .populate({
        path: "steps",
        options: { sort: { order: 1 } },
      })
      .sort({ createdAt: -1 });

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

// 4. Reports & Violations Management
const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createReport = async (req, res) => {
  try {
    const { targetType, targetTitle, reason } = req.body;
    const report = await Report.create({
      reporterName: req.user ? req.user.name : "Anonymous",
      reporterEmail: req.user ? req.user.email : "guest@codepath.com",
      targetType: targetType || "general",
      targetTitle: targetTitle || "General Issue",
      reason,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    if (!["pending", "investigating", "resolved", "dismissed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status, resolutionNotes: resolutionNotes || "" },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 5. System Configuration & Platform Settings
const getSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = await SystemSetting.create({});
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = new SystemSetting({});
    }

    const {
      platformName,
      allowUserRegistration,
      maintenanceMode,
      defaultLearningPath,
      supportEmail,
      maxMenteesPerMentor,
      announcementBanner,
    } = req.body;

    if (platformName !== undefined) settings.platformName = platformName;
    if (allowUserRegistration !== undefined) settings.allowUserRegistration = allowUserRegistration;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (defaultLearningPath !== undefined) settings.defaultLearningPath = defaultLearningPath;
    if (supportEmail !== undefined) settings.supportEmail = supportEmail;
    if (maxMenteesPerMentor !== undefined) settings.maxMenteesPerMentor = maxMenteesPerMentor;
    if (announcementBanner !== undefined) settings.announcementBanner = announcementBanner;

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getAdminRoadmaps,
  getReports,
  createReport,
  updateReportStatus,
  getSettings,
  updateSettings,
};
