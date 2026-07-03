// backend/routes/assessmentRoutes.js

const express = require("express");
const {
  getQuestions,
  submitAssessment,
} = require("../controllers/assessmentController");

const router = express.Router();

// GET /api/assessment/questions
// Returns the full IAMShield questionnaire
router.get("/questions", getQuestions);

// POST /api/assessment/submit
// Accepts the user's answers and returns recommendations / summary
router.post("/submit", submitAssessment);

module.exports = router;