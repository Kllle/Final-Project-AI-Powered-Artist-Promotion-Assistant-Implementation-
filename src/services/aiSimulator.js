// src/services/aiSimulator.js

/**
 * Mock AI response generator in artist's brand voice
 * @param {Object} lead - lead info
 * @param {Object} artistPreferences - { tone: string, style: string }
 * @returns {Promise<string>}
 */
export async function generateResponse(lead, artistPreferences) {
  const tone = artistPreferences.tone || "friendly";
  const style = artistPreferences.style || "concise";

  // Simulate async AI call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Hi ${lead.name}, thanks for reaching out! We'd love to connect. (${tone}, ${style})`);
    }, 300);
  });
}
