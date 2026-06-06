import MessageList from './MessageList';
import InputArea from './InputArea';
import DiagnosticsPanel from '../diagnostics/DiagnosticsPanel';

/**
 * Main content column: header bar, optional diagnostics panel, message list, input.
 *
 * This is a pure layout and composition layer — no business logic lives here.
 * ChatPage owns all state and handlers; ChatWindow distributes them to children.
 *
 * The inputRef prop is passed straight through to InputArea (which wraps it
 * with useImperativeHandle to expose focus()). This allows ChatPage to focus
 * the input after creating a new conversation without ChatWindow needing any
 * knowledge of why the focus is happening.
 *
 * @param {{
 *   messages: Object[],
 *   isLoading: boolean,
 *   onSend: (text: string) => void,
 *   backendHealthStatus: import('../../types/apiSchemas').BackendHealthStatus,
 *   isDiagnosticsOpen: boolean,
 *   activeConversationId: string,
 *   toolUsage: Record<string, number> | null,
 *   lastRequestDuration: number | null,
 *   inputRef: React.RefObject,
 * }} props
 */
const ChatWindow = ({
  messages,
  isLoading,
  onSend,
  backendHealthStatus,
  isDiagnosticsOpen,
  activeConversationId,
  toolUsage,
  lastRequestDuration,
  inputRef,
}) => {
  const statusColor =
    backendHealthStatus === 'Online'  ? 'var(--success)' :
    backendHealthStatus === 'Offline' ? 'var(--error)'   : 'var(--warning)';

  return (
    <main className="main-chat">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="chat-header">
        <div className="header-title">
          <h1>Analytics Agent</h1>
          <span className="subtitle">AI-Powered Operations Assistant</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
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
      </header>

      {/* ── Diagnostics panel (toggled from sidebar Activity icon) ─────── */}
      {isDiagnosticsOpen && (
        <DiagnosticsPanel
          backendHealthStatus={backendHealthStatus}
          activeConversationId={activeConversationId}
          toolUsage={toolUsage}
          lastRequestDuration={lastRequestDuration}
        />
      )}

      {/* ── Message list ───────────────────────────────────────────────── */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* ── Input ──────────────────────────────────────────────────────── */}
      <InputArea ref={inputRef} onSend={onSend} isLoading={isLoading} />

    </main>
  );
};

export default ChatWindow;
