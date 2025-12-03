// src/utils/score.js

/**
 * Calculates opportunity score based on engagement and reach
 * @param {Object} lead - lead object containing metrics
 * @returns {number} score between 0 and 100
 */
export function calculateScore(lead) {
  const engagementWeight = 0.6;
  const reachWeight = 0.4;

  const engagementScore = Math.min(lead.engagement / 100, 1); // normalize
  const reachScore = Math.min(lead.reach / 1000, 1); // normalize

  const score = (engagementScore * engagementWeight + reachScore * reachWeight) * 100;
  return Math.round(score);
}
