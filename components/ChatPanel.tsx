"use client";

import React, { useState } from "react";
import { Send, ChevronDown, X } from "lucide-react";
import { getApiUrl } from "@/lib/api";

interface ChatPanelProps {
  onClose?: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<{ id: string; sender: string; content: string; timestamp: string }[]>([
    {
      id: "welcome",
      sender: "bot",
      content: "Hi, I'm Zenith AI!\n\nI'm an AI assistant trained on documentation, help articles, and other content.\n\nAsk me anything about Zenith projects.",
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const exampleQuestions = [
    "How does Project Sentinel work?",
    "What is ZeroGapVote?",
    "What tech stack does Zenith use?",
    "Tell me about the founder",
  ];

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg = {
      id: `u_${Date.now()}`,
      sender: "user",
      content: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${getApiUrl()}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `b_${Date.now()}`,
          sender: "bot",
          content: data.text || "I'm having trouble thinking right now. Try again?",
          timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e_${Date.now()}`,
          sender: "bot",
          content: "Connection lost. Make sure GROQ_API_KEY is configured in your environment variables.",
          timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[360px] h-[520px] bg-dark-surface border border-dark-border rounded-xl shadow-2xl flex flex-col overflow-hidden window-chrome">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-dark-border bg-dark-elevated shrink-0">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-dark-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-sm font-medium text-dark-text">Chat 1</span>
          <ChevronDown className="w-3 h-3 text-dark-text-muted" />
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-dark-border rounded transition-colors text-dark-text-muted">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5v14"/></svg>
          </button>
          <button className="p-1 hover:bg-dark-border rounded transition-colors text-dark-text-muted">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-dark-border rounded transition-colors text-dark-text-muted">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`${m.sender === "user" ? "text-right" : ""}`}>
            {m.sender === "bot" && (
              <div className="text-sm text-dark-text leading-relaxed whitespace-pre-line">
                {m.content}
              </div>
            )}
            {m.sender === "user" && (
              <div className="inline-block bg-cobalt/20 border border-cobalt/30 rounded-lg px-3 py-2 text-sm text-dark-text max-w-[85%] text-left">
                {m.content}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-dark-text-muted rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-dark-text-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-dark-text-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {/* Example questions (only show if no user messages) */}
        {messages.length === 1 && (
          <div className="space-y-2 mt-4">
            <div className="text-[10px] uppercase tracking-wider text-dark-text-muted font-bold">
              Example Questions
            </div>
            {exampleQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="w-full text-left px-3 py-2.5 bg-dark-elevated/50 border border-dark-border rounded-lg text-sm text-dark-text hover:bg-dark-elevated hover:border-dark-border transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-dark-border shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How do I get started?"
            disabled={loading}
            className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text placeholder-dark-text-faint focus:outline-none focus:border-amber-button transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 bg-amber-button hover:bg-saffron-deep disabled:opacity-30 rounded-lg text-black transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-[10px] text-dark-text-faint mt-2 text-center">
          Powered by Groq · Llama 3.3
        </div>
      </div>
    </div>
  );
}
