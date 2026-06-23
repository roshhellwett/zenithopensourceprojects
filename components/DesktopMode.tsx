"use client";

import React, { useState } from "react";
import DesktopIcon from "./DesktopIcon";
import DesktopWindow from "./DesktopWindow";
import ChatPanel from "./ChatPanel";
import IsometricBackground from "./IsometricBackground";
import { LEFT_DESKTOP_ICONS, RIGHT_DESKTOP_ICONS } from "@/data/desktop-icons";

import HomeApp from "@/components/apps/HomeApp";
import RegistryApp from "@/components/apps/RegistryApp";
import TelemetryApp from "@/components/apps/TelemetryApp";
import StackApp from "@/components/apps/StackApp";
import FounderApp from "@/components/apps/FounderApp";
import MascotApp from "@/components/apps/MascotApp";

interface DesktopModeProps {
  onSwitchToWebsite: () => void;
}

const TAB_LABELS: Record<string, string> = {
  home: "home.md",
  registry: "projects.exe",
  telemetry: "telemetry.log",
  stack: "stack.sys",
  founder: "founder.md",
  "ask-ai": "zenith-ai.chat",
  customers: "customers.mdx",
};

export default function DesktopMode({ onSwitchToWebsite }: DesktopModeProps) {
  const [windowOpen, setWindowOpen] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [chatOpen, setChatOpen] = useState(true);
  const [crtActive, setCrtActive] = useState(false);

  // Toast system
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);
  const addToast = (message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const playRetroSound = (type: "click" | "beep" | "success" | "toggle" | "crt") => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else if (type === "beep") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.12);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08);
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === "toggle") {
        osc.type = "square";
        osc.frequency.setValueAtTime(350, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.06);
      }
    } catch {
      // Audio fallback silent
    }
  };

  const handleIconClick = (id: string, action?: string, tabId?: string, link?: string) => {
    playRetroSound("click");

    if (action === "link" && link) {
      window.open(link, "_blank");
      return;
    }

    if (action === "toggle-mode") {
      onSwitchToWebsite();
      return;
    }

    if (action === "trash") {
      addToast("Trash bin empty. Clean workspace!");
      return;
    }

    if (action === "open-tab" && tabId) {
      setActiveTab(tabId);
      setWindowOpen(true);
      setIsMinimized(false);
      addToast(`Opening ${TAB_LABELS[tabId] || tabId}...`);
    }
  };

  return (
    <div className="relative h-[calc(100vh-48px)] overflow-hidden">
      {/* CRT overlay */}
      {crtActive && <div className="crt-overlay" />}

      {/* Background */}
      <IsometricBackground />

      {/* Toast notifications */}
      <div className="fixed bottom-4 left-4 z-[60] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-dark-surface/90 border border-dark-border px-3 py-2.5 rounded-lg shadow-xl text-xs text-dark-text font-medium flex items-center gap-2 animate-fade-in-up backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-amber-button rounded-full animate-pulse shrink-0" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Left desktop icons */}
      <div className="absolute left-3 top-4 z-20 flex flex-col gap-1 hidden md:flex">
        {LEFT_DESKTOP_ICONS.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            iconKey={icon.icon}
            onClick={() => handleIconClick(icon.id, icon.action, icon.tabId, icon.link)}
          />
        ))}
      </div>

      {/* Right desktop icons */}
      <div className="absolute right-3 top-4 z-20 hidden md:flex flex-col gap-1 items-center">
        {RIGHT_DESKTOP_ICONS.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            iconKey={icon.icon}
            onClick={() => handleIconClick(icon.id, icon.action, icon.tabId, icon.link)}
          />
        ))}
      </div>

      {/* Mobile icons bar */}
      <div className="md:hidden flex overflow-x-auto gap-2 px-3 py-2 bg-dark-surface/80 backdrop-blur-sm border-b border-dark-border">
        {LEFT_DESKTOP_ICONS.slice(0, 7).map((icon) => (
          <button
            key={icon.id}
            onClick={() => handleIconClick(icon.id, icon.action, icon.tabId, icon.link)}
            className="flex flex-col items-center gap-0.5 shrink-0 px-2 py-1 text-dark-text-muted hover:text-dark-text transition-colors"
          >
            <span className="text-[10px] text-center leading-tight whitespace-nowrap">{icon.label.split("\n")[0]}</span>
          </button>
        ))}
      </div>

      {/* Main document window */}
      {windowOpen && !isMinimized && (
        <DesktopWindow
          title={TAB_LABELS[activeTab] || "document"}
          onClose={() => setWindowOpen(false)}
          isMaximized={isMaximized}
          onToggleMaximize={() => setIsMaximized(!isMaximized)}
          onMinimize={() => setIsMinimized(true)}
        >
          {/* Window content with hero + tabs */}
          <div className="bg-dark-surface min-h-full">
            {/* Hero inside window */}
            <div className="px-6 md:px-10 pt-8 pb-6 border-b border-dark-border-subtle">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="6" width="28" height="20" rx="3" fill="#1d1f27" stroke="#F1A82C" strokeWidth="2"/>
                  <path d="M6 10h4v2H6zM12 10h4v2h-4zM20 10h6v2h-6z" fill="#F1A82C" opacity="0.8"/>
                  <path d="M6 15h20v1H6z" fill="#65675e"/>
                  <path d="M6 18h14v1H6z" fill="#65675e"/>
                </svg>
                <span className="font-extrabold text-xl tracking-tight text-dark-text">Zenith</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-dark-text mb-4">
                The open source way to build civic tech
              </h1>

              <p className="text-sm text-dark-text-muted leading-relaxed max-w-[600px] mb-6">
                Zenith is the unified registry for civic-tech platforms, systems utilities, and developer tools. Built in India, MIT-licensed, always free.
              </p>

              <div className="flex items-center gap-3 mb-4">
                <a
                  href="https://github.com/roshhellwett/zenithopensourceprojects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-button hover:bg-saffron-deep text-black px-4 py-2 rounded-md text-xs font-bold transition-all active:scale-95 border border-amber-shadow"
                >
                  Get started - free
                </a>
                <a
                  href="https://github.com/roshhellwett"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-dark-border hover:border-dark-text-muted text-dark-text px-4 py-2 rounded-md text-xs font-bold transition-all hover:bg-dark-surface"
                >
                  View Source
                </a>
              </div>

              <div className="flex items-center gap-4 text-xs text-dark-text-muted">
                <a href="https://github.com/roshhellwett" target="_blank" rel="noopener noreferrer" className="posthog-link flex items-center gap-1">
                  <span className="text-accent-teal">◆</span> GitHub
                </a>
                <span className="text-dark-border">•</span>
                <span className="posthog-link cursor-pointer" onClick={onSwitchToWebsite}>▶ Website mode</span>
                <span className="text-dark-border">•</span>
                <span className="posthog-link cursor-pointer" onClick={() => { setActiveTab("founder"); addToast("Opening founder.md..."); }}>💬 Talk to founder</span>
              </div>
            </div>

            {/* Tab navigation inside window */}
            <div className="flex overflow-x-auto border-b border-dark-border bg-dark-surface">
              {[
                { id: "home", label: "Understand projects" },
                { id: "registry", label: "Project registry" },
                { id: "telemetry", label: "Debug & audit" },
                { id: "stack", label: "Tech stack" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    playRetroSound("click");
                  }}
                  className={`px-5 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                    activeTab === tab.id
                      ? "text-dark-text border-amber-button bg-dark-surface/30"
                      : "text-dark-text-muted border-transparent hover:text-dark-text hover:bg-dark-surface/20"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content area */}
            <div className="p-6 md:p-8 min-h-[300px]">
              {activeTab === "home" && <HomeApp />}
              {activeTab === "registry" && <RegistryApp playRetroSound={playRetroSound} />}
              {activeTab === "telemetry" && <TelemetryApp playRetroSound={playRetroSound} addToast={addToast} />}
              {activeTab === "stack" && <StackApp playRetroSound={playRetroSound} addToast={addToast} />}
              {activeTab === "founder" && <FounderApp />}
              {activeTab === "ask-ai" && <MascotApp playRetroSound={playRetroSound} />}
              {activeTab === "customers" && <RegistryApp playRetroSound={playRetroSound} />}
            </div>
          </div>
        </DesktopWindow>
      )}

      {/* Chat Panel (floating, right side) */}
      {chatOpen && (
        <div className="absolute bottom-4 right-4 z-50 hidden lg:block">
          <ChatPanel onClose={() => setChatOpen(false)} />
        </div>
      )}

      {/* Chat toggle (when closed) */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-dark-surface border border-dark-border rounded-full flex items-center justify-center shadow-xl hover:bg-dark-elevated transition-all cursor-pointer"
          title="Open AI Chat"
        >
          <svg className="w-5 h-5 text-dark-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Minimized window indicator */}
      {windowOpen && isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-dark-surface border border-dark-border rounded-lg px-4 py-2 shadow-xl flex items-center gap-2 text-sm text-dark-text hover:bg-dark-elevated transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-amber-button" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span>{TAB_LABELS[activeTab] || "document"}</span>
        </button>
      )}
    </div>
  );
}
