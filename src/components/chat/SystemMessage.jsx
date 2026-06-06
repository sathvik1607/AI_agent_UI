import { memo } from 'react';

/**
 * Full-width notice for system-level events (connectivity failures, API errors).
 *
 * Displays user-facing error text set by ChatPage.handleSend's catch block.
 * Raw error objects, stack traces, and API details are NEVER rendered here —
 * they go to console.error and the Diagnostics Panel.
 *
 * memo'd because content is a stable string after the error message is appended.
 *
 * @param {{ content: string }} props
 */
const SystemMessage = memo(({ content }) => (
  <div className="message system-message">
    <div className="message-content">
      <h2>System Message</h2>
      <p>{content}</p>
    </div>
  </div>
));

SystemMessage.displayName = 'SystemMessage';
export default SystemMessage;
