/**
 * JSDoc type definitions mirroring the Python backend API contract (main.py).
 *
 * Backend endpoints:
 *   GET  /health            → { status: 'healthy' }
 *   POST /analytics         → AnalyticsApiResponse      (business users)
 *   POST /analytics/debug   → AnalyticsDebugResponse    (developers only)
 *
 * Removed endpoints (do NOT call from the frontend):
 *   POST /chat      — removed; all queries go to POST /analytics
 *   GET  /tool-usage — never existed; no backend implementation
 *
 * ─── ANALYTICS ───────────────────────────────────────────────────────────────
 * POST /analytics
 *
 * @typedef {Object} AnalyticsApiResponse
 * @property {boolean} success
 * @property {string} question
 * @property {AnalysisBlock|null} analysis
 * @property {string|null} insights      - markdown string rendered by InsightsPanel
 * @property {string|null} error
 *
 * @typedef {Object} AnalysisBlock
 * @property {string} summary
 * @property {string} output_title
 * @property {string[]} output_columns
 * @property {Record<string, string>[]} output_data
 *
 * ─── ANALYTICS DEBUG ─────────────────────────────────────────────────────────
 * POST /analytics/debug  — full pipeline state for developers
 *
 * @typedef {Object} AnalyticsDebugResponse
 * @property {Object} query_plan
 * @property {GeneratedQuery[]} generated_queries
 * @property {Object[]} query_results
 * @property {number} retry_count
 * @property {AnalysisBlock|null} analysis
 * @property {string|null} insights
 * @property {string|null} final_output
 * @property {string|null} error
 *
 * @typedef {Object} GeneratedQuery
 * @property {number} step_id
 * @property {string} description
 * @property {string} sql
 *
 * ─── DIAGNOSTICS ─────────────────────────────────────────────────────────────
 * GET /health → { status: 'healthy' }
 *
 * @typedef {'Online'|'Degraded'|'Offline'|'checking…'} BackendHealthStatus
 */

// Intentionally type-only — no runtime exports.
