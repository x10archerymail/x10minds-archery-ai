const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Posture analysis endpoint
router.post('/analyze-posture', aiController.analyzePosture);

// Training plan generation
router.get('/generate-plan', aiController.getTrainingPlan);

module.exports = router;
