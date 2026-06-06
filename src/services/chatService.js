import { apiRequest } from './apiClient';

/**
 * Sends a user message to the general-purpose Chat Agent.
 *
 * Backend: POST /chat
 *
 * The session_id binds this request to a server-side conversation thread so
 * the agent can maintain context across multiple turns. The full response
 * payload is richer than what the UI renders — see extractChatContent() for
 * the single field that should ever appear in a chat bubble.
 *
 * @param {string} messageText  - the user's raw input
 * @param {string} sessionId    - the active conversation's local ID
 * @returns {Promise<import('../types/apiSchemas').ChatApiResponse>}
 */
export const sendChatMessage = async (messageText) =>
  apiRequest('/chat', {
    method: 'POST',
    body: JSON.stringify({ message: messageText }),
  });

/**
 * Extracts the user-visible text from a Chat API response.
 *
 * This function is the single point that decides what is shown to users.
 * Fields like conversation_id, summary, and duration_ms are intentionally
 * excluded — they belong in the Diagnostics Panel, not the message thread.
 *
 * @param {import('../types/apiSchemas').ChatApiResponse} chatApiResponse
 * @returns {string}
 */
export const extractChatContent = (chatApiResponse) =>
  chatApiResponse?.reply || 'No response received';
