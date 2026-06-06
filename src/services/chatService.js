import { apiRequest } from './apiClient';

/**
 * Sends a user message to the general-purpose Chat Agent.
 *
 * Backend: POST /chat → { success, message, reply }
 *
 * Used for greetings, off-topic messages, and guidance questions.
 * Analytics data questions are routed to POST /analytics instead.
 *
 * @param {string} messageText
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
