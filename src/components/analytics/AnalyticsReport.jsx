import { memo } from 'react';
import AnalyticsTable from './AnalyticsTable';
import InsightsPanel from './InsightsPanel';
import SqlViewer from './SqlViewer';
import AgentTimeline from './AgentTimeline';

/**
 * Composes a full analytics report from an Analytics Engine API response.
 *
 * Data flow:
 *   POST /analytics → AnalyticsApiResponse (stored in conversation message)
 *   → AnalyticsReport receives the full response object
 *   → broken into sub-components by visual concern:
 *       ExecutiveSummary (inline) → AnalyticsTable → InsightsPanel → SqlViewer
 *
 * Each section renders only when the backend supplies data for it. Missing
 * sections are omitted cleanly rather than rendering empty placeholders.
 *
 * memo'd because analyticsResponse is a stable object reference after being
 * stored in the conversation — it does not change between parent re-renders.
 *
 * @param {{ analyticsResponse: import('../../types/apiSchemas').AnalyticsApiResponse }} props
 */
const AnalyticsReport = memo(({ analyticsResponse }) => {
  if (analyticsResponse.error) {
    return (
      <div style={{ color: 'var(--error)', padding: '0.5rem 0' }}>
        Error: {analyticsResponse.error}
      </div>
    );
  }

  const { analysis, insights, generated_queries: generatedQueries, agent_timeline: agentTimeline } = analyticsResponse;
  const hasTableData = Array.isArray(analysis?.output_data) && analysis.output_data.length > 0;
  const hasKeyInsights = Array.isArray(analysis?.key_insights) && analysis.key_insights.length > 0;

  // NL2SQL agent found nothing to work with (non-data question slipped through routing)
  if (!analysis && !insights) {
    return (
      <div style={{ color: 'var(--text-secondary)', padding: '0.25rem 0' }}>
        I couldn&apos;t find relevant data for that question. Try asking about sales, revenue, invoices, or customers.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>

      {/* High-level plain-text overview produced by the Analytics Engine */}
      {analysis?.summary && (
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            borderLeft: '4px solid var(--primary)',
            borderRadius: '4px',
            color: 'var(--text-main)',
            fontSize: '0.95rem',
            lineHeight: '1.6',
          }}
        >
          <div
            style={{
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}
          >
            Executive Summary
          </div>
          {analysis.summary}
        </div>
      )}

      {/* Agent timeline (left) + Key Insights (right) side by side */}
      {(agentTimeline?.length > 0 || hasKeyInsights) && (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch', flexWrap: 'wrap' }}>

          {/* Brain icon — left column, stretches to Key Insights box height */}
          {agentTimeline?.length > 0 && (
            <div style={{ flex: '0 0 auto', display: 'flex', alignSelf: 'stretch' }}>
              <AgentTimeline timeline={agentTimeline} />
            </div>
          )}

          {/* Key Insights — right column */}
          {hasKeyInsights && (
            <div
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '1rem 1.25rem',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.75rem',
                }}
              >
                Key Insights
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {analysis.key_insights.map((insight, i) => (
                  <li key={i} style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {hasTableData && (
        <AnalyticsTable
          outputTitle={analysis.output_title}
          outputColumns={analysis.output_columns}
          outputData={analysis.output_data}
        />
      )}

      {insights && <InsightsPanel insights={insights} />}

      {generatedQueries?.length > 0 && <SqlViewer generatedQueries={generatedQueries} />}
    </div>
  );
});

AnalyticsReport.displayName = 'AnalyticsReport';
export default AnalyticsReport;
