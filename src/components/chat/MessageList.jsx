import ReactMarkdown from 'react-markdown';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import BotMessage from './BotMessage';
import UserMessage from './UserMessage';
import SystemMessage from './SystemMessage';
import TypingIndicator from './TypingIndicator';
import AnalyticsReport from '../analytics/AnalyticsReport';

/**
 * Scrollable message list that owns auto-scroll behaviour.
 *
 * Responsibilities:
 *  - Renders the empty-state welcome card when no conversation has started
 *  - Routes each message to the correct component based on role and type
 *  - Manages the scroll sentinel via useAutoScroll
 *  - Renders the typing indicator while a response is in-flight
 *
 * Message routing:
 *   role='user'   → UserMessage
 *   role='system' → SystemMessage
 *   role='bot' + type='analytics' → BotMessage wrapping AnalyticsReport
 *   role='bot' + type='chat'      → BotMessage wrapping ReactMarkdown
 *
 * @param {{ messages: Object[], isLoading: boolean }} props
 */
const MessageList = ({ messages, isLoading }) => {
  const sentinelRef = useAutoScroll([messages, isLoading]);

  return (
    <div className="messages-container">
      {messages.length === 0 ? (
        // Welcome card shown on a fresh conversation before any messages are sent
        <BotMessage timestamp="Now">
          <p><strong>Hello! I&apos;m Analytics Agent.</strong></p>
          <p>I&apos;m your AI-powered operations assistant. How can I help you today?</p>
        </BotMessage>
      ) : (
        messages.map((message, index) => {
          if (message.role === 'user') {
            return <UserMessage key={index} content={message.content} />;
          }

          if (message.role === 'system') {
            return <SystemMessage key={index} content={message.content} />;
          }

          // Bot message — body varies by the type set when the message was appended
          return (
            <BotMessage key={index} timestamp={message.timestamp || 'Just now'}>
              {message.type === 'analytics' ? (
                <AnalyticsReport analyticsResponse={message.content} />
              ) : (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              )}
            </BotMessage>
          );
        })
      )}

      {/* Typing indicator appears inside a standard bot card while awaiting the API */}
      {isLoading && (
        <BotMessage timestamp="Thinking…">
          <TypingIndicator />
        </BotMessage>
      )}

      {/* Invisible sentinel element that useAutoScroll scrolls into view */}
      <div ref={sentinelRef} />
    </div>
  );
};

export default MessageList;
