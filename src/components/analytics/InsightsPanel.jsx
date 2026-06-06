import { memo } from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * Renders the markdown insights narrative produced by the Analytics Engine.
 *
 * The backend returns a freeform markdown string that may contain bullet lists,
 * headers, bold text, and inline code. ReactMarkdown handles rendering within
 * the existing markdown-body CSS scope defined in index.css.
 *
 * memo'd because the insights string is stable after the API response is stored
 * in the conversation — it will not change between renders.
 *
 * @param {{ insights: string }} props
 */
const InsightsPanel = memo(({ insights }) => (
  <div
    className="markdown-body"
    style={{
      backgroundColor: 'var(--bg-dark)',
      padding: '1.25rem',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
    }}
  >
    <ReactMarkdown>{insights}</ReactMarkdown>
  </div>
));

InsightsPanel.displayName = 'InsightsPanel';
export default InsightsPanel;
