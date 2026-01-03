/**
 * X10Minds Shot Scoring & Consistency Algorithm
 * Evaluates execution quality based on multi-variate inputs.
 */

export const calculateExecutionScore = (formFlags, pulseData, releaseConsistency) => {
  let score = 100;

  // Deduct based on biomechanical flags
  formFlags.forEach(flag => {
    switch (flag) {
      case "HIGH_SHOULDER": score -= 15; break;
      case "BACKWARD_LEAN": score -= 10; break;
      case "LOOSE_ANCHOR": score -= 20; break;
      default: score -= 5;
    }
  });

  // Adjust for mental state (implied by pulse/steadiness)
  if (pulseData > 100) score -= 5; // High stress

  return Math.max(0, score);
};

export const provideScoringFeedback = (score) => {
  if (score > 90) return "Elite Execution. Focus on expansion.";
  if (score > 70) return "Strong form. Consistency is key.";
  if (score > 50) return "Focus on foundational alignment.";
  return "Return to basic drills. Review posture analysis.";
};
