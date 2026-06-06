import { CHAT_TITLE_MAX_LENGTH } from './constants';

/**
 * Creates a collision-resistant session ID.
 * Format: sess-<epoch_ms>-<random_7_chars>
 * The timestamp component makes IDs loosely sortable by creation time.
 */
export const generateConversationId = () =>
  'sess-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);

/**
 * Returns a blank conversation object ready to be pushed into the conversations array.
 */
export const createNewConversation = () => ({
  id: generateConversationId(),
  title: 'New Chat',
  createdAt: Date.now(),
  messages: [],
});

/**
 * Derives a conversation title from the user's first message.
 * Truncates with an ellipsis to keep sidebar entries readable at 260px width.
 *
 * @param {string} messageText
 * @returns {string}
 */
export const deriveTitleFromFirstMessage = (messageText) =>
  messageText.length > CHAT_TITLE_MAX_LENGTH
    ? messageText.substring(0, CHAT_TITLE_MAX_LENGTH) + '...'
    : messageText;

/**
 * Returns the current time formatted for display in message headers.
 * @returns {string} e.g. "14:32"
 */
export const formatTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
