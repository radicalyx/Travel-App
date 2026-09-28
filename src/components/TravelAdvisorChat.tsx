import React, { useState } from 'react';
import { X, Send, Sparkles, Compass, Bot, User } from 'lucide-react';

interface TravelAdvisorChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentDestination?: string;
  travelDates?: { start: string; end: string };
  budget?: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const TravelAdvisorChat: React.FC<TravelAdvisorChatProps> = ({
  isOpen,
  onClose,
  currentDestination,
  travelDates,
  budget
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I'm your Singapore Changi Travel Adviser. Ask me anything about where to go from Singapore based on your dates, budget, flight options, or weather.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    'Where can two people travel for under SGD 3,000?',
    'Find somewhere cold in December from Singapore',
    'Find me a beach holiday within 4 hours of Singapore',
    'Is Tokyo or Seoul cheaper for my dates?',
    'Should I rent a car in Bali?',
    'Which Singapore Airlines flights currently have good airfare?'
  ];

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/travel-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          context: {
            currentDestination,
            travelDates,
            budget
          }
        })
      });

      const data = await res.json();
      const replyText = data.answer || "I'm having trouble retrieving flight and route details at the moment. Please try again shortly.";

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Network connection issue. Please check your connection or try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/60">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-100">
              AI Travel Adviser
            </h3>
            <span className="text-[11px] text-neutral-400">
              Singapore Changi Intelligence Engine
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-neutral-900/40 border-b border-neutral-800/80">
        <span className="text-[11px] text-neutral-500 uppercase font-semibold tracking-wider block mb-1.5">
          Ask directly:
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-xs text-neutral-300 bg-neutral-900 hover:bg-neutral-800 hover:text-neutral-100 border border-neutral-800 px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-amber-400 text-neutral-950 font-medium'
                    : 'bg-neutral-900 text-neutral-200 border border-neutral-800 whitespace-pre-line'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[10px] mt-1 text-right ${
                    isUser ? 'text-neutral-800' : 'text-neutral-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="h-7 w-7 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 justify-start items-center">
            <div className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-neutral-400 flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Analyzing flight routes & data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-900/60">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about destinations, budget, flights..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2 rounded-lg bg-amber-400 text-neutral-950 font-bold hover:bg-amber-300 disabled:opacity-40 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
