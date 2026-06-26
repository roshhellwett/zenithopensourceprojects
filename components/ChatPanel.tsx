"use client";

/* eslint-disable react-hooks/refs -- useAiChat returns state not refs */

import React, { useState, useEffect } from "react";
import { Send, X, RefreshCw, Maximize2, Minimize2, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { playRetroSound } from "@/lib/audio";
import { FormattedText, LoadingDots } from "@/lib/format";
import { useAiChat } from "@/hooks/useAiChat";

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
              className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 bg-dark-elevated hover:bg-dark-border/40 border border-dark-border rounded text-[9px] text-dark-text-muted hover:text-dark-text cursor-pointer font-semibold shadow-sm select-none"
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
            className="absolute right-full mr-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 bg-dark-elevated hover:bg-dark-border/40 border border-dark-border rounded text-[9px] text-dark-text-muted hover:text-dark-text cursor-pointer font-semibold shadow-sm select-none"
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

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isFullscreen]);

  const chat = useAiChat({
    botSender: "bot",
    welcomeMessage: "Hi! I'm the Zenith assistant. Ask me about our tools, install guides, or the founder.",
    fallbackMessage: "I'm having trouble thinking right now. Try again?",
    errorMessage: "Chat service is temporarily unavailable. Please try again later.",
    playRetroSound,
  });

  return (
    <motion.div
      layout
      initial={{ y: 25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 25, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`bg-dark-surface border border-dark-border flex flex-col overflow-hidden window-chrome transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-x-0 top-[var(--navbar-height)] bottom-10 z-50 rounded-none border-none shadow-none"
          : "w-full sm:w-[360px] h-[75vh] sm:h-[520px] rounded-t-2xl sm:rounded-xl shadow-2xl max-h-[80vh] sm:max-h-[520px]"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Zenith AI Chat"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-dark-border/60 bg-gradient-to-r from-amber-button/5 to-transparent shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-button/10 text-amber-button shadow-sm">
            <Zap size={14} />
          </span>
          <div>
            <p className="text-xs font-bold text-dark-text">Zenith AI</p>
            <p className="flex items-center gap-1.5 text-[9px] text-dark-text-muted/50">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-teal" />
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {/* New Chat Button */}
          <button
            onClick={chat.clearChat}
            className="p-1.5 hover:bg-dark-border/60 rounded transition-colors text-dark-text-muted hover:text-dark-text cursor-pointer"
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
            className="p-1.5 hover:bg-dark-border/60 rounded transition-colors text-dark-text-muted hover:text-dark-text cursor-pointer"
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
              className="p-1.5 hover:bg-dark-border/60 rounded transition-colors text-dark-text-muted hover:text-dark-text cursor-pointer"
              title="Close chat"
              aria-label="Close chat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
        {chat.messages.map((m) => (
          <ChatMessage key={m.id} m={m} copiedId={chat.copiedId} onCopy={chat.copyMessage} />
        ))}

        {chat.loading && (
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-amber-button/10 flex items-center justify-center shrink-0 text-[10px] select-none">🤖</span>
            <div className="rounded-2xl rounded-bl-md border border-dark-border/40 bg-dark-elevated/70 px-4 py-3 shadow-sm">
              <LoadingDots />
            </div>
          </div>
        )}

        {/* Dummy div to scroll to */}
        <div ref={chat.messagesEndRef} />

        {/* Suggested prompts as chips */}
        {chat.messages.length === 1 && !chat.loading && (
          <div className="flex flex-wrap gap-2 mt-3 select-none">
            {exampleQuestions.map((q) => (
              <button
                key={q}
                onClick={() => chat.sendMessage(q)}
                disabled={chat.loading}
                className="rounded-lg border border-dark-border/60 bg-dark-elevated/50 px-3 py-1.5 text-[11px] font-medium text-dark-text-muted transition-all hover:border-amber-button/30 hover:bg-amber-button/5 hover:text-amber-button active:scale-[0.97] disabled:opacity-40 cursor-pointer"
                type="button"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-dark-border shrink-0 bg-dark-elevated/20">
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
            className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text placeholder-dark-text-faint focus:outline-none focus:border-amber-button transition-colors resize-none py-1.5 min-h-[36px] max-h-[100px] overflow-y-auto font-sans"
          />
          <button
            type="submit"
            disabled={!chat.input.trim() || chat.loading}
            className="p-2 bg-amber-button hover:bg-saffron-deep disabled:opacity-30 rounded-lg text-black transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex justify-between items-center text-[9px] text-dark-text-faint mt-2 px-1 select-none font-semibold">
          <span>Powered by Llama 3.3 & Groq</span>
          <span>{chat.input.length} / 2000</span>
        </div>
      </div>
    </motion.div>
  );
}
