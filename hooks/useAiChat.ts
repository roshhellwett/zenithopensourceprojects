"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { SoundType } from "@/lib/audio";
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

const MAX_HISTORY_DEPTH = 20;
const DEFAULT_PREFIX = { user: "u_", bot: "b_", error: "e_" };

export function useAiChat({
  botSender,
  welcomeMessage,
  fallbackMessage,
  errorMessage,
  idPrefix = DEFAULT_PREFIX,
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
  const mountedRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);
  const configRef = useRef({ botSender, welcomeMessage, fallbackMessage, errorMessage, idPrefix, playRetroSound });

  useEffect(() => {
    configRef.current = { botSender, welcomeMessage, fallbackMessage, errorMessage, idPrefix, playRetroSound };
  }, [botSender, welcomeMessage, fallbackMessage, errorMessage, idPrefix, playRetroSound]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const copyMessage = useCallback((id: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable (non-secure context / older browser)
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const sendMessage = useCallback(async (text?: string) => {
    const cfg = configRef.current;
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setInput("");
    const userMsg: ChatMessage = {
      id: `${cfg.idPrefix.user}${++idCounterRef.current}`,
      sender: "user",
      content: msg,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const recent = messagesRef.current.slice(-MAX_HISTORY_DEPTH);
      const response = await fetch(`${getApiUrl()}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...recent, userMsg].map((m) => ({
            sender: m.sender,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      if (!mountedRef.current) return;
      const data = await response.json();
      if (!mountedRef.current) return;
      const botContent = data.text || cfg.fallbackMessage;
      const botMsg: ChatMessage = {
        id: `${cfg.idPrefix.bot}${++idCounterRef.current}`,
        sender: cfg.botSender,
        content: botContent,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      cfg.playRetroSound?.("message");
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (!mountedRef.current || (err instanceof Error && err.name === "AbortError")) return;
      const errMsg: ChatMessage = {
        id: `${cfg.idPrefix.error}${++idCounterRef.current}`,
        sender: cfg.botSender,
        content: cfg.errorMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
      cfg.playRetroSound?.("error");
    } finally {
      abortRef.current = null;
      if (mountedRef.current) setLoading(false);
    }
  }, [input, loading]);

  const clearChat = useCallback(() => {
    const cfg = configRef.current;
    idCounterRef.current = 0;
    setMessages([
      { id: `${cfg.idPrefix.bot}0`, sender: cfg.botSender, content: cfg.welcomeMessage, timestamp: new Date().toISOString() },
    ]);
    cfg.playRetroSound?.("success");
  }, []);

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
