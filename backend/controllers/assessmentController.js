// backend/controllers/assessmentController.js
const questionnaire = require("../data/iamQuestionnaire");
const { computeRecommendations } = require("../utils/recommendationEngine");

// GET /api/assessment/questions
const getQuestions = (req, res) => {
  return res.status(200).json({ success: true, questions: questionnaire });
};

// POST /api/assessment/submit
const submitAssessment = (req, res) => {
  const { answers } = req.body;

  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ success: false, message: "answers object is required" });
  }

  const result = computeRecommendations(answers);

  return res.status(200).json({
    success: true,
    message: "Assessment submitted successfully",
    result,
  });
};

module.exports = { getQuestions, submitAssessment };