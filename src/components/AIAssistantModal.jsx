import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, HelpCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { chatWithAssistantAPI } from '../services/api';

export default function AIAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I'm your **RE:BOX Personal AI Assistant**.

I can help you give everyday discarded objects a new identity. Ask me about:
- **Possibilities**: *"What can I make with cardboard and egg cartons?"*
- **Techniques**: *"How to cut glass bottles safely without cracking?"*
- **Adhesives**: *"Which glue bonds plastic to wood or fabric?"*
- **Materials**: *"Can I use acrylic paint on glass jars?"*

What are you working with today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What can I make with plastic bottles?",
    "How to safely cut glass bottles?",
    "Which non-toxic glue bonds cardboard to wood?",
    "Ideas for old denim jeans without sewing?",
    "How to make an egg carton desktop organizer?"
  ];

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (textToSend) => {
    const message = textToSend || inputMessage;
    if (!message || message.trim().length === 0 || isTyping) return;

    const userMsg = { role: 'user', text: message.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await chatWithAssistantAPI({
        message: userMsg.text,
        history: messages
      });

      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: response.reply || "I'm ready to help with your upcycling project!" }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "I couldn't connect right now. You can check our Explore page or start an object in the Workspace!"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-2 sm:p-4 bg-charcoal-deep/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-background-surface w-full max-w-lg h-[90vh] sm:h-[85vh] rounded-2xl shadow-modal border border-charcoal-border flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-charcoal-border flex items-center justify-between bg-background-warm/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center shadow-subtle">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-charcoal tracking-tight">
                  RE:BOX Personal AI Assistant
                </h3>
                <span className="text-[10px] font-mono bg-accent-light text-accent-dark px-1.5 py-0.2 rounded font-semibold">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-charcoal-muted">
                Your on-demand creative reuse & industrial design copilot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-charcoal-muted hover:text-charcoal hover:bg-background-warm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Question Chips (Scrollable) */}
        <div className="px-4 py-2 border-b border-charcoal-borderLight bg-white overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          <span className="text-[10px] font-semibold text-charcoal-subtle uppercase flex-shrink-0">
            Suggested:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-background-warm border border-charcoal-border text-charcoal hover:border-charcoal-subtle hover:bg-background transition-colors flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-subtle ${
                    isBot
                      ? 'bg-background-warm border border-charcoal-borderLight text-charcoal rounded-tl-sm'
                      : 'bg-charcoal text-white rounded-tr-sm'
                  }`}
                >
                  <div className="space-y-1.5 whitespace-pre-line">
                    {msg.text}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-6 h-6 rounded-full bg-charcoal text-white flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-charcoal-muted pt-1">
              <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-background-warm px-3 py-2 rounded-xl border border-charcoal-borderLight flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] text-charcoal-subtle pl-1">Formulating reuse blueprint...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-background-warm/80 border-t border-charcoal-border">
          <div className="relative flex items-center">
            <textarea
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about an object or upcycling technique..."
              className="w-full pl-3.5 pr-12 py-2.5 text-xs rounded-xl border border-charcoal-border bg-white text-charcoal placeholder:text-charcoal-subtle focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            />
            <button
              type="button"
              disabled={isTyping || !inputMessage.trim()}
              onClick={() => handleSendMessage()}
              className="absolute right-2.5 p-2 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-40 text-white shadow-subtle transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-charcoal-subtle text-center mt-1.5">
            Press Enter to send · Provides practical safety and making instructions
          </p>
        </div>

      </div>
    </div>
  );
}
