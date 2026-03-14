const Case = require('../models/Case');

/**
 * AI Case Classifier Service
 * Sends case description to the AI endpoint and updates
 * the case with predicted crime categories and severity.
 * MERGES AI tags with any user-provided tags (no duplicates).
 */

const VALID_CATEGORIES = [
  'Homicide', 'Attempted Murder', 'Aggravated Assault', 'Simple Assault',
  'Kidnapping', 'Sexual Assault', 'Domestic Violence', 'Burglary',
  'Larceny/Theft', 'Motor Vehicle Theft', 'Arson', 'Vandalism/Property Damage',
  'Trespassing', 'Fraud/Deception', 'Cybercrime/Hacking', 'Identity Theft',
  'Extortion/Blackmail', 'Embezzlement', 'Drug Trafficking', 'Drug Possession',
  'Weapons Offenses', 'Disorderly Conduct', 'Traffic/DUI', 'Hit and Run',
  'Stalking', 'Harassment',
];

const SEVERITY_TO_PRIORITY = {
  'Low': 'low',
  'Medium': 'medium',
  'High': 'high',
  'Critical': 'critical',
};

/**
 * Classify a case description using the AI endpoint, then update the DB.
 * Merges AI-predicted categories with any existing user-provided tags.
 *
 * @param {string} caseId - MongoDB _id of the case
 * @param {string} descriptionText - The case description to classify
 */
async function classifyAndUpdate(caseId, descriptionText) {
  const aiUrl = process.env.NGROK_TEMP_URL;
  if (!aiUrl) {
    console.warn('[AI Classifier] NGROK_TEMP_URL not set, skipping classification');
    // Clear the processing flag even if we skip
    await Case.findByIdAndUpdate(caseId, { $set: { aiProcessing: false } });
    return;
  }

  try {
    console.log(`[AI Classifier] Classifying case ${caseId}...`);

    const response = await fetch(aiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: descriptionText }),
    });

    if (!response.ok) {
      throw new Error(`AI endpoint returned ${response.status}`);
    }

    const result = await response.json();
    console.log(`[AI Classifier] Result for ${caseId}:`, JSON.stringify(result));

    // Validate and filter AI categories
    const aiCategories = (result.categories || []).filter(
      (cat) => VALID_CATEGORIES.includes(cat)
    );

    // Map severity to priority
    const severity = result.severity || 'Medium';
    const priority = SEVERITY_TO_PRIORITY[severity] || 'medium';

    // Fetch the current case to get existing user-provided tags
    const currentCase = await Case.findById(caseId);
    if (!currentCase) {
      console.warn(`[AI Classifier] Case ${caseId} not found for update`);
      return;
    }

    // Merge: keep all existing user tags, then add AI categories (no duplicates)
    const existingTags = currentCase.tags || [];
    const mergedTags = [...new Set([...existingTags, ...aiCategories])];

    // Update the case
    currentCase.tags = mergedTags;
    currentCase.priority = priority;
    currentCase.aiProcessing = false; // Done processing
    await currentCase.save();

    console.log(`[AI Classifier] Case ${caseId} updated → tags: [${mergedTags.join(', ')}], priority: ${priority}`);
  } catch (error) {
    console.error(`[AI Classifier] Error classifying case ${caseId}:`, error.message);
    // Clear the processing flag on error too
    try {
      await Case.findByIdAndUpdate(caseId, { $set: { aiProcessing: false } });
    } catch (_) {}
  }
}

module.exports = { classifyAndUpdate };
