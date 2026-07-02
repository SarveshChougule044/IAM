// backend/routes/assessmentRoutes.js
const express = require("express");
const { getQuestions, submitAssessment } = require("../controllers/assessmentController");

const router = express.Router();

router.get("/questions", getQuestions);
router.post("/submit", submitAssessment);

module.exports = router;