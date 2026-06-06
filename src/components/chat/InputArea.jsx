import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Send } from 'lucide-react';

/**
 * Controlled textarea with auto-resize and keyboard-submit behaviour.
 *
 * Owns its own input text state — ChatPage only learns the content at the
 * moment of submission (onSend callback). This prevents the entire page from
 * re-rendering on every keystroke.
 *
 * Exposed via forwardRef with an imperative focus() handle so that ChatPage
 * can focus the input after creating a new conversation, without InputArea
 * needing to receive activeConversationId as a prop or use a side-effect.
 *
 * @param {{ onSend: (text: string) => void, isLoading: boolean }} props
 */
const InputArea = forwardRef(({ onSend, isLoading }, ref) => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
  }));

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    // Expand height to fit content; snap back when the field is cleared
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed);
    setInputText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    // Enter submits; Shift+Enter inserts a newline as expected in a textarea
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(e);
    }
  };

  return (
    <footer className="input-area">
      <form onSubmit={submit} className="chat-input-container">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Analytics Agent (Try: 'Compare sales for April...')"
            rows={1}
          />
          <div className="input-actions">
            <button
              type="submit"
              className="send-btn"
              disabled={!inputText.trim() || isLoading}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
        <p className="disclaimer">Analytics Agent can make mistakes. Verify important information.</p>
      </form>
    </footer>
  );
});

InputArea.displayName = 'InputArea';
export default InputArea;
