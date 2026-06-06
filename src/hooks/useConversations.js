import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  createNewConversation,
  deriveTitleFromFirstMessage,
  formatTimestamp,
} from '../utils/conversationUtils';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Central conversation manager.
 *
 * Owns the complete conversations array and the active conversation pointer,
 * both persisted to localStorage via useLocalStorage. Exposes CRUD operations
 * and message-append callbacks so that no component below ChatPage ever
 * mutates conversation state directly.
 *
 * Design decision — explicit conversationId on append operations:
 * All appendXxx functions receive a conversationId argument rather than
 * implicitly using the current activeConversationId. This ensures that if the
 * user switches conversations while an async API call is in-flight, the
 * response is still appended to the correct (originating) conversation —
 * matching the behaviour of the original monolithic component.
 */
export const useConversations = () => {
  // Reject stored arrays that are empty — they indicate a corrupted state
  // or a first-time visit where the default new-conversation should be shown.
  const [conversations, setConversations] = useLocalStorage(
    STORAGE_KEYS.CONVERSATIONS,
    () => [createNewConversation()],
    (parsed) => Array.isArray(parsed) && parsed.length > 0,
  );

  const [rawActiveId, setActiveConversationId] = useLocalStorage(
    STORAGE_KEYS.ACTIVE_CONVERSATION,
    conversations[0]?.id,
  );

  // Guard against a stored active ID that no longer exists (e.g. after deletion
  // in another tab or a localStorage migration). Falls back to the first entry.
  const activeConversationId = useMemo(
    () =>
      conversations.some((c) => c.id === rawActiveId) ? rawActiveId : conversations[0]?.id,
    [conversations, rawActiveId],
  );

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) || conversations[0],
    [conversations, activeConversationId],
  );

  // ─── Conversation CRUD ────────────────────────────────────────────────────

  const createConversation = useCallback(() => {
    const freshConversation = createNewConversation();
    setConversations((prev) => [freshConversation, ...prev]);
    setActiveConversationId(freshConversation.id);
    return freshConversation.id;
  }, [setConversations, setActiveConversationId]);

  /**
   * Removes a conversation and selects a safe fallback.
   * If the last conversation is deleted a blank replacement is created
   * automatically so the UI is never in a zero-conversation state.
   */
  const deleteConversation = useCallback(
    (conversationId) => {
      const remaining = conversations.filter((c) => c.id !== conversationId);

      if (remaining.length === 0) {
        const replacement = createNewConversation();
        setConversations([replacement]);
        setActiveConversationId(replacement.id);
        return;
      }

      setConversations(remaining);

      if (conversationId === rawActiveId) {
        setActiveConversationId(remaining[0].id);
      }
    },
    [conversations, rawActiveId, setConversations, setActiveConversationId],
  );

  // ─── Message Append Operations ────────────────────────────────────────────

  /**
   * Appends a user message to the specified conversation.
   * Derives the conversation title from this message if it is the first turn.
   */
  const appendUserMessage = useCallback(
    (conversationId, messageText) => {
      const timestamp = formatTimestamp();
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          const isFirstMessage = c.messages.length === 0 && c.title === 'New Chat';
          return {
            ...c,
            title: isFirstMessage ? deriveTitleFromFirstMessage(messageText) : c.title,
            messages: [...c.messages, { role: 'user', content: messageText, timestamp }],
          };
        }),
      );
    },
    [setConversations],
  );

  /**
   * Appends a bot response to the specified conversation.
   *
   * @param {string} conversationId
   * @param {'chat' | 'analytics'} messageType
   * @param {string | Object} content - plain text for chat; full API response object for analytics
   */
  const appendBotMessage = useCallback(
    (conversationId, messageType, content) => {
      const timestamp = formatTimestamp();
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          return {
            ...c,
            messages: [
              ...c.messages,
              { role: 'bot', type: messageType, content, timestamp },
            ],
          };
        }),
      );
    },
    [setConversations],
  );

  /**
   * Appends a user-facing system error notice to the specified conversation.
   * Raw error objects and stack traces must be logged separately (console.error)
   * and never passed as the userFacingMessage.
   */
  const appendSystemError = useCallback(
    (conversationId, userFacingMessage) => {
      const timestamp = formatTimestamp();
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          return {
            ...c,
            messages: [
              ...c.messages,
              { role: 'system', content: userFacingMessage, timestamp },
            ],
          };
        }),
      );
    },
    [setConversations],
  );

  return {
    conversations,
    activeConversationId,
    activeConversation,
    messages: activeConversation?.messages || [],
    setActiveConversationId,
    createConversation,
    deleteConversation,
    appendUserMessage,
    appendBotMessage,
    appendSystemError,
  };
};
