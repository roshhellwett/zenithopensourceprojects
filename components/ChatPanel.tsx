"use client";

/* eslint-disable react-hooks/refs -- useAiChat returns state not refs */

import React, { useState, useEffect, useRef } from "react";
import { Send, X, RefreshCw, Maximize2, Minimize2, Zap } from "lucide-react";
import { playRetroSound } from "@/lib/audio";
import { FormattedText, LoadingDots } from "@/lib/format";
import { useAiChat } from "@/hooks/useAiChat";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/scroll-lock";

interface ChatPanelProps {
  onClose?: () => void;
}

const exampleQuestions = [
  "What tools do you have?",
  "How does Project Sentinel work?",
  "Tell me about the founder",
  "What tech stack does Zenith use?",
];

const ChatMessage = React.memo(function ChatMessage({ m, copiedId, onCopy }: {
  m: { id: string; sender: string; content: string };
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
}) {
  return (
    <div className={`${m.sender === "user" ? "text-right" : ""}`}>
      {m.sender === "bot" && (
        <div className="group relative pr-10 flex gap-2">
          <span className="w-5 h-5 rounded-full bg-amber-button/10 flex items-center justify-center shrink-0 text-[10px] select-none">🤖</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-dark-text leading-relaxed">
              <FormattedText text={m.content} />
            </div>
            <button
              onClick={() => onCopy(m.id, m.content)}
              className="absolute right-0 top-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity px-2 py-0.5 bg-dark-elevated hover:bg-dark-border/40 border border-dark-border rounded text-[9px] text-dark-text-muted hover:text-dark-text cursor-pointer font-semibold shadow-sm select-none"
              title="Copy response"
            >
              {copiedId === m.id ? "✓ Copied" : "📋 Copy"}
            </button>
          </div>
        </div>
      )}
      {m.sender === "user" && (
        <div className="inline-block bg-cobalt/15 border border-cobalt/25 rounded-lg px-3 py-2 text-sm text-dark-text max-w-[85%] text-left relative group">
          <p className="whitespace-pre-wrap">{m.content}</p>
          <button
            onClick={() => onCopy(m.id, m.content)}
            className="block sm:inline-block sm:absolute sm:right-full sm:mr-2 sm:top-1/2 sm:-translate-y-1/2 mt-1.5 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity px-2 py-0.5 bg-dark-elevated hover:bg-dark-border/40 border border-dark-border rounded text-[9px] text-dark-text-muted hover:text-dark-text cursor-pointer font-semibold shadow-sm select-none"
            title="Copy message"
          >
            {copiedId === m.id ? "✓ Copied" : "📋 Copy"}
          </button>
        </div>
      )}
    </div>
  );
});

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      lockBodyScroll();
      return () => { unlockBodyScroll(); };
    }
  }, [isFullscreen]);

  useEffect(() => {
    return () => unlockBodyScroll(true);
  }, []);

  // Focus trap for dialog
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (first) first.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) { last?.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first?.focus(); e.preventDefault(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const chat = useAiChat({
    botSender: "bot",
    welcomeMessage: "Hi! I'm the Zenith assistant. Ask me about our tools, install guides, or the founder.",
    fallbackMessage: "I'm having trouble thinking right now. Try again?",
    errorMessage: "Chat service is temporarily unavailable. Please try again later.",
    playRetroSound,
  });

  return (
    <div
      ref={panelRef}
      className={`animate-fade-in-up bg-dark-surface border border-dark-border flex flex-col overflow-hidden window-chrome ${
        isFullscreen
          ? "fixed inset-x-0 top-[var(--navbar-height)] bottom-[var(--taskbar-height)] z-50 rounded-none border-none shadow-none"
          : "w-full sm:w-[360px] md:w-[380px] h-[70vh] sm:h-[520px] rounded-t-2xl sm:rounded-xl shadow-2xl max-h-[80vh] sm:max-h-[520px]"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Zenith AI Chat"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 sm:py-2 border-b border-dark-border/60 bg-gradient-to-r from-amber-button/5 to-transparent shrink-0 select-none min-h-[48px] sm:min-h-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-button/10 text-amber-button shadow-sm shrink-0">
            <Zap size={14} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-dark-text truncate">Zenith AI</p>
            <p className="flex items-center gap-1.5 text-[9px] text-dark-text-muted/50">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-teal shrink-0" />
              <span>Online</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {/* New Chat Button */}
          <button
            onClick={chat.clearChat}
            className="p-1.5 hover:bg-dark-border/60 rounded transition-colors text-dark-text-muted hover:text-dark-text cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
            title="Start new chat (clear history)"
            aria-label="Start new chat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {/* Fullscreen toggle button */}
          <button
            onClick={() => {
              playRetroSound("toggle");
              setIsFullscreen(!isFullscreen);
            }}
            className="p-1.5 hover:bg-dark-border/60 rounded transition-colors text-dark-text-muted hover:text-dark-text cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen chat"}
            aria-label="Fullscreen toggle"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          {onClose && (
            <button
              onClick={() => {
                playRetroSound("close");
                onClose();
              }}
              className="p-1.5 hover:bg-dark-border/60 rounded transition-colors text-dark-text-muted hover:text-dark-text cursor-pointer min-h-[36px] min-w-[36px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
              title="Close chat"
              aria-label="Close chat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 select-text overscroll-contain">
        {chat.messages.map((m) => (
          <ChatMessage key={m.id} m={m} copiedId={chat.copiedId} onCopy={chat.copyMessage} />
        ))}

        {chat.loading && (
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-amber-button/10 flex items-center justify-center shrink-0 text-[10px] select-none">🤖</span>
            <div className="rounded-2xl rounded-bl-md border border-dark-border/40 bg-dark-elevated/70 px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm">
              <LoadingDots />
            </div>
          </div>
        )}

        {/* Dummy div to scroll to */}
        <div ref={chat.messagesEndRef} />

        {/* Suggested prompts as chips */}
        {chat.messages.length === 1 && !chat.loading && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 select-none">
            {exampleQuestions.map((q) => (
              <button
                key={q}
                onClick={() => chat.sendMessage(q)}
                disabled={chat.loading}
                className="rounded-lg border border-dark-border/60 bg-dark-elevated/50 px-2.5 sm:px-3 py-2 sm:py-1.5 text-[11px] font-medium text-dark-text-muted transition-all hover:border-amber-button/30 hover:bg-amber-button/5 hover:text-amber-button active:scale-[0.97] disabled:opacity-40 cursor-pointer min-h-[36px] sm:min-h-0"
                type="button"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-2 sm:p-3 border-t border-dark-border shrink-0 bg-dark-elevated/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            chat.sendMessage();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={chat.input}
            onChange={(e) => chat.setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                chat.sendMessage();
              }
            }}
            placeholder="Ask anything about Zenith repositories..."
            disabled={chat.loading}
            rows={1}
            maxLength={2000}
            className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 sm:py-1.5 text-base sm:text-sm text-dark-text placeholder-dark-text-faint focus:outline-none focus:border-amber-button transition-colors resize-none min-h-[44px] sm:min-h-[36px] max-h-[100px] sm:max-h-[120px] overflow-y-auto font-sans"
          />
          <button
            type="submit"
            disabled={!chat.input.trim() || chat.loading}
            className="p-2.5 sm:p-2 bg-amber-button hover:bg-saffron-deep disabled:opacity-30 rounded-lg text-black transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed shrink-0 min-h-[44px] sm:min-h-[36px] min-w-[44px] sm:min-w-[36px] flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex justify-between items-center text-[9px] text-dark-text-faint mt-1.5 sm:mt-2 px-1 select-none font-semibold">
          <span>Powered by GPT-OSS & Groq</span>
          <span className="truncate ml-2">{chat.input.length} / 2000</span>
        </div>
      </div>
    </div>
  );
}
