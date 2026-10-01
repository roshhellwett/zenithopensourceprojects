"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import DesktopIcon, { renderDesktopIcon } from "./DesktopIcon";
import DesktopWindow from "./DesktopWindow";
import { STORE_URL } from "@/lib/site";
import { LEFT_DESKTOP_ICONS, RIGHT_DESKTOP_ICONS } from "@/data/desktop-icons";
import { playRetroSound, getSoundEnabled, setSoundEnabled } from "@/lib/audio";
import { unlockBodyScroll } from "@/lib/scroll-lock";

import { ZenithLogo } from "@/components/ZenithLogo";

const HomeApp = dynamic(() => import("@/components/apps/HomeApp"), { ssr: false });
const RegistryApp = dynamic(() => import("@/components/apps/RegistryApp"), { ssr: false });
const TelemetryApp = dynamic(() => import("@/components/apps/TelemetryApp"), { ssr: false });
const StackApp = dynamic(() => import("@/components/apps/StackApp"), { ssr: false });
const FounderApp = dynamic(() => import("@/components/apps/FounderApp"), { ssr: false });
const MascotApp = dynamic(() => import("@/components/apps/MascotApp"), { ssr: false });
const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });

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
  const [chatOpen, setChatOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeEasterEgg, setActiveEasterEgg] = useState<string | null>(null);

  // Startup animation boot sequence
  const [isBooting, setIsBooting] = useState(() => {
    try { return !sessionStorage.getItem("zenith_booted"); } catch { return true; }
  });
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

  const skipBoot = useCallback(() => {
    setIsBooting(false);
    try { sessionStorage.setItem("zenith_booted", "true"); } catch {}
    unlockBodyScroll(true);
    addToast("Zenith Workspace active.");
  }, [addToast]);

  useEffect(() => {
    if (!isBooting) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipBoot();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isBooting, skipBoot]);

  // playRetroSound is imported from @/lib/audio

  // Boot loader execution
  const bootTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bootInitialRef = useRef(isBooting);
  useEffect(() => {
    if (bootInitialRef.current === false) return;

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

    // Respect reduced-motion preferences by handing off immediately while
    // still exposing the complete boot transcript to assistive technology.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const handoff = setTimeout(() => {
        setBootLog(lines);
        setIsBooting(false);
        try { sessionStorage.setItem("zenith_booted", "true"); } catch { /* storage can be unavailable */ }
      }, 0);
      return () => clearTimeout(handoff);
    }

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
  const isBootingRef = useRef(isBooting);

  useEffect(() => { windowOpenRef.current = windowOpen; }, [windowOpen]);
  useEffect(() => { isMinimizedRef.current = isMinimized; }, [isMinimized]);
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

  useEffect(() => {
    return () => {
      unlockBodyScroll(true);
      document.body.style.overflow = "";
      document.body.classList.remove("scroll-locked");
    };
  }, []);

  if (isBooting) {
    return (
      <div className="zenith-boot fixed inset-0 bg-[#191b22] text-amber-button font-mono p-3 sm:p-6 flex flex-col justify-between z-[9999]" role="status" aria-live="polite" aria-label="Zenith system booting">
        <div className="zenith-boot-grid" aria-hidden="true" />
        <div className="relative flex items-center justify-between gap-4 mb-8 max-w-3xl w-full mx-auto">
          <div className="flex items-center gap-3">
            <ZenithLogo className="w-10 h-10 sm:w-12 sm:h-12" />
            <div><p className="text-sm sm:text-base font-bold tracking-[0.22em] text-dark-text">ZENITH</p><p className="text-[9px] text-dark-text-faint tracking-[0.18em]">CIVIC SYSTEMS OBSERVATORY</p></div>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="skip-boot-btn"
              onClick={skipBoot}
              className="text-[10px] font-mono text-amber-button hover:text-white bg-amber-button/10 hover:bg-amber-button/30 border border-amber-button/40 px-2.5 py-1 rounded transition-all cursor-pointer"
            >
              Skip [ESC]
            </button>
            <span className="hidden sm:block text-[9px] tracking-[0.18em] text-accent-teal">LINK / SECURE</span>
          </div>
        </div>
        <div className="relative space-y-1 text-[10px] sm:text-xs select-none max-w-3xl w-full mx-auto flex-1 overflow-y-auto pr-2">
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
          <p className="animate-pulse text-accent-teal">▊</p>
          <div className="mt-5 h-1 bg-dark-border/20 max-w-sm overflow-hidden"><div className="zenith-boot-progress h-full bg-amber-button" /></div>
          <p className="mt-2 text-[9px] tracking-widest text-dark-text-faint">ESTABLISHING OBSERVATORY HANDOFF · {Math.min(100, Math.round((bootLog.length / 9) * 100))}%</p>
        </div>
        <div className="relative flex flex-wrap items-center justify-between gap-1 text-[9px] sm:text-[10px] text-dark-text-faint border-t border-dark-border/20 pt-4 shrink-0 max-w-3xl w-full mx-auto">
          <span>ZENITH SYSTEM RUNTIME</span>
          <span>India verified © {new Date().getFullYear()}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="desktop-os relative h-[calc(100vh-var(--navbar-height))] h-[calc(100dvh-var(--navbar-height))] overflow-hidden"
      onContextMenu={handleContextMenu}
    >
      {/* Layered observatory atmosphere: decorative only, never intercepts input. */}
      <div className="desktop-atmosphere" aria-hidden="true">
        <div className="desktop-atmosphere-grid" />
        <div className="desktop-orbit desktop-orbit-one" />
        <div className="desktop-orbit desktop-orbit-two" />
        <span className="desktop-signal desktop-signal-one" />
        <span className="desktop-signal desktop-signal-two" />
      </div>
      {/* Toast notifications */}
      <div className="fixed bottom-[calc(var(--taskbar-height)+8px)] left-2 right-2 sm:left-4 sm:right-auto z-[60] flex flex-col gap-2 max-w-[calc(100vw-1rem)] sm:max-w-sm" role="status" aria-live="polite" aria-label="Notifications">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-dark-surface/90 border border-dark-border px-3 py-2 sm:py-2.5 rounded-lg shadow-xl text-[11px] sm:text-xs text-dark-text font-medium flex items-center gap-2 animate-fade-in-up backdrop-blur-sm relative overflow-hidden w-full sm:w-auto"
          >
            <span className="w-2 h-2 bg-amber-button rounded-full animate-pulse shrink-0 hidden sm:block" />
            <span className="leading-tight flex-1 min-w-0">{t.message}</span>
            <div className="absolute bottom-0 left-0 h-0.5 bg-amber-button toast-progress-bar" />
          </div>
        ))}
      </div>

      {/* Right-click Context Menu */}
      {contextMenu.visible && (
        <div
          role="menu"
          className="fixed bg-dark-elevated border border-dark-border rounded-lg shadow-2xl py-1 z-50 min-w-44 max-w-[calc(100vw-16px)] select-none animate-scale-in"
          style={{ top: Math.min(contextMenu.y, Math.max(0, window.innerHeight - 340)), left: Math.min(Math.max(8, contextMenu.x), window.innerWidth - 200) }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            role="menuitem"
            onClick={handleContextOpenHome}
            className="w-full text-left px-3 py-2 sm:py-1.5 text-xs text-dark-text hover:bg-dark-surface cursor-pointer flex items-center gap-2 min-h-[44px] sm:min-h-0"
          >
            📂 Open home.md
          </button>
          <button
            role="menuitem"
            onClick={handleContextOpenAssistant}
            className="w-full text-left px-3 py-2 sm:py-1.5 text-xs text-dark-text hover:bg-dark-surface cursor-pointer flex items-center gap-2 min-h-[44px] sm:min-h-0"
          >
            💬 Open AI Assistant
          </button>
          <button
            role="menuitem"
            onClick={handleContextToggleSound}
            className="w-full text-left px-3 py-2 sm:py-1.5 text-xs text-dark-text hover:bg-dark-surface cursor-pointer flex items-center gap-2 min-h-[44px] sm:min-h-0"
          >
            🔊 {soundEnabled ? "Mute retro sounds" : "Enable retro sounds"}
          </button>
          <div className="h-px bg-dark-border-subtle my-1" />
          <button
            role="menuitem"
            onClick={handleContextGoToWebsite}
            className="w-full text-left px-3 py-2 sm:py-1.5 text-xs text-dark-text hover:bg-dark-surface cursor-pointer flex items-center gap-2 min-h-[44px] sm:min-h-0"
          >
            🌐 Go to Website Mode
          </button>
        </div>
      )}

      {/* Left desktop icons (staggered animated) */}
      <div className="absolute left-3 top-4 z-20 hidden md:flex flex-col gap-1">
        {LEFT_DESKTOP_ICONS.map((icon, idx) => (
          <div key={icon.id} className="animate-icon-stagger" style={{ animationDelay: `${idx * 0.04}s` }}>
            <DesktopIcon
              label={icon.label}
              iconKey={icon.icon}
              onClick={() => handleIconClick(icon.id, icon.action, icon.tabId, icon.link)}
            />
          </div>
        ))}
      </div>

      {/* Right floating toolbar docklet (preserves full diorama visibility!) */}
      <div className="absolute right-4 top-3 z-20 hidden xl:flex items-center gap-1 bg-dark-surface/85 backdrop-blur-md border border-dark-border/80 rounded-xl px-2 py-1 shadow-lg">
        {RIGHT_DESKTOP_ICONS.map((icon) => (
          <button
            key={icon.id}
            onClick={() => handleIconClick(icon.id, icon.action, icon.tabId, icon.link)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-dark-text-muted hover:text-dark-text hover:bg-dark-elevated transition-all cursor-pointer group text-[11px] font-bold"
            title={icon.label.replace("\n", " ")}
          >
            <span className="w-4 h-4 flex items-center justify-center shrink-0 drop-shadow-sm group-hover:scale-110 transition-transform">
              {renderDesktopIcon(icon.icon, "w-4 h-4")}
            </span>
            <span>{icon.label.split("\n")[0]}</span>
          </button>
        ))}
      </div>

      {/* ── Interactive Diorama Easter Eggs (Responsive & Tactile) ── */}
      <div className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden z-10" aria-hidden="true">
        {/* Hotspot 1: Koi Pond (Bottom-Right) */}
        <div
          className="absolute right-[5%] bottom-[10%] w-[22%] h-[26%] pointer-events-auto diorama-hotspot group/pond flex items-center justify-center cursor-pointer"
          onClick={() => {
            playRetroSound("splash");
            addToast("Zenith Koi Pond: Pure deterministic streams, zero memory leaks! 🐟");
            setActiveEasterEgg("pond");
            setTimeout(() => setActiveEasterEgg(null), 4000);
          }}
          title="Click to interact with the Koi Pond"
        >
          {/* Subtle concentric water ripples */}
          <div className="w-12 h-12 rounded-full border-2 border-accent-teal/60 animate-pond-ripple pointer-events-none" />
          <div className="w-24 h-24 rounded-full border border-accent-teal/30 animate-pond-ripple [animation-delay:1.2s] pointer-events-none absolute" />
          
          {activeEasterEgg === "pond" ? (
            <div className="bg-dark-surface/95 border-2 border-accent-teal text-dark-text text-xs font-bold px-3 py-2 rounded-xl shadow-2xl animate-pop-in pointer-events-none absolute -top-12 z-30 whitespace-nowrap">
              🐟 &ldquo;Zero memory leaks in this stream!&rdquo;
            </div>
          ) : (
            <div className="opacity-0 group-hover/pond:opacity-100 transition-opacity bg-dark-surface/95 border border-accent-teal text-dark-text text-[10px] font-bold px-2 py-1 rounded shadow-lg absolute -top-8 pointer-events-none whitespace-nowrap">
              💧 Click to ripple pond
            </div>
          )}
        </div>

        {/* Hotspot 2: Watering Gardener (Center-Right Planter) */}
        <div
          className="absolute right-[16%] bottom-[31%] w-[14%] h-[16%] pointer-events-auto diorama-hotspot group/gardener flex items-center justify-center cursor-pointer"
          onClick={() => {
            playRetroSound("pop");
            addToast("Zen Gardener: Cultivating open-source civic tech seeds since 2024! 🌿");
            setActiveEasterEgg("gardener");
            setTimeout(() => setActiveEasterEgg(null), 4000);
          }}
          title="Click to greet the Zen Gardener"
        >
          {activeEasterEgg === "gardener" ? (
            <div className="bg-dark-surface/95 border-2 border-accent-teal text-dark-text text-xs font-bold px-3 py-2 rounded-xl shadow-2xl animate-pop-in pointer-events-none absolute -top-12 z-30 whitespace-nowrap">
              🌱 &ldquo;Nurturing open source civic tech!&rdquo;
            </div>
          ) : (
            <div className="opacity-0 group-hover/gardener:opacity-100 transition-opacity bg-dark-surface/95 border border-accent-teal text-dark-text text-[10px] font-bold px-2 py-1 rounded shadow-lg absolute -top-8 pointer-events-none whitespace-nowrap">
              🌱 Greet Gardener
            </div>
          )}
        </div>

        {/* Hotspot 3: Shears Gardener (Bottom-Left of Diorama) */}
        <div
          className="absolute right-[35%] bottom-[19%] w-[13%] h-[16%] pointer-events-auto diorama-hotspot group/shears flex items-center justify-center cursor-pointer"
          onClick={() => {
            playRetroSound("click");
            addToast("Hedge Trimmer: Pruning away proprietary bloat & vendor lock-in! ✂️");
            setActiveEasterEgg("shears");
            setTimeout(() => setActiveEasterEgg(null), 4000);
          }}
          title="Click to talk to the Hedge Trimmer"
        >
          {activeEasterEgg === "shears" ? (
            <div className="bg-dark-surface/95 border-2 border-amber-button text-dark-text text-xs font-bold px-3 py-2 rounded-xl shadow-2xl animate-pop-in pointer-events-none absolute -top-12 z-30 whitespace-nowrap">
              ✂️ &ldquo;Pruning closed-source lock-in!&rdquo;
            </div>
          ) : (
            <div className="opacity-0 group-hover/shears:opacity-100 transition-opacity bg-dark-surface/95 border border-amber-button text-dark-text text-[10px] font-bold px-2 py-1 rounded shadow-lg absolute -top-8 pointer-events-none whitespace-nowrap">
              ✂️ Talk to Trimmer
            </div>
          )}
        </div>

        {/* Hotspot 4: ZENITH Monolith Stone (Top-Right) */}
        <div
          className="absolute right-[12%] top-[20%] w-[25%] h-[24%] pointer-events-auto diorama-hotspot group/monolith flex items-center justify-center cursor-pointer"
          onClick={() => {
            playRetroSound("chime");
            addToast("ZENITH Monolith: Verified public foundation for civic systems! 🏛️");
            setActiveEasterEgg("monolith");
            setTimeout(() => setActiveEasterEgg(null), 4000);
          }}
          title="Click to resonate the Zenith Monolith"
        >
          {activeEasterEgg === "monolith" ? (
            <div className="bg-dark-surface/95 border-2 border-amber-button text-dark-text text-xs font-bold px-3 py-2 rounded-xl shadow-2xl animate-pop-in pointer-events-none absolute -top-12 z-30 whitespace-nowrap">
              🏛️ &ldquo;Rock-solid civic tech foundation!&rdquo;
            </div>
          ) : (
            <div className="opacity-0 group-hover/monolith:opacity-100 transition-opacity bg-dark-surface/95 border border-amber-button text-dark-text text-[10px] font-bold px-2.5 py-1 rounded shadow-lg absolute -top-8 pointer-events-none whitespace-nowrap">
              ✨ Resonate Monolith
            </div>
          )}
        </div>
      </div>

      {/* Mobile top navigation scroll bar */}
      <div className="md:hidden flex overflow-x-auto gap-2 px-2 py-2 bg-dark-surface/90 backdrop-blur-sm border-b border-dark-border scrollbar-none z-20 select-none overscroll-contain snap-x snap-mandatory safe-area-px">
        {[...LEFT_DESKTOP_ICONS, ...RIGHT_DESKTOP_ICONS].map((icon) => (
          <button
            key={icon.id}
            onClick={() => handleIconClick(icon.id, icon.action, icon.tabId, icon.link)}
            className="flex flex-col items-center justify-center gap-1 shrink-0 px-2.5 py-1.5 text-dark-text-muted hover:text-dark-text active:text-amber-button transition-colors cursor-pointer snap-start min-w-[56px]"
          >
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              {renderDesktopIcon(icon.icon, "w-7 h-7")}
            </div>
            <span className="text-[9px] font-bold text-center tracking-tight leading-tight whitespace-nowrap truncate max-w-[56px]">
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
              <div className="px-3 sm:px-6 md:px-10 pt-4 sm:pt-8 pb-3 sm:pb-6 border-b border-dark-border-subtle">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                  <ZenithLogo />
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-dark-text">Zenith</span>
                </div>

                <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-dark-text mb-2 sm:mb-4">
                  The open source way to build civic tech
                </h1>

                <p className="text-xs sm:text-sm text-dark-text-muted leading-relaxed max-w-[600px] mb-3 sm:mb-6">
                  Zenith is the unified registry for civic-tech platforms, systems utilities, and developer tools. Built in India, MIT-licensed, always free.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <a
                    href={STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-button hover:bg-saffron-deep text-black px-4 py-2.5 sm:py-2 rounded-md text-xs font-bold transition-all active:scale-95 border border-amber-shadow text-center min-h-[44px] sm:min-h-0 flex items-center justify-center"
                  >
                    Get started - free
                  </a>
                  <a
                    href="https://github.com/roshhellwett"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-dark-border hover:border-dark-text-muted text-dark-text px-4 py-2.5 sm:py-2 rounded-md text-xs font-bold transition-all hover:bg-dark-surface text-center min-h-[44px] sm:min-h-0 flex items-center justify-center"
                  >
                    View Source
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-2 text-[11px] sm:text-xs text-dark-text-muted select-none">
                  <a
                    href="https://github.com/roshhellwett"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="posthog-link flex items-center gap-1 hover:text-amber-button shrink-0"
                  >
                    <span className="text-accent-teal">◆</span> GitHub
                  </a>
                  <span className="text-dark-border hidden sm:inline">•</span>
                  <button
                    type="button"
                    className="posthog-link cursor-pointer hover:text-amber-button shrink-0 bg-transparent border-none p-0 font-inherit text-inherit whitespace-nowrap"
                    onClick={onSwitchToWebsite}
                  >
                    ▶ Website mode
                  </button>
                  <span className="text-dark-border hidden sm:inline">•</span>
                  <button
                    type="button"
                    className="posthog-link cursor-pointer hover:text-amber-button shrink-0 bg-transparent border-none p-0 font-inherit text-inherit whitespace-nowrap"
                    onClick={() => {
                      setActiveTab("founder");
                      addToast("Opening founder.md...");
                    }}
                  >
                    💬 Talk to founder
                  </button>
                </div>
              </div>

              {/* Tab navigation inside window */}
              <div className="flex overflow-x-auto border-b border-dark-border bg-dark-surface/50 select-none scrollbar-none snap-x-mandatory" role="tablist">
                {[
                  { id: "home", label: "Understand projects" },
                  { id: "registry", label: "Project registry" },
                  { id: "telemetry", label: "Debug & audit" },
                  { id: "stack", label: "Tech stack" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-2.5 sm:px-5 py-3 text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer snap-start min-h-[44px] ${
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
              <div className="p-3 sm:p-6 md:p-8 min-h-[200px] sm:min-h-[300px] flex flex-col">
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

      {/* Chat Panel (self-positioned responsive overlay with expand support) */}
      {chatOpen && (
        <ChatPanel onClose={() => setChatOpen(false)} />
      )}

      {/* Floating Copilot pill when closed (inviting, unobtrusive, glorious) */}
      {!chatOpen && (
        <button
          id="zenith-copilot-trigger"
          onClick={() => {
            setChatOpen(true);
            playRetroSound("click");
          }}
          className="fixed bottom-[calc(var(--taskbar-height)+10px)] right-3 sm:right-6 z-40 flex items-center gap-2 px-3.5 py-2 bg-dark-surface/90 hover:bg-dark-elevated border border-amber-button/50 rounded-full shadow-[0_8px_24px_rgba(241,168,44,0.18)] hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md group"
          title="Open Zenith AI Copilot"
          aria-label="Open Zenith AI Copilot"
        >
          <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse shrink-0" />
          <span className="text-xs font-bold text-dark-text tracking-tight flex items-center gap-1.5">
            <span>✨ Zenith AI Copilot</span>
          </span>
          <kbd className="hidden sm:inline-block font-mono text-[9px] text-dark-text-faint bg-dark-bg px-1.5 py-0.5 rounded border border-dark-border-subtle">
            Ask
          </kbd>
        </button>
      )}

      {/* Bottom Taskbar/Dock (Frosted Glass Acrylic with Sound Equalizer) */}
      <div className="desktop-taskbar glass-dock absolute bottom-0 left-0 right-0 h-[var(--taskbar-height)] border-t border-dark-border/80 z-30 px-1 sm:px-4 flex items-center justify-between select-none overflow-x-auto scrollbar-none">
        {/* Left status info */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse shrink-0" role="status" aria-label="System online" />
          <span className="text-[9px] font-extrabold tracking-wider uppercase text-dark-text-muted hidden xs:inline">
            zenith_os
          </span>
          <span className="hidden lg:inline text-[8px] font-mono text-dark-text-faint bg-dark-surface/80 px-1.5 py-0.5 rounded border border-dark-border-subtle">
            v1.0.4 • BHARAT
          </span>
        </div>

        {/* Center application taskbar */}
        <div className="flex items-center gap-0.5 sm:gap-1 flex-1 justify-center overflow-x-auto scrollbar-none px-1">
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
                id={`taskbar-${app.id}`}
                onClick={() => handleTaskbarClick(app.id, isRunning)}
                className={`h-8 sm:h-7 px-1.5 sm:px-2.5 rounded flex items-center gap-1 sm:gap-1.5 text-[10px] font-bold transition-all border cursor-pointer shrink-0 ${
                  isRunning
                    ? "bg-amber-button/15 border-amber-button/40 text-dark-text shadow-sm scale-95"
                    : "bg-transparent border-transparent hover:bg-dark-border/20 text-dark-text-muted hover:text-dark-text"
                }`}
              >
                <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                  {renderDesktopIcon(app.icon, "w-3.5 h-3.5")}
                </span>
                <span className="hidden sm:inline">{app.label}</span>
                {isRunning && <span className="w-1 h-1 rounded-full bg-amber-button ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Right time & system tray info */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-[9px] sm:text-[10px] font-extrabold text-dark-text-muted font-mono shrink-0">
          {/* Sound Toggle Button with animated equalizer waves */}
          <button
            onClick={() => {
              const nextSound = !soundEnabled;
              setSoundEnabled(nextSound);
              setSoundEnabledState(nextSound);
              if (nextSound) playRetroSound("success");
              addToast(`Retro Audio: ${nextSound ? "ON" : "OFF"}`);
            }}
            className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors cursor-pointer border ${
              soundEnabled
                ? "bg-amber-button/10 border-amber-button/30 text-amber-button"
                : "bg-transparent border-transparent hover:bg-dark-border/20 text-dark-text-faint"
            }`}
            title={soundEnabled ? "Mute retro sound effects" : "Enable retro sound effects"}
          >
            {soundEnabled ? (
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-0.5 bg-amber-button rounded-full wave-bar-1" />
                <span className="w-0.5 bg-amber-button rounded-full wave-bar-2" />
                <span className="w-0.5 bg-amber-button rounded-full wave-bar-3" />
                <span className="w-0.5 bg-amber-button rounded-full wave-bar-4" />
              </div>
            ) : (
              <span className="text-[10px]">🔇</span>
            )}
            <span className="hidden md:inline text-[9px] uppercase tracking-wider">{soundEnabled ? "SFX" : "MUTED"}</span>
          </button>

          {/* Quick Search */}
          <button
            onClick={() => {
              playRetroSound("click");
              window.dispatchEvent(new CustomEvent("zenith_open_search"));
            }}
            className="hidden sm:flex items-center gap-1 px-1.5 py-1 rounded bg-transparent hover:bg-dark-border/20 text-dark-text-muted hover:text-dark-text cursor-pointer transition-colors"
            title="Search projects (Ctrl+K)"
          >
            <span>🔍</span>
            <span className="text-[9px]">Ctrl+K</span>
          </button>

          {/* Clock */}
          <div className="px-2 py-1 rounded bg-dark-bg/60 border border-dark-border-subtle">
            <ClockWidget />
          </div>

          {/* Show / Hide Desktop Peek Button */}
          <button
            onClick={() => {
              playRetroSound("minimize");
              setIsMinimized(!isMinimized);
            }}
            className="w-2.5 sm:w-3 h-6 border-l border-dark-border hover:bg-amber-button/20 transition-colors cursor-pointer"
            title="Toggle show desktop"
            aria-label="Show Desktop"
          />
        </div>
      </div>
    </div>
  );
}
