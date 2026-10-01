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
        <div className="group relative pr-10 flex gap-2.5 items-start">
          <span className="w-6 h-6 rounded-full bg-amber-button/15 border border-amber-button/30 flex items-center justify-center shrink-0 text-xs select-none shadow-sm mt-0.5">🤖</span>
          <div className="flex-1 min-w-0 bg-dark-elevated border border-dark-border/80 rounded-2xl rounded-tl-sm p-3.5 shadow-sm text-left">
            <div className="text-xs sm:text-sm text-dark-text leading-relaxed">
              <FormattedText text={m.content} />
            </div>
            <button
              onClick={() => onCopy(m.id, m.content)}
              className="absolute right-0 top-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity px-2 py-0.5 bg-dark-surface hover:bg-dark-border/40 border border-dark-border rounded text-[9px] text-dark-text-muted hover:text-dark-text cursor-pointer font-semibold shadow-sm select-none"
              title="Copy response"
            >
              {copiedId === m.id ? "✓ Copied" : "📋 Copy"}
            </button>
          </div>
        </div>
      )}
      {m.sender === "user" && (
        <div className="inline-block bg-amber-button/15 border border-amber-button/35 rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-xs sm:text-sm text-dark-text font-medium max-w-[85%] text-left relative group shadow-sm">
          <p className="whitespace-pre-wrap">{m.content}</p>
          <button
            onClick={() => onCopy(m.id, m.content)}
            className="block sm:inline-block sm:absolute sm:right-full sm:mr-2 sm:top-1/2 sm:-translate-y-1/2 mt-1.5 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity px-2 py-0.5 bg-dark-surface hover:bg-dark-border/40 border border-dark-border rounded text-[9px] text-dark-text-muted hover:text-dark-text cursor-pointer font-semibold shadow-sm select-none"
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
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) { last?.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first?.focus(); e.preventDefault(); }
      } else if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
          e.preventDefault();
        } else if (onClose) {
          onClose();
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen, onClose]);

  const chat = useAiChat({
    botSender: "bot",
    welcomeMessage: "Hi! I'm the Zenith assistant. Ask me about our tools, install guides, or the founder.",
    fallbackMessage: "I'm having trouble thinking right now. Try again?",
    errorMessage: "Chat service is temporarily unavailable. Please try again later.",
    playRetroSound,
  });

  return (
    <>
      {/* Ambient backdrop when maximized */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-dark-text/25 backdrop-blur-[2px] z-[65] animate-fade-in"
          onClick={() => {
            playRetroSound("toggle");
            setIsFullscreen(false);
          }}
          aria-hidden="true"
        />
      )}

      <div
        ref={panelRef}
        className={`bg-dark-surface/98 backdrop-blur-xl border border-dark-border flex flex-col overflow-hidden window-chrome z-[70] transition-all duration-200 ${
          isFullscreen
            ? "fixed inset-x-2 sm:inset-x-8 md:inset-x-14 lg:inset-x-24 top-[calc(var(--navbar-height)+8px)] bottom-[calc(var(--taskbar-height)+8px)] rounded-2xl shadow-[0_30px_90px_-15px_rgba(35,37,29,0.35)]"
            : "fixed bottom-[calc(var(--taskbar-height)+8px)] right-0 sm:right-4 left-0 sm:left-auto w-full sm:w-[390px] md:w-[420px] h-[72vh] sm:h-[550px] max-h-[82vh] sm:max-h-[580px] rounded-t-2xl sm:rounded-2xl shadow-[0_25px_60px_-15px_rgba(35,37,29,0.25)] animate-pop-in"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Zenith AI Chat"
      >
        {/* Header */}
        <div className="px-3.5 sm:px-5 py-2.5 border-b border-dark-border/80 bg-dark-elevated/90 shrink-0 select-none min-h-[48px] sm:min-h-0">
          <div className={`w-full mx-auto flex items-center justify-between gap-3 ${isFullscreen ? "max-w-4xl" : ""}`}>
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-button/15 text-amber-shadow border border-amber-button/30 shadow-sm shrink-0">
                <Zap size={14} className="text-amber-button" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-dark-text tracking-wide flex items-center gap-2">
                  <span>Zenith Neural Copilot</span>
                  <span className="text-[8px] font-mono font-bold text-accent-teal bg-accent-teal/10 border border-accent-teal/30 px-1.5 py-0.2 rounded-full">
                    GROQ LPU
                  </span>
                </p>
                <p className="flex items-center gap-1.5 text-[9px] text-dark-text-muted">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-teal animate-pulse shrink-0" />
                  <span>Low-Latency Civic Knowledge Engine</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {/* New Chat Button */}
              <button
                onClick={() => {
                  playRetroSound("click");
                  chat.clearChat();
                }}
                className="p-1.5 hover:bg-dark-border/40 rounded-md transition-colors text-dark-text-muted hover:text-dark-text cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
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
                className="p-1.5 hover:bg-dark-border/40 rounded-md transition-colors text-dark-text-muted hover:text-dark-text cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                title={isFullscreen ? "Restore down" : "Maximize"}
                aria-label={isFullscreen ? "Restore down" : "Maximize"}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-amber-button" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              {onClose && (
                <button
                  onClick={() => {
                    playRetroSound("close");
                    onClose();
                  }}
                  className="p-1.5 hover:bg-red-500/10 hover:text-red-600 rounded-md transition-colors text-dark-text-muted cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                  title="Close chat"
                  aria-label="Close chat"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 select-text overscroll-contain bg-dark-surface/50">
          <div className={`w-full mx-auto flex flex-col space-y-3 sm:space-y-4 ${isFullscreen ? "max-w-4xl" : ""}`}>
            {chat.messages.map((m) => (
              <ChatMessage key={m.id} m={m} copiedId={chat.copiedId} onCopy={chat.copyMessage} />
            ))}

            {chat.loading && (
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-button/15 border border-amber-button/30 flex items-center justify-center shrink-0 text-xs select-none">🤖</span>
                <div className="rounded-2xl rounded-tl-sm border border-dark-border/80 bg-dark-elevated px-4 py-3 shadow-sm">
                  <LoadingDots />
                </div>
              </div>
            )}

            {/* Dummy div to scroll to */}
            <div ref={chat.messagesEndRef} />

            {/* Suggested prompts as clean retro chips */}
            {chat.messages.length === 1 && !chat.loading && (
              <div className="pt-2">
                <p className="text-[10px] font-bold text-dark-text-faint uppercase tracking-wider mb-2">Prompt Starters</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 select-none">
                  {exampleQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        playRetroSound("pop");
                        chat.sendMessage(q);
                      }}
                      disabled={chat.loading}
                      className="rounded-lg border border-dark-border bg-dark-elevated hover:bg-white hover:border-amber-button/60 hover:text-dark-text text-dark-text-muted px-2.5 sm:px-3 py-1.5 text-[11px] font-semibold transition-all active:scale-[0.97] disabled:opacity-40 cursor-pointer shadow-sm text-left"
                      type="button"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 border-t border-dark-border/80 shrink-0 bg-dark-elevated/70 backdrop-blur-md">
          <div className={`w-full mx-auto ${isFullscreen ? "max-w-4xl" : ""}`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                playRetroSound("click");
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
                    playRetroSound("click");
                    chat.sendMessage();
                  }
                }}
                placeholder="Ask about architecture, repositories, civic tech..."
                disabled={chat.loading}
                rows={1}
                maxLength={2000}
                className="flex-1 bg-white border border-dark-border focus:border-amber-button rounded-xl px-3.5 py-2 text-sm text-dark-text placeholder-dark-text-faint focus:outline-none transition-all resize-none min-h-[40px] max-h-[140px] overflow-y-auto font-sans focus:ring-2 focus:ring-amber-button/30 shadow-inner"
              />
              <button
                type="submit"
                disabled={!chat.input.trim() || chat.loading}
                className="p-2.5 bg-amber-button hover:bg-saffron-deep disabled:opacity-30 rounded-xl text-black font-bold transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center shadow-md"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex justify-between items-center text-[9px] text-dark-text-muted mt-2 px-1 select-none font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-teal" />
                <span>Zenith Intelligence Core</span>
              </span>
              <span className="truncate ml-2">{chat.input.length} / 2000</span>
            </div>
          </div>
        </div>
    </div>
    </>
  );
}
