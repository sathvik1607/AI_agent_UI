/**
 * Card shell for all agent-originated messages.
 *
 * Owns only the visual chrome: the header bar with the agent icon, name, and
 * timestamp. Body rendering is delegated entirely to children — this inversion
 * of control keeps BotMessage layout-stable while the body varies between:
 *   - Chat text rendered by ReactMarkdown
 *   - Analytics reports rendered by AnalyticsReport
 *   - The typing indicator rendered by TypingIndicator
 *
 * Not memo'd because the children prop is a React element created anew on
 * each parent render, which would cause memo's shallow-equality check to fail
 * on every render regardless. The render cost of this shell is negligible.
 *
 * @param {{ timestamp: string, children: React.ReactNode }} props
 */
const BotMessage = ({ timestamp, children }) => (
  <div className="message bot-message">
    <div className="message-content">
      <div className="bot-message-header">
        <div className="bot-message-header-icon">A</div>
        <span className="bot-message-header-name">Analytics Agent</span>
        <span className="bot-message-header-time">{timestamp}</span>
      </div>
      <div className="bot-message-body markdown-body" style={{ width: '100%' }}>
        {children}
      </div>
    </div>
  </div>
);

export default BotMessage;
