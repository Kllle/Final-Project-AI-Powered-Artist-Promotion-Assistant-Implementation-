// src/utils/roi.js

/**
 * Estimate potential revenue based on lead score
 * @param {Object} lead
 * @returns {number} estimated revenue
 */
export function estimateROI(lead) {
  const avgRevenuePerLead = 100; // placeholder value
  const conversionRate = lead.score / 100; // higher score = higher chance of conversion

  return Math.round(avgRevenuePerLead * conversionRate);
}
