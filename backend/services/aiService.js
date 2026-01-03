/**
 * AI Service abstraction for server-side processing.
 */
class AIService {
  async processVision(image) {
    // Logic to call Gemini API from server
    return { status: "Analysis Complete", score: 85 };
  }

  async generateSPT(part, level) {
    // Logic to generate workout JSON
    return [{ name: "Hold", sets: 3, reps: "30s" }];
  }
}

module.exports = new AIService();
