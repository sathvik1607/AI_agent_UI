import { apiRequest } from './apiClient';

/**
 * Sends a natural-language question to the Analytics Engine.
 *
 * Backend: POST /analytics
 *
 * The engine interprets the question, generates SQL queries against the data
 * warehouse, executes them, then returns structured output alongside a markdown
 * insights narrative. The full response object is stored in the conversation
 * message and rendered by AnalyticsReport.jsx — no extraction step is needed
 * here because AnalyticsReport owns the rendering of all its sub-sections.
 *
 * @param {string} question - the user's natural-language analytics query
 * @returns {Promise<import('../types/apiSchemas').AnalyticsApiResponse>}
 */
export const runAnalysis = async (question) =>
  apiRequest('/analytics', {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
