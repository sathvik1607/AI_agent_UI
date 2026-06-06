/**
 * JSDoc type definitions mirroring the Python backend API contract (main.py).
 *
 * Backend endpoints:
 *   GET  /health            → { status: 'healthy' }
 *   POST /analytics         → AnalyticsApiResponse      (only endpoint for user messages)
 *   POST /analytics/debug   → AnalyticsDebugResponse    (developers only)
 *
 * ─── ANALYTICS ───────────────────────────────────────────────────────────────
 * POST /analytics
 *
 * @typedef {Object} AnalyticsApiResponse
 * @property {boolean} success
 * @property {string} question
 * @property {AnalysisBlock|null} analysis
 * @property {string|null} insights         - markdown string rendered by InsightsPanel
 * @property {AgentTimelineStep[]|null} agent_timeline
 * @property {string|null} error
 *
 * @typedef {Object} AgentTimelineStep
 * @property {string} step    - display label
 * @property {string} icon    - key into ICON_MAP in AgentTimeline.jsx
 * @property {'completed'|'running'|'pending'} status
 *
 * @typedef {Object} AnalysisBlock
 * @property {string} summary
 * @property {string[]} key_insights  - bullet-point highlights, rendered as a list
 * @property {'table'} output_format
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
