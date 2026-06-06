/**
 * Developer-facing diagnostics overlay.
 *
 * Toggled by the Activity icon in the sidebar footer. Surfaces backend health,
 * session identity, request performance, and tool usage counters — information
 * that operators need but that must never appear inside chat message bubbles.
 *
 * Uses a CSS grid that collapses gracefully to a single column on narrow
 * viewports, matching the responsive behaviour of the rest of the layout.
 *
 * @param {{
 *   backendHealthStatus: import('../../types/apiSchemas').BackendHealthStatus,
 *   activeConversationId: string,
 *   toolUsage: Record<string, number> | null,
 *   lastRequestDuration: number | null,
 * }} props
 */
const DiagnosticsPanel = ({
  backendHealthStatus,
  activeConversationId,
  toolUsage,
  lastRequestDuration,
}) => {
  const statusColor =
    backendHealthStatus === 'Online'  ? 'var(--success)' :
    backendHealthStatus === 'Offline' ? 'var(--error)'   : 'var(--warning)';

  return (
    <div
      style={{
        margin: '0.75rem auto 0',
        maxWidth: '900px',
        width: 'calc(100% - 3rem)',
        padding: '1rem',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      {/* ── Backend health ───────────────────────────────── */}
      <DiagCell label="Backend Status">
        <div
          style={{
            color: statusColor,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: statusColor,
              display: 'inline-block',
            }}
          />
          {backendHealthStatus}
        </div>
      </DiagCell>

      {/* ── Session identity ─────────────────────────────── */}
      <DiagCell label="Session ID">
        <div
          style={{
            fontFamily: 'monospace',
            color: 'var(--text-main)',
            fontSize: '0.75rem',
            wordBreak: 'break-all',
          }}
        >
          {activeConversationId}
        </div>
      </DiagCell>

      {/* ── Last request performance (client-side measured) ── */}
      <DiagCell label="Last Request">
        <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
          {lastRequestDuration != null ? `${lastRequestDuration}ms` : '—'}
        </span>
      </DiagCell>

      {/* ── Tool usage counters from backend ─────────────── */}
      <DiagCell label="Tool Usage">
        {toolUsage ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {Object.entries(toolUsage).map(([toolName, callCount]) => (
              <div
                key={toolName}
                style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}
              >
                <span>{toolName}</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
                  {String(callCount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>—</span>
        )}
      </DiagCell>
    </div>
  );
};

/** Labelled cell within the diagnostics grid. */
const DiagCell = ({ label, children }) => (
  <div>
    <div
      style={{
        color: 'var(--text-muted)',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '4px',
      }}
    >
      {label}
    </div>
    {children}
  </div>
);

export default DiagnosticsPanel;
