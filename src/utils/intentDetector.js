/**
 * Lightweight keyword-based intent classifier.
 *
 * Routes user messages to the Analytics Engine (POST /analytics) when they
 * reference business-data concepts. All other messages go to the Chat Agent
 * (POST /chat) for general-purpose responses.
 *
 * Whole-word boundary matching (`\b`) prevents false positives such as
 * "salesman" matching "sales" or "monthly" matching "month".
 *
 * To expand coverage, add terms to ANALYTICS_KEYWORDS below.
 * For intent classification more sophisticated than keyword matching,
 * replace detectAnalyticsIntent with a call to a classification endpoint.
 */
const ANALYTICS_KEYWORDS = [
  'sales', 'revenue', 'invoice', 'invoices', 'customer', 'customers',
  'profit', 'profits', 'analytics', 'report', 'reports', 'dashboard',
  'kpi', 'trend', 'trends', 'financial', 'finance', 'month',
  'quarter', 'year', 'region', 'growth', 'comparison', 'compare',
];

/**
 * @param {string} message
 * @returns {boolean} true if the message should be routed to the Analytics Engine
 */
export const detectAnalyticsIntent = (message) => {
  const normalised = message.toLowerCase();
  return ANALYTICS_KEYWORDS.some((kw) => new RegExp(`\\b${kw}\\b`).test(normalised));
};
