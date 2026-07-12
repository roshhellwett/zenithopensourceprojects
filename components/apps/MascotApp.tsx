"use client";
/* eslint-disable react-hooks/refs -- useAiChat returns state not refs */

import React, { useMemo } from 'react';
import { Send } from 'lucide-react';
import { SoundType } from '@/lib/audio';
import { useAiChat } from '@/hooks/useAiChat';

const parseMessage = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }
      parts.push(
        <a 
          key={`${i}-${match.index}`} 
          href={match[2]} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block px-3 py-1.5 mt-1 mr-2 bg-dark-surface hover:bg-amber-button text-dark-text hover:text-black border border-dark-border shadow-sm rounded-md text-[11px] font-bold tracking-wide transition-all active:scale-95 no-underline"
        >
          {match[2].replace(/^https?:\/\//, '')}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    const parsedParts = parts.map((part, pIdx) => {
      if (typeof part === 'string') {
        const boldRegex = /\*\*(.*?)\*\*/g;
        const bParts = [];
        let bLastIndex = 0;
        let bMatch;
        while ((bMatch = boldRegex.exec(part)) !== null) {
          if (bMatch.index > bLastIndex) {
            bParts.push(part.substring(bLastIndex, bMatch.index));
          }
          bParts.push(<strong key={`b-${pIdx}-${bMatch.index}`} className="font-bold text-dark-text">{bMatch[1]}</strong>);
          bLastIndex = boldRegex.lastIndex;
        }
        if (bLastIndex < part.length) {
          bParts.push(part.substring(bLastIndex));
        }
        return bParts;
      }
      return part;
    });

    return (
      <React.Fragment key={i}>
        {parsedParts}
        {i !== lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
};

export default function MascotApp({ playRetroSound }: { playRetroSound: (type: SoundType) => void }) {
  const chat = useAiChat({
    botSender: "hogai",
    welcomeMessage: "Hello, system builder! 🦥 I am Zenith AI, your retro helper sloth. I live inside this terminal workstation. Ask me anything about Zenith's open source projects like Project Sentinel or ZeroGapVote, or inspect our source code!",
    fallbackMessage: "I was taking a short nap. What were we compiling?",
    errorMessage: "Oops, I'm having trouble connecting. Please try again later.",
    idPrefix: { user: "msg_", bot: "msg_bot_", error: "msg_bot_err_" },
    playRetroSound,
  });

  return (
    <div className="flex flex-col h-full min-h-[300px] sm:min-h-[400px] flex-1">
      <div className="bg-dark-surface border border-dark-border p-2 rounded text-[11px] sm:text-xs text-dark-text-muted mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 select-none">
        <span className="text-left">Ask about compile paths, scraper setups, or project telemetry details.</span>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={chat.clearChat}
            className="px-2 py-1 sm:py-0.5 border border-dark-border hover:border-dark-text-muted bg-dark-bg text-[10px] text-dark-text-muted hover:text-dark-text rounded font-bold transition-colors cursor-pointer min-h-[32px] sm:min-h-0"
          >
            Clear Chat
          </button>
          <span className="font-mono text-[9px] bg-dark-elevated px-1.5 py-0.5 rounded text-accent-teal whitespace-nowrap">Groq · Llama 3.3</span>
        </div>
      </div>

      {/* Chat bubbles container */}
      <div className="flex-1 bg-dark-bg border border-dark-border rounded p-3 overflow-y-auto space-y-3 font-sans relative">
        {useMemo(() => chat.messages.map((m) => {
          const isBot = m.sender === "hogai";
          return (
            <div
              key={m.id}
              className={`flex gap-2 max-w-[90%] sm:max-w-[85%] ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div className="shrink-0 select-none self-start">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center p-1 border text-sm sm:text-base ${isBot ? "bg-dark-surface border-dark-border" : "bg-cobalt/20 border-cobalt/30 text-white"}`}>
                  {isBot ? "🦥" : "💻"}
                </div>
              </div>
              <div
                className={`p-2.5 sm:p-3 rounded text-xs leading-relaxed border ${
                  isBot
                    ? "bg-dark-surface border-dark-border text-dark-text rounded-tl-none select-text"
                    : "bg-cobalt/20 border-cobalt/30 text-dark-text rounded-tr-none select-text"
                }`}
              >
                {parseMessage(m.content)}
                <div className={`text-[9px] mt-1.5 font-mono select-none ${isBot ? "text-dark-text-faint" : "text-cobalt/60"}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        }), [chat.messages])}

        {chat.loading && (
          <div className="flex gap-2 max-w-[90%] sm:max-w-[85%] mr-auto">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-dark-surface flex items-center justify-center p-1 border border-dark-border shrink-0 self-start text-sm sm:text-base">🦥</div>
            <div className="p-2.5 sm:p-3 bg-dark-surface border border-dark-border rounded rounded-tl-none flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-dark-text-muted rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-dark-text-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-dark-text-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {/* Scroll dummy */}
        <div ref={chat.messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="mt-2 sm:mt-3">
        <form onSubmit={(e) => { e.preventDefault(); chat.sendMessage(); }} className="relative flex items-center">
          <input
            type="text"
            value={chat.input}
            onChange={(e) => chat.setInput(e.target.value)}
            disabled={chat.loading}
            placeholder="Type your prompt..."
            className="w-full bg-dark-bg border border-dark-border rounded p-3 sm:p-2.5 pr-[72px] sm:pr-20 text-base sm:text-xs text-dark-text focus:outline-none focus:ring-1 focus:ring-cobalt font-mono min-h-[44px] sm:min-h-[36px]"
          />
          <button
            type="submit"
            disabled={!chat.input.trim() || chat.loading}
            className="absolute right-1 top-1 bottom-1 bg-amber-button hover:bg-saffron-deep disabled:opacity-50 disabled:cursor-not-allowed border border-amber-shadow px-2.5 sm:px-3 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-black"
          >
            <span className="hidden sm:inline">Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-2 sm:mt-2.5 flex items-center flex-wrap gap-1.5 text-[10px] text-dark-text-muted font-mono select-none">
          <span className="font-bold uppercase w-full sm:w-auto text-[9px] sm:text-[10px]">Quick prompts:</span>
          <button
            type="button"
            onClick={() => { chat.sendMessage("Tell me more about Project Sentinel scraper capabilities."); playRetroSound("click"); }}
            className="px-2 py-1 sm:py-0.5 border border-dark-border bg-dark-surface rounded hover:bg-dark-elevated hover:text-dark-text cursor-pointer min-h-[36px] sm:min-h-0 text-left text-[10px] sm:text-[10px]"
          >
            &ldquo;About Sentinel Scraper&rdquo;
          </button>
          <button
            type="button"
            onClick={() => { chat.sendMessage("How does Project ZeroGapVote secure digital voting proposals?"); playRetroSound("click"); }}
            className="px-2 py-1 sm:py-0.5 border border-dark-border bg-dark-surface rounded hover:bg-dark-elevated hover:text-dark-text cursor-pointer min-h-[36px] sm:min-h-0 text-left text-[10px] sm:text-[10px]"
          >
            &ldquo;ZeroGapVote Security&rdquo;
          </button>
          <button
            type="button"
            onClick={() => { chat.sendMessage("What projects are built with Python in this registry?"); playRetroSound("click"); }}
            className="px-2 py-1 sm:py-0.5 border border-dark-border bg-dark-surface rounded hover:bg-dark-elevated hover:text-dark-text cursor-pointer min-h-[36px] sm:min-h-0 text-left text-[10px] sm:text-[10px]"
          >
            &ldquo;Python Repos&rdquo;
          </button>
          <button
            type="button"
            onClick={() => { chat.sendMessage("Can you tell me about Roshan's work philosophy?"); playRetroSound("click"); }}
            className="px-2 py-1 sm:py-0.5 border border-dark-border bg-dark-surface rounded hover:bg-dark-elevated hover:text-dark-text cursor-pointer min-h-[36px] sm:min-h-0 text-left text-[10px] sm:text-[10px]"
          >
            &ldquo;Founder Philosophy&rdquo;
          </button>
        </div>
      </div>
    </div>
  );
}
