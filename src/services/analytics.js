// src/services/analytics.js

/**
 * Simple event tracker for dashboard interactions
 * @param {string} eventName
 * @param {Object} data
 */
export function trackEvent(eventName, data) {
  console.log(`[Analytics] Event: ${eventName}`, data);
  // Integrate with real analytics services later if needed
}
