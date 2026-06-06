import { useState, useRef, useCallback } from 'react';
import { useConversations } from '../hooks/useConversations';
import { useDiagnostics } from '../hooks/useDiagnostics';
import { runAnalysis } from '../services/analyticsService';
import { sendChatMessage, extractChatContent } from '../services/chatService';
import { detectAnalyticsIntent } from '../utils/intentDetector';
import Sidebar from '../components/sidebar/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';

/**
 * ChatPage — application orchestrator.
 *
 * This is the only component that:
 *  1. Consumes business logic hooks (useConversations, useDiagnostics)
 *  2. Dispatches API requests (analyticsService → POST /analytics)
 *  3. Connects UI events to state mutations
 *
 * All child components are purely presentational — they receive data and
 * callbacks as props and never interact with global state or services directly.
 *
 * ─── Message send data flow ──────────────────────────────────────────────────
 *   User types → InputArea.onSend → handleSend
 *     1. Capture conversationId at call time (guards against mid-flight tab switch)
 *     2. appendUserMessage → optimistic UI update (message appears immediately)
 *     3. runAnalysis(messageText) → POST /analytics (the only backend endpoint)
 *     4. appendBotMessage (success) OR appendSystemError (failure) → settle UI
 *
 * ─── Diagnostics data flow ───────────────────────────────────────────────────
 *   useDiagnostics polls /health every 5s
 *   → backendHealthStatus shown in ChatWindow header + DiagnosticsPanel
 *   → lastRequestDuration measured client-side (performance.now) → DiagnosticsPanel
 */
const ChatPage = () => {
  const {
    conversations,
    activeConversationId,
    messages,
    setActiveConversationId,
    createConversation,
    deleteConversation,
    appendUserMessage,
    appendBotMessage,
    appendSystemError,
  } = useConversations();

  const { backendHealthStatus, toolUsage } = useDiagnostics();

  const [isLoading, setIsLoading] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [lastRequestDuration, setLastRequestDuration] = useState(null);

  // Forwarded to InputArea so we can programmatically focus it after new-chat creation
  const inputRef = useRef(null);

  const handleNewChat = useCallback(() => {
    createConversation();
    // Defer focus until the next tick so InputArea has mounted with the new conversation
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [createConversation]);

  const handleDeleteConversation = useCallback(
    (e, conversationId) => {
      e.stopPropagation();
      const targetConversation = conversations.find((c) => c.id === conversationId);
      if (targetConversation?.messages.length > 0) {
        if (!window.confirm('Are you sure you want to delete this conversation?')) return;
      }
      deleteConversation(conversationId);
    },
    [conversations, deleteConversation],
  );

  /**
   * Routes to POST /analytics (data questions) or POST /chat (everything else).
   *
   * conversationId is captured at call-time so a mid-flight tab switch routes
   * the response to the originating conversation, not the newly active one.
   * Duration is measured client-side; neither endpoint returns it in the body.
   */
  const handleSend = useCallback(
    async (messageText) => {
      const conversationId = activeConversationId;

      appendUserMessage(conversationId, messageText);
      setIsLoading(true);

      const requestStart = performance.now();

      try {
        if (detectAnalyticsIntent(messageText)) {
          const analyticsResponse = await runAnalysis(messageText);
          setLastRequestDuration(Math.round(performance.now() - requestStart));
          appendBotMessage(conversationId, 'analytics', analyticsResponse);
        } else {
          const chatApiResponse = await sendChatMessage(messageText);
          setLastRequestDuration(Math.round(performance.now() - requestStart));
          appendBotMessage(conversationId, 'chat', extractChatContent(chatApiResponse));
        }
      } catch (error) {
        appendSystemError(conversationId, 'Unable to reach the Analytics Service. Please try again.');
        console.error('[ChatPage] API error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [activeConversationId, appendUserMessage, appendBotMessage, appendSystemError],
  );

  return (
    <div className="app-container">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        isDiagnosticsOpen={isDiagnosticsOpen}
        onToggleDiagnostics={() => setIsDiagnosticsOpen((open) => !open)}
      />
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSend={handleSend}
        backendHealthStatus={backendHealthStatus}
        isDiagnosticsOpen={isDiagnosticsOpen}
        activeConversationId={activeConversationId}
        toolUsage={toolUsage}
        lastRequestDuration={lastRequestDuration}
        inputRef={inputRef}
      />
    </div>
  );
};

export default ChatPage;
