import React, { useState, useEffect, useRef } from 'react';
import { Plus, Settings, Send, Trash2, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './index.css';

function App() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // ---------- helper functions ----------
  const createNewConversation = () => ({
    id: 'sess-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
    title: 'New Chat',
    createdAt: Date.now(),
    messages: []
  });

  // ---------- state ----------
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('analytics_conversations');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return [createNewConversation()];
  });

  const [activeConversationId, setActiveConversationId] = useState(() => {
    const saved = localStorage.getItem('analytics_active_conversation');
    if (saved && conversations.some(c => c.id === saved)) return saved;
    return conversations[0]?.id || createNewConversation().id;
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ---------- diagnostics state ----------
  const [backendStatus, setBackendStatus] = useState('checking…');
  const [toolUsage, setToolUsage] = useState(null);
  const [diagOpen, setDiagOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // ---------- persistence ----------
  useEffect(() => {
    localStorage.setItem('analytics_conversations', JSON.stringify(conversations));
    localStorage.setItem('analytics_active_conversation', activeConversationId);
  }, [conversations, activeConversationId]);

  // ---------- auto-scroll ----------
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

  // ---------- diagnostics polling every 5s ----------
  useEffect(() => {
    const fetchDiag = async () => {
      try {
        const healthRes = await fetch(`${API_BASE_URL}/health`);
        setBackendStatus(healthRes.ok ? 'Online' : 'Degraded');
      } catch {
        setBackendStatus('Offline');
      }
      try {
        const toolRes = await fetch(`${API_BASE_URL}/tool-usage`);
        if (toolRes.ok) {
          const data = await toolRes.json();
          setToolUsage(data);
        }
      } catch {
        // silently ignore tool-usage errors
      }
    };

    fetchDiag(); // immediate first call
    const interval = setInterval(fetchDiag, 5000);
    return () => clearInterval(interval);
  }, [API_BASE_URL]);

  // ---------- textarea auto-resize ----------
  const handleInput = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // ---------- send ----------
  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Auto-titling logic
    let newTitle = activeConversation.title;
    if (activeConversation.messages.length === 0 && newTitle === 'New Chat') {
      newTitle = trimmed.length > 40 ? trimmed.substring(0, 40) + '...' : trimmed;
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedUserConv = {
      ...activeConversation,
      title: newTitle,
      messages: [...activeConversation.messages, { role: 'user', content: trimmed, timestamp }]
    };

    setConversations(prev => prev.map(c => c.id === activeConversationId ? updatedUserConv : c));
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, session_id: activeConversationId }),
      });
      
      if (!response.ok) throw new Error('Failed to connect to Analytics Agent');
      const data = await response.json();

      const botResponse =
        data?.assistant_response?.content ||
        data?.response ||
        'No response received';

      setConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            messages: [...c.messages, { role: 'bot', content: botResponse, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
          };
        }
        return c;
      }));

    } catch (error) {
      setConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            messages: [...c.messages, { role: 'system', content: 'Oops! ' + error.message, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
          };
        }
        return c;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- chat management ----------
  const startNewChat = () => {
    const newConv = createNewConversation();
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const deleteChat = (e, idToDelete) => {
    e.stopPropagation();
    
    // Warn user if it has messages
    const convToDelete = conversations.find(c => c.id === idToDelete);
    if (convToDelete?.messages.length > 0) {
      if (!window.confirm('Are you sure you want to delete this conversation?')) return;
    }

    setConversations(prev => {
      const updated = prev.filter(c => c.id !== idToDelete);
      
      // Fallback logic for active conversation
      if (idToDelete === activeConversationId) {
        if (updated.length > 0) {
          setActiveConversationId(updated[0].id);
        } else {
          const freshConv = createNewConversation();
          setActiveConversationId(freshConv.id);
          return [freshConv];
        }
      }
      return updated;
    });
  };

  // ---------- diagnostics status colour ----------
  const statusColor =
    backendStatus === 'Online' ? 'var(--success)' :
      backendStatus === 'Offline' ? 'var(--error)' : 'var(--warning)';

  return (
    <div className="app-container">
      {/* ========== Sidebar ========== */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">A</div>
            <span>Analytics Agent</span>
          </div>
          <button className="new-chat-btn" onClick={startNewChat}>
            <Plus size={16} /> New Chat
          </button>
        </div>

        <div className="chat-history">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`history-item ${conv.id === activeConversationId ? 'active' : ''}`}
              onClick={() => setActiveConversationId(conv.id)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={conv.title}>
                {conv.title}
              </span>
              <button
                className="delete-history"
                onClick={(e) => deleteChat(e, conv.id)}
                style={{ background: 'none', border: 'none', color: 'inherit', padding: '2px', cursor: 'pointer', display: 'flex' }}
                title="Delete Chat"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">U</div>
            <span>Guest User</span>
          </div>
          <div className="settings-icons" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setDiagOpen(o => !o)}
              title="Diagnostics"
              style={{ background: 'none', border: 'none', color: diagOpen ? 'var(--primary)' : 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px', transition: 'color 0.15s ease' }}
            >
              <Activity size={16} />
            </button>
            <Settings size={16} />
          </div>
        </div>
      </aside>

      {/* ========== Main Chat ========== */}
      <main className="main-chat">
        <header className="chat-header">
          <div className="header-title">
            <h1>Analytics Agent</h1>
            <span className="subtitle">AI-Powered Operations Assistant</span>
          </div>

          {/* Inline status dot in header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColor, display: 'inline-block' }} />
            {backendStatus}
          </div>
        </header>

        {/* ========== Diagnostics Panel ========== */}
        {diagOpen && (
          <div style={{
            margin: '0.75rem auto 0',
            maxWidth: '900px',
            width: 'calc(100% - 3rem)',
            padding: '1rem',
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            boxShadow: 'var(--shadow-subtle)',
          }}>
            {/* Backend Status */}
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Backend Status</div>
              <div style={{ color: statusColor, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColor, display: 'inline-block' }} />
                {backendStatus}
              </div>
            </div>

            {/* Session ID */}
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Session ID</div>
              <div style={{ fontFamily: 'monospace', color: 'var(--text-main)', fontSize: '0.75rem', wordBreak: 'break-all' }}>{activeConversationId}</div>
            </div>

            {/* Tool Usage */}
            <div style={{ gridColumn: toolUsage ? 'auto' : 'auto' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Tool Usage</div>
              {toolUsage ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {Object.entries(toolUsage).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <span>{key}</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{String(val)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>—</span>
              )}
            </div>
          </div>
        )}

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="message bot-message">
              <div className="message-content">
                <div className="bot-message-header">
                  <div className="bot-message-header-icon">A</div>
                  <span className="bot-message-header-name">Analytics Agent</span>
                  <span className="bot-message-header-time">Now</span>
                </div>
                <div className="bot-message-body markdown-body">
                  <p><strong>Hello! I'm Analytics Agent.</strong></p>
                  <p>I'm your AI-powered operations assistant. How can I help you today?</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((m, i) => {
              if (m.role === 'user') {
                return (
                  <div key={i} className="message user-message">
                    <div className="message-content">
                      {m.content}
                    </div>
                  </div>
                );
              } else if (m.role === 'system') {
                return (
                  <div key={i} className="message system-message">
                    <div className="message-content">
                      <h2>System Message</h2>
                      <p>{m.content}</p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={i} className="message bot-message">
                    <div className="message-content">
                      <div className="bot-message-header">
                        <div className="bot-message-header-icon">A</div>
                        <span className="bot-message-header-name">Analytics Agent</span>
                        <span className="bot-message-header-time">{m.timestamp || 'Just now'}</span>
                      </div>
                      <div className="bot-message-body markdown-body">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                );
              }
            })
          )}
          {isLoading && (
            <div className="message bot-message">
              <div className="message-content">
                <div className="bot-message-header">
                  <div className="bot-message-header-icon">A</div>
                  <span className="bot-message-header-name">Analytics Agent</span>
                  <span className="bot-message-header-time">Thinking...</span>
                </div>
                <div className="bot-message-body" style={{ padding: '0.75rem 1rem' }}>
                  <div className="typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ========== Input Area ========== */}
        <footer className="input-area">
          <form onSubmit={handleSend} className="chat-input-container">
            <div className="input-wrapper">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                placeholder="Message Analytics Agent..."
                rows="1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              <div className="input-actions">
                <button type="submit" className="send-btn" disabled={!input.trim() || isLoading}>
                  <Send size={16} />
                </button>
              </div>
            </div>
            <p className="disclaimer">Analytics Agent can make mistakes. Verify important information.</p>
          </form>
        </footer>
      </main>
    </div>
  );
}

export default App;
