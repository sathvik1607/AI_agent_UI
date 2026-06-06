import { memo } from 'react';
import { Trash2 } from 'lucide-react';

/**
 * A single entry in the conversation history list.
 *
 * memo'd because the sidebar renders a list of these and only the active item
 * or a deleted item should re-render on most user interactions. Parent
 * re-renders caused by unrelated state (isLoading, diagnostics open) will
 * not propagate to already-rendered conversation items.
 *
 * @param {{
 *   conversation: { id: string, title: string },
 *   isActive: boolean,
 *   onSelect: () => void,
 *   onDelete: (e: React.MouseEvent) => void,
 * }} props
 */
const ConversationItem = memo(({ conversation, isActive, onSelect, onDelete }) => (
  <div
    className={`history-item ${isActive ? 'active' : ''}`}
    onClick={onSelect}
    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
  >
    <span
      style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      title={conversation.title}
    >
      {conversation.title}
    </span>
    <button
      className="delete-history"
      onClick={onDelete}
      style={{
        background: 'none',
        border: 'none',
        color: 'inherit',
        padding: '2px',
        cursor: 'pointer',
        display: 'flex',
      }}
      title="Delete conversation"
    >
      <Trash2 size={13} />
    </button>
  </div>
));

ConversationItem.displayName = 'ConversationItem';
export default ConversationItem;
