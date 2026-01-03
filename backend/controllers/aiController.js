const aiService = require('../services/aiService');

exports.analyzePosture = async (req, res) => {
  try {
    const { image } = req.body;
    const analysis = await aiService.processVision(image);
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getTrainingPlan = async (req, res) => {
  const { part, level } = req.query;
  const plan = await aiService.generateSPT(part, level);
  res.json(plan);
};
