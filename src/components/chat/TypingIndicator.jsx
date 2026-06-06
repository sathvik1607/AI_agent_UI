import { memo } from 'react';

/**
 * Three-dot animated indicator shown while the agent is generating a response.
 * Pure presentational — no props, no state. Animation is driven by CSS keyframes
 * defined in index.css (.typing, .typing span).
 */
const TypingIndicator = memo(() => (
  <div className="typing">
    <span /><span /><span />
  </div>
));

TypingIndicator.displayName = 'TypingIndicator';
export default TypingIndicator;
