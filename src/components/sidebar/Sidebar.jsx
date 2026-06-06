import { useState, useCallback } from 'react';
import { Plus, Settings, Activity } from 'lucide-react';
import ChatHistory from './ChatHistory';

/**
 * Fixed-width sidebar containing the logo, new-chat action, conversation
 * history, and footer controls (diagnostics toggle, settings).
 *
 * @param {{
 *   conversations: Object[],
 *   activeConversationId: string,
 *   onSelectConversation: (id: string) => void,
 *   onNewChat: () => void,
 *   onDeleteConversation: (e: React.MouseEvent, id: string) => void,
 *   isDiagnosticsOpen: boolean,
 *   onToggleDiagnostics: () => void,
 *   isOpen: boolean,
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
  isOpen,
}) => {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleSettingsClick = useCallback(() => {
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 2500);
  }, []);

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
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
          <div className="avatar">A</div>
          <span>AlumnxAI Labs</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative' }}>
          <button
            onClick={onToggleDiagnostics}
            title="Toggle diagnostics panel"
            style={{
              background: 'none',
              border: 'none',
              color: isDiagnosticsOpen ? 'var(--primary)' : 'var(--text-secondary)',
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

          {/* Settings — feature not yet implemented */}
          <button
            onClick={handleSettingsClick}
            title="Settings"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '4px',
              transition: 'color 0.15s ease',
            }}
          >
            <Settings size={16} />
          </button>

          {/* "Coming Soon" tooltip that auto-dismisses */}
          {showComingSoon && (
            <div
              style={{
                position: 'absolute',
                bottom: '130%',
                right: 0,
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 12px',
                fontSize: '0.75rem',
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-subtle)',
                pointerEvents: 'none',
                animation: 'fadeIn 0.15s ease',
              }}
            >
              ⚙️ Settings — Soon..
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
