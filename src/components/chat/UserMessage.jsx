import { memo } from 'react';

/**
 * Right-aligned chat bubble for messages sent by the user.
 *
 * memo'd because content is a stable string — already-rendered user messages
 * will not re-render when new messages are appended to the conversation.
 *
 * @param {{ content: string }} props
 */
const UserMessage = memo(({ content }) => (
  <div className="message user-message">
    <div className="message-content">{content}</div>
  </div>
));

UserMessage.displayName = 'UserMessage';
export default UserMessage;
