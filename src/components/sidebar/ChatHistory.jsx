import ConversationItem from './ConversationItem';

/**
 * Scrollable list of past conversations shown in the sidebar.
 *
 * Purely presentational — maps the conversations array to ConversationItem
 * entries and passes through the select and delete callbacks. Delete
 * confirmation logic (window.confirm) lives in ChatPage.handleDeleteConversation
 * to keep this component free of side effects.
 *
 * @param {{
 *   conversations: Object[],
 *   activeConversationId: string,
 *   onSelectConversation: (id: string) => void,
 *   onDeleteConversation: (e: React.MouseEvent, id: string) => void,
 * }} props
 */
const ChatHistory = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
}) => (
  <div className="chat-history">
    {conversations.map((conversation) => (
      <ConversationItem
        key={conversation.id}
        conversation={conversation}
        isActive={conversation.id === activeConversationId}
        onSelect={() => onSelectConversation(conversation.id)}
        onDelete={(e) => onDeleteConversation(e, conversation.id)}
      />
    ))}
  </div>
);

export default ChatHistory;
