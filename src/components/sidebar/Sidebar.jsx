import { Plus, Settings, Activity } from 'lucide-react';
import ChatHistory from './ChatHistory';

/**
 * Fixed-width sidebar containing the logo, new-chat action, conversation
 * history, and footer controls (diagnostics toggle, settings).
 *
 * The diagnostics toggle lives here because it is a global developer tool,
 * not a per-conversation control. isDiagnosticsOpen state is owned by
 * ChatPage and passed down so Sidebar can reflect the active state.
 *
 * Mobile responsiveness: on viewports < 768px the sidebar is positioned
 * fixed and hidden off-screen via transform (see index.css). Adding the
 * 'open' class reveals it — mobile toggle wiring is a future enhancement;
 * the CSS infrastructure is already in place.
 *
 * @param {{
 *   conversations: Object[],
 *   activeConversationId: string,
 *   onSelectConversation: (id: string) => void,
 *   onNewChat: () => void,
 *   onDeleteConversation: (e: React.MouseEvent, id: string) => void,
 *   isDiagnosticsOpen: boolean,
 *   onToggleDiagnostics: () => void,
 * }} props
 */
const Sidebar = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isDiagnosticsOpen,
  onToggleDiagnostics,
}) => (
  <aside className="sidebar">
    <div className="sidebar-header">
      <div className="logo">
        <div className="logo-icon">A</div>
        <span>Analytics Agent</span>
      </div>
      <button className="new-chat-btn" onClick={onNewChat}>
        <Plus size={16} /> New Chat
      </button>
    </div>

    <ChatHistory
      conversations={conversations}
      activeConversationId={activeConversationId}
      onSelectConversation={onSelectConversation}
      onDeleteConversation={onDeleteConversation}
    />

    <div className="sidebar-footer">
      <div className="user-profile">
        <div className="avatar">U</div>
        <span>Guest User</span>
      </div>
      <div className="settings-icons" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={onToggleDiagnostics}
          title="Toggle diagnostics panel"
          style={{
            background: 'none',
            border: 'none',
            color: isDiagnosticsOpen ? 'var(--primary)' : 'inherit',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            borderRadius: '4px',
            transition: 'color 0.15s ease',
          }}
        >
          <Activity size={16} />
        </button>
        <Settings size={16} />
      </div>
    </div>
  </aside>
);

export default Sidebar;
