"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import DesktopIcon, { renderDesktopIcon } from "./DesktopIcon";
import DesktopWindow from "./DesktopWindow";
import ChatPanel from "./ChatPanel";
import { STORE_URL } from "@/lib/site";
import { LEFT_DESKTOP_ICONS, RIGHT_DESKTOP_ICONS } from "@/data/desktop-icons";
import { motion } from "framer-motion";
import { playRetroSound, getSoundEnabled, setSoundEnabled } from "@/lib/audio";

import { ZenithLogo } from "@/components/ZenithLogo";
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
};

// Stagger entrance animations for desktop icons
const iconContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const iconItemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 24,
    },
  },
};

// Clock Widget for the Taskbar
function ClockWidget() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>{time}</span>;
}

export default function DesktopMode({ onSwitchToWebsite }: DesktopModeProps) {
  const [windowOpen, setWindowOpen] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [chatOpen, setChatOpen] = useState(true);
  const [crtActive, setCrtActive] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Startup animation boot sequence
  const [isBooting, setIsBooting] = useState(true);
  const [bootLog, setBootLog] = useState<string[]>([]);

  const [soundEnabled, setSoundEnabledState] = useState(() => getSoundEnabled());

  // Sync sound settings local state
  useEffect(() => {
    const handleToggle = (e: Event) => {
      setSoundEnabledState((e as CustomEvent).detail);
    };
    window.addEventListener("zenith_sound_toggle", handleToggle);
    return () => window.removeEventListener("zenith_sound_toggle", handleToggle);
  }, []);

  // Right-click context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

  // Toast system
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);
  const toastTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const toastIdCounterRef = useRef(0);
  const addToast = useCallback((message: string) => {
    const id = `${++toastIdCounterRef.current}_${Date.now()}`;
    setToasts((prev) => [...prev, { id, message }]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      toastTimersRef.current.delete(id);
    }, 3500);
    toastTimersRef.current.set(id, timer);
  }, []);

  // Clean up all toast timers on unmount
  useEffect(() => {
    const timers = toastTimersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  // playRetroSound is imported from @/lib/audio

  // Boot loader execution
  const bootTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    let booted = false;
    try { booted = !!sessionStorage.getItem("zenith_booted"); } catch {}
    if (booted) { setIsBooting(false); return; } // eslint-disable-line react-hooks/set-state-in-effect

    const lines = [
      "ZENITH REGISTRY BOOTLOADER v1.0.4",
      "INIT: Loading kernel modules...",
      "INIT: Configuring memory tables (x86_64)...",
      "CORE: Initializing optical airgap protocols...",
      "NET: Mapping node endpoints...",
      "SEC: Security keys loaded successfully.",
      "SEC: Checking rate-limiting policies... OK",
      "UI: Loading Desktop OS graphical workspace...",
      "SUCCESS: Boot sequence complete. Entering shell.",
    ];

    const lineRef = { current: 0 };
    const interval = setInterval(() => {
      if (lineRef.current < lines.length) {
        setBootLog((prev) => [...prev, lines[lineRef.current]]);
        lineRef.current++;
      } else {
        clearInterval(interval);
        bootTimeoutRef.current = setTimeout(() => {
          setIsBooting(false);
          try { sessionStorage.setItem("zenith_booted", "true"); } catch {}
          addToast("Zenith Workspace initialized successfully.");
          playRetroSound("success");
        }, 500);
      }
    }, 180);

    return () => {
      clearInterval(interval);
      if (bootTimeoutRef.current) clearTimeout(bootTimeoutRef.current);
    };
  }, [addToast]);

  // Keyboard Shortcuts Hook (refs to avoid re-registering listener)
  const windowOpenRef = useRef(windowOpen);
  const isMinimizedRef = useRef(isMinimized);
  const crtActiveRef = useRef(crtActive);
  const isBootingRef = useRef(isBooting);

  useEffect(() => { windowOpenRef.current = windowOpen; }, [windowOpen]);
  useEffect(() => { isMinimizedRef.current = isMinimized; }, [isMinimized]);
  useEffect(() => { crtActiveRef.current = crtActive; }, [crtActive]);
  useEffect(() => { isBootingRef.current = isBooting; }, [isBooting]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBootingRef.current) return;

      // Esc to minimize/close active window
      if (e.key === "Escape" && windowOpenRef.current && !isMinimizedRef.current) {
        setIsMinimized(true);
        addToast("Window minimized. Toggle via bottom taskbar.");
        playRetroSound("toggle");
      }

      // Ctrl+Shift+T to toggle CRT filter
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "T") {
        e.preventDefault();
        setCrtActive((prev) => {
          const next = !prev;
          playRetroSound("crt");
          addToast(`CRT Filter ${next ? "enabled" : "disabled"}`);
          return next;
        });
      }

      // Ctrl + 1-4 to switch active tabs
      if (e.ctrlKey && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        const tabMap = ["home", "registry", "telemetry", "stack"];
        const selectedTab = tabMap[parseInt(e.key, 10) - 1];
        if (selectedTab) {
          setActiveTab(selectedTab);
          setWindowOpen(true);
          setIsMinimized(false);
          addToast(`Switched to: ${TAB_LABELS[selectedTab]}`);
          playRetroSound("click");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addToast]);

  // Context Menu handlers
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
  };

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    window.addEventListener("click", closeContextMenu);
    return () => window.removeEventListener("click", closeContextMenu);
  }, [closeContextMenu]);

  const handleIconClick = useCallback((id: string, action?: string, tabId?: string, link?: string) => {
    playRetroSound("click");

    if (action === "link" && link) {
      window.open(link, "_blank", "noopener,noreferrer");
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
  }, [onSwitchToWebsite, addToast]);

  const handleRefresh = () => {
    playRetroSound("success");
    addToast("Re-indexing project modules...");
    setRefreshKey((prev) => prev + 1);
  };

  // Context menu handlers
  const handleContextOpenHome = useCallback(() => {
    setWindowOpen(true);
    setIsMinimized(false);
    setActiveTab("home");
    closeContextMenu();
  }, [closeContextMenu]);

  const handleContextOpenAssistant = useCallback(() => {
    setChatOpen(true);
    closeContextMenu();
  }, [closeContextMenu]);

  const handleContextToggleCrt = useCallback(() => {
    const next = !crtActive;
    setCrtActive(next);
    playRetroSound("crt");
    addToast(next ? "CRT Filter ON" : "CRT Filter OFF");
    closeContextMenu();
  }, [crtActive, addToast, closeContextMenu]);

  const handleContextToggleSound = useCallback(() => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    setSoundEnabledState(nextSound);
    addToast(`Retro Sounds: ${nextSound ? "ON" : "OFF"}`);
    closeContextMenu();
  }, [soundEnabled, addToast, closeContextMenu]);

  const handleContextGoToWebsite = useCallback(() => {
    onSwitchToWebsite();
    closeContextMenu();
  }, [onSwitchToWebsite, closeContextMenu]);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    playRetroSound("click");
  }, []);

  const handleTaskbarClick = useCallback((appId: string, isRunning: boolean) => {
    setActiveTab(appId);
    setWindowOpen(true);
    setIsMinimized(isRunning);
    playRetroSound("click");
  }, []);

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-[#191b22] text-amber-button font-mono p-6 flex flex-col justify-between z-[9999]">
        <div className="space-y-1 text-xs select-none max-w-xl">
          {bootLog.map((line, idx) => (
            <p
              key={idx}
              className={
                line && typeof line === "string" && line.startsWith("SUCCESS")
                  ? "text-accent-teal font-bold"
                  : line && typeof line === "string" && line.startsWith("SEC")
                  ? "text-[#FEBC2E]"
                  : ""
              }
            >
              {line}
            </p>
          ))}
          <p className="animate-pulse">▊</p>
        </div>
        <div className="flex items-center justify-between text-[10px] text-dark-text-faint border-t border-dark-border/20 pt-4">
          <span>ZENITH SYSTEM RUNTIME</span>
          <span>India verified © {new Date().getFullYear()}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-[calc(100vh-var(--navbar-height))] overflow-hidden"
      onContextMenu={handleContextMenu}
    >
      {/* CRT scanline overlay */}
      {crtActive && <div className="crt-overlay" />}

      {/* Toast notifications */}
      <div className="fixed bottom-14 left-4 z-[60] flex flex-col gap-2 max-w-sm" role="status" aria-live="polite" aria-label="Notifications">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-dark-surface/90 border border-dark-border px-3 py-2.5 rounded-lg shadow-xl text-xs text-dark-text font-medium flex items-center gap-2 animate-fade-in-up backdrop-blur-sm relative overflow-hidden"
          >
            <span className="w-2 h-2 bg-amber-button rounded-full animate-pulse shrink-0" />
            <span>{t.message}</span>
            <div className="absolute bottom-0 left-0 h-0.5 bg-amber-button toast-progress-bar" style={{ width: "100%" }} />
          </div>
        ))}
      </div>

      {/* Right-click Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed bg-dark-elevated border border-dark-border rounded-lg shadow-2xl py-1 z-50 min-w-44 select-none animate-scale-in"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleContextOpenHome}
            className="w-full text-left px-3 py-1.5 text-xs text-dark-text hover:bg-dark-surface cursor-pointer flex items-center gap-2"
          >
            📂 Open home.md
          </button>
          <button
            onClick={handleContextOpenAssistant}
            className="w-full text-left px-3 py-1.5 text-xs text-dark-text hover:bg-dark-surface cursor-pointer flex items-center gap-2"
          >
            💬 Open AI Assistant
          </button>
          <button
            onClick={handleContextToggleCrt}
            className="w-full text-left px-3 py-1.5 text-xs text-dark-text hover:bg-dark-surface cursor-pointer flex items-center gap-2"
          >
            📺 Toggle CRT overlay
          </button>
          <button
            onClick={handleContextToggleSound}
            className="w-full text-left px-3 py-1.5 text-xs text-dark-text hover:bg-dark-surface cursor-pointer flex items-center gap-2"
          >
            🔊 {soundEnabled ? "Mute retro sounds" : "Enable retro sounds"}
          </button>
          <div className="h-px bg-dark-border-subtle my-1" />
          <button
            onClick={handleContextGoToWebsite}
            className="w-full text-left px-3 py-1.5 text-xs text-dark-text hover:bg-dark-surface cursor-pointer flex items-center gap-2"
          >
            🌐 Go to Website Mode
          </button>
        </div>
      )}

      {/* Left desktop icons (staggered animated) */}
      <motion.div
        variants={iconContainerVariants}
        initial="hidden"
        animate="visible"
        className="absolute left-3 top-4 z-20 hidden md:flex flex-col gap-1"
      >
        {LEFT_DESKTOP_ICONS.map((icon) => (
          <motion.div key={icon.id} variants={iconItemVariants}>
            <DesktopIcon
              id={icon.id}
              label={icon.label}
              iconKey={icon.icon}
              onClick={() => handleIconClick(icon.id, icon.action, icon.tabId, icon.link)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Right desktop icons (staggered animated) */}
      <motion.div
        variants={iconContainerVariants}
        initial="hidden"
        animate="visible"
        className="absolute right-3 top-4 z-20 hidden md:flex flex-col gap-1 items-center"
      >
        {RIGHT_DESKTOP_ICONS.map((icon) => (
          <motion.div key={icon.id} variants={iconItemVariants}>
            <DesktopIcon
              id={icon.id}
              label={icon.label}
              iconKey={icon.icon}
              onClick={() => handleIconClick(icon.id, icon.action, icon.tabId, icon.link)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile top navigation scroll bar */}
      <div className="md:hidden flex overflow-x-auto gap-3 px-3 py-2 bg-dark-surface/90 backdrop-blur-sm border-b border-dark-border scrollbar-none z-20 select-none">
        {[...LEFT_DESKTOP_ICONS, ...RIGHT_DESKTOP_ICONS].map((icon) => (
          <button
            key={icon.id}
            onClick={() => handleIconClick(icon.id, icon.action, icon.tabId, icon.link)}
            className="flex flex-col items-center justify-center gap-1 shrink-0 px-2 py-1 text-dark-text-muted hover:text-dark-text active:text-amber-button transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              {renderDesktopIcon(icon.icon, "w-6 h-6")}
            </div>
            <span className="text-[9px] font-bold text-center tracking-tight leading-tight whitespace-nowrap">
              {icon.label.split("\n")[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Main document window wrapper (preserves coordinates when minimized) */}
      {windowOpen && (
        <div style={{ display: isMinimized ? "none" : "block" }} key={`refresh-${refreshKey}`}>
          <DesktopWindow
            title={TAB_LABELS[activeTab] || "document"}
            onClose={() => {
              setWindowOpen(false);
              playRetroSound("close");
            }}
            isMaximized={isMaximized}
            onToggleMaximize={() => {
              playRetroSound(!isMaximized ? "maximize" : "minimize");
              setIsMaximized(!isMaximized);
            }}
            onMinimize={() => {
              playRetroSound("minimize");
              setIsMinimized(true);
            }}
            onRefresh={handleRefresh}
            onSearch={() => {
              window.dispatchEvent(new CustomEvent("zenith_open_search"));
            }}
            onToggleSettings={() => {
              const nextSound = !soundEnabled;
              setSoundEnabled(nextSound);
              setSoundEnabledState(nextSound);
              addToast(`Retro Sounds: ${nextSound ? "ON" : "OFF"}`);
            }}
          >
            {/* Window content */}
            <div className="bg-dark-surface min-h-full">
              {/* Hero header */}
              <div className="px-6 md:px-10 pt-8 pb-6 border-b border-dark-border-subtle">
                <div className="flex items-center gap-3 mb-4">
                  <ZenithLogo />
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
                    href={STORE_URL}
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

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-dark-text-muted select-none">
                  <a
                    href="https://github.com/roshhellwett"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="posthog-link flex items-center gap-1 hover:text-amber-button shrink-0"
                  >
                    <span className="text-accent-teal">◆</span> GitHub
                  </a>
                  <span className="text-dark-border hidden sm:inline">•</span>
                  <span
                    className="posthog-link cursor-pointer hover:text-amber-button shrink-0"
                    onClick={onSwitchToWebsite}
                  >
                    ▶ Website mode
                  </span>
                  <span className="text-dark-border hidden sm:inline">•</span>
                  <span
                    className="posthog-link cursor-pointer hover:text-amber-button shrink-0"
                    onClick={() => {
                      setActiveTab("founder");
                      addToast("Opening founder.md...");
                    }}
                  >
                    💬 Talk to founder
                  </span>
                </div>
              </div>

              {/* Tab navigation inside window */}
              <div className="flex overflow-x-auto border-b border-dark-border bg-dark-surface/50 select-none">
                {[
                  { id: "home", label: "Understand projects" },
                  { id: "registry", label: "Project registry" },
                  { id: "telemetry", label: "Debug & audit" },
                  { id: "stack", label: "Tech stack" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-5 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                      activeTab === tab.id
                        ? "text-dark-text border-amber-button bg-dark-surface/60 font-bold"
                        : "text-dark-text-muted border-transparent hover:text-dark-text hover:bg-dark-surface/20"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content apps */}
              <div className="p-6 md:p-8 min-h-[300px]">
                {activeTab === "home" && <HomeApp />}
                {activeTab === "registry" && <RegistryApp playRetroSound={playRetroSound} />}
                {activeTab === "telemetry" && <TelemetryApp playRetroSound={playRetroSound} addToast={addToast} />}
                {activeTab === "stack" && <StackApp playRetroSound={playRetroSound} addToast={addToast} />}
                {activeTab === "founder" && <FounderApp />}
                {activeTab === "ask-ai" && <MascotApp playRetroSound={playRetroSound} />}
              </div>
            </div>
          </DesktopWindow>
        </div>
      )}

      {/* Chat Panel (fixed/responsive bottom-right overlay) */}
      {chatOpen && (
        <div className="fixed sm:absolute bottom-10 sm:bottom-14 right-0 sm:right-4 w-full sm:w-auto z-50">
          <ChatPanel onClose={() => setChatOpen(false)} />
        </div>
      )}

      {/* Chat toggle button when closed */}
      {!chatOpen && (
        <button
          onClick={() => {
            setChatOpen(true);
            playRetroSound("click");
          }}
          className="fixed bottom-14 right-4 z-50 w-12 h-12 bg-dark-surface border border-dark-border rounded-full flex items-center justify-center shadow-xl hover:bg-dark-elevated hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Open AI Assistant"
          aria-label="Open AI Assistant"
        >
          <svg className="w-5 h-5 text-dark-text animate-bounce" style={{ animationDuration: "3s" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Bottom Taskbar/Dock */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-dark-surface/90 border-t border-dark-border backdrop-blur-md z-30 px-4 flex items-center justify-between select-none">
        {/* Left status info */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" role="status" aria-label="System online" />
          <span className="text-[9px] font-extrabold tracking-wider uppercase text-dark-text-muted">
            zenith_os
          </span>
        </div>

        {/* Center application taskbar */}
        <div className="flex items-center gap-1">
          {[
            { id: "home", label: "home.md", icon: "file-text" },
            { id: "registry", label: "projects.exe", icon: "folder-project" },
            { id: "telemetry", label: "telemetry.log", icon: "changelog" },
            { id: "stack", label: "stack.sys", icon: "stack" },
            { id: "founder", label: "founder.md", icon: "signup" },
          ].map((app) => {
            const isRunning = activeTab === app.id && windowOpen && !isMinimized;
            return (
              <button
                key={app.id}
                onClick={() => handleTaskbarClick(app.id, isRunning)}
                className={`h-7 px-2.5 rounded flex items-center gap-1.5 text-[10px] font-bold transition-all border cursor-pointer ${
                  isRunning
                    ? "bg-amber-button/15 border-amber-button/40 text-dark-text shadow-sm scale-95"
                    : "bg-transparent border-transparent hover:bg-dark-border/20 text-dark-text-muted hover:text-dark-text"
                }`}
              >
                <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  {renderDesktopIcon(app.icon, "w-3.5 h-3.5")}
                </span>
                <span className="hidden sm:inline">{app.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right time info */}
        <div className="flex items-center gap-3 text-[10px] font-extrabold text-dark-text-muted font-mono">
          <ClockWidget />
        </div>
      </div>
    </div>
  );
}
