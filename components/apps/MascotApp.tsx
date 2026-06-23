import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { getApiUrl } from '@/lib/api';

export default function MascotApp({ playRetroSound }: { playRetroSound: (type: any) => void }) {
  const [messages, setMessages] = useState<any[]>([
    {
      id: "welcome",
      sender: "hogai",
      content: "Hello, system builder! 🦥 I am Zenith AI, your retro helper sloth. I live inside this terminal workstation. Ask me anything about Zenith's open source projects like Project Sentinel or ZeroGapVote, or inspect our source code!",
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      id: `msg_${Date.now()}`,
      sender: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsSendingMessage(true);
    playRetroSound("click");

    try {
      const response = await fetch(`${getApiUrl()}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      const data = await response.json();

      const botMsg = {
        id: `msg_bot_${Date.now()}`,
        sender: "hogai",
        content: data.text || "I was taking a short nap. What were we compiling?",
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      playRetroSound("beep");
    } catch (err) {
      const botErrorMsg = {
        id: `msg_bot_err_${Date.now()}`,
        sender: "hogai",
        content: "Oops, my hammock strings broke! Network timeout. Ensure GROQ_API_KEY is configured or continue playing in local demo mode.",
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botErrorMsg]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div className="bg-dark-surface border border-dark-border p-2 rounded text-xs text-dark-text-muted mb-2 flex items-center justify-between">
        <span>Ask about compile paths, scraper setups, or project telemetry details.</span>
        <span className="font-mono text-[9px] bg-dark-elevated px-1.5 py-0.5 rounded text-accent-teal">Groq · Llama 3.3</span>
      </div>

      {/* Chat bubbles container */}
      <div className="flex-1 bg-dark-bg border border-dark-border rounded p-3 overflow-y-auto space-y-3 font-sans relative">
        {messages.map((m) => {
          const isBot = m.sender === "hogai";
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 max-w-[85%] ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div className="shrink-0 select-none">
                <div className={`w-8 h-8 rounded flex items-center justify-center p-1 border ${isBot ? "bg-dark-surface border-dark-border" : "bg-cobalt/20 border-cobalt/30 text-white"}`}>
                  {isBot ? "🦥" : "💻"}
                </div>
              </div>
              <div
                className={`p-3 rounded text-xs leading-relaxed border ${
                  isBot
                    ? "bg-dark-surface border-dark-border text-dark-text rounded-tl-none"
                    : "bg-cobalt/20 border-cobalt/30 text-dark-text rounded-tr-none"
                }`}
              >
                {m.content}
                <div className={`text-[9px] mt-1.5 font-mono ${isBot ? "text-dark-text-faint" : "text-cobalt/60"}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isSendingMessage && (
          <div className="flex gap-2.5 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded bg-dark-surface flex items-center justify-center p-1 border border-dark-border shrink-0">🦥</div>
            <div className="p-3 bg-dark-surface border border-dark-border rounded rounded-tl-none flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-dark-text-muted rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-dark-text-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-dark-text-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="mt-3">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isSendingMessage}
            placeholder="Type your prompt..."
            className="w-full bg-dark-bg border border-dark-border rounded p-2.5 pr-20 text-xs text-dark-text focus:outline-none focus:ring-1 focus:ring-cobalt font-mono"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isSendingMessage}
            className="absolute right-1 top-1 bottom-1 bg-amber-button hover:bg-saffron-deep disabled:opacity-50 disabled:cursor-not-allowed border border-amber-shadow px-3 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-black"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-2.5 flex items-center flex-wrap gap-1.5 text-[10px] text-dark-text-muted font-mono select-none">
          <span className="font-bold uppercase">Quick prompts:</span>
          <button
            type="button"
            onClick={() => { setChatInput("Tell me more about Project Sentinel scraper capabilities."); playRetroSound("click"); }}
            className="px-2 py-0.5 border border-dark-border bg-dark-surface rounded hover:bg-dark-elevated hover:text-dark-text cursor-pointer"
          >
            &ldquo;About Sentinel Scraper&rdquo;
          </button>
          <button
            type="button"
            onClick={() => { setChatInput("How does Project ZeroGapVote secure digital voting proposals?"); playRetroSound("click"); }}
            className="px-2 py-0.5 border border-dark-border bg-dark-surface rounded hover:bg-dark-elevated hover:text-dark-text cursor-pointer"
          >
            &ldquo;ZeroGapVote Security&rdquo;
          </button>
        </div>
      </div>
    </div>
  );
}
