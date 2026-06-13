const User = require("../models/User");
const Progress = require("../models/Progress");

const getMentorOverview = async (req, res) => {
  try {
    // Retrieve learners to serve as mentees dynamically
    const learners = await User.find({ role: "learner" }).select(
      "name email learningPath skillLevel createdAt"
    );

    const mentees = await Promise.all(
      learners.map(async (learner) => {
        const progressList = await Progress.find({ userId: learner._id }).populate(
          "roadmapId",
          "title"
        );

        return {
          id: learner._id,
          name: learner.name,
          email: learner.email,
          learningPath: learner.learningPath,
          skillLevel: learner.skillLevel,
          joinedAt: learner.createdAt,
          progress: progressList.map((p) => ({
            roadmapTitle: p.roadmapId ? p.roadmapId.title : "Unknown",
            percentage: p.progressPercentage,
            lastUpdated: p.lastUpdated || p.updatedAt,
          })),
        };
      })
    );

    const stats = {
      totalMentees: mentees.length,
      frontendMentees: mentees.filter((m) => m.learningPath === "frontend").length,
      backendMentees: mentees.filter((m) => m.learningPath === "backend").length,
      aiMentees: mentees.filter((m) => m.learningPath === "ai").length,
      mobileMentees: mentees.filter((m) => m.learningPath === "mobile").length,
    };

    res.status(200).json({
      success: true,
      data: {
        stats,
        mentees,
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
  getMentorOverview,
};
