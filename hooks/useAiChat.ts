"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SoundType } from "@/lib/audio";
import { ZENITH_SYSTEM_PROMPT } from "@/lib/ai-prompt";
import { getApiUrl } from "@/lib/api";

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export interface UseAiChatOptions {
  botSender: string;
  welcomeMessage: string;
  fallbackMessage: string;
  errorMessage: string;
  idPrefix?: { user?: string; bot?: string; error?: string };
  playRetroSound?: (type: SoundType) => void;
}

export function useAiChat({
  botSender,
  welcomeMessage,
  fallbackMessage,
  errorMessage,
  idPrefix = { user: "u_", bot: "b_", error: "e_" },
  playRetroSound,
}: UseAiChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: `${idPrefix.bot}0`, sender: botSender, content: welcomeMessage, timestamp: new Date().toISOString() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const idCounterRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const copyMessage = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setInput("");
    const userMsg: ChatMessage = {
      id: `${idPrefix.user}${++idCounterRef.current}`,
      sender: "user",
      content: msg,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(`${getApiUrl()}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: ZENITH_SYSTEM_PROMPT,
          messages: [...messages.slice(-10), userMsg].map((m) => ({
            sender: m.sender,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const data = await response.json();
      const botContent = data.text || fallbackMessage;
      const botMsg: ChatMessage = {
        id: `${idPrefix.bot}${++idCounterRef.current}`,
        sender: botSender,
        content: botContent,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      playRetroSound?.("message");
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === "AbortError") return;
      const errMsg: ChatMessage = {
        id: `${idPrefix.error}${++idCounterRef.current}`,
        sender: botSender,
        content: errorMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
      playRetroSound?.("error");
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, botSender, fallbackMessage, errorMessage, idPrefix, playRetroSound]);

  const clearChat = useCallback(() => {
    idCounterRef.current = 0;
    setMessages([
      { id: `${idPrefix.bot}0`, sender: botSender, content: welcomeMessage, timestamp: new Date().toISOString() },
    ]);
    playRetroSound?.("success");
  }, [botSender, welcomeMessage, idPrefix, playRetroSound]);

  return {
    messages, setMessages,
    input, setInput,
    loading,
    sendMessage,
    clearChat,
    copiedId, copyMessage,
    messagesEndRef,
  };
}
