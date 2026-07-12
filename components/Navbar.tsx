"use client";

import React, { useState, useEffect, useRef } from "react";
import { NAV_ITEMS } from "@/data/nav";
import { Search, ChevronDown, Github, Globe, Laptop } from "lucide-react";
import { STORE_URL } from "@/lib/site";
import { ZenithLogo } from "@/components/ZenithLogo";
import { renderDesktopIcon } from "@/components/DesktopIcon";
import dynamic from "next/dynamic";

const SearchModal = dynamic(() => import("@/components/SearchModal"), { ssr: false });
import Link from "next/link";
import { playRetroSound } from "@/lib/audio";

/** Detect macOS platform for keyboard shortcut rendering (client-only) */
function getIsMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}

interface NavbarProps {
  onToggleMode?: () => void;
  currentMode?: "desktop" | "website";
}

export default function Navbar({ onToggleMode, currentMode }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isMac = getIsMac();

  const getActiveEl = (): HTMLElement | null =>
    document.activeElement instanceof HTMLElement ? document.activeElement : null;

  // Active section observer for smooth website navigation highlighting
  useEffect(() => {
    if (currentMode !== "website") {
      const timer = setTimeout(() => setActiveSection(""), 0);
      return () => clearTimeout(timer);
    }
    
    let observers: { observer: IntersectionObserver; el: HTMLElement }[] = [];
    let intervalId: ReturnType<typeof setInterval>;

    const initObservers = () => {
      const sections = ["projects", "stack", "founder"];
      const allExist = sections.every(id => document.getElementById(id) !== null);
      
      if (!allExist) return false;
      
      observers = sections.map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id);
              }
            });
          },
          { threshold: 0.3 }
        );
        observer.observe(el);
        return { observer, el };
      }).filter(Boolean) as { observer: IntersectionObserver; el: HTMLElement }[];
      
      return true;
    };

    if (!initObservers()) {
      intervalId = setInterval(() => {
        if (initObservers()) clearInterval(intervalId);
      }, 250);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      observers.forEach((obs) => {
        obs.observer.unobserve(obs.el);
      });
    };
  }, [currentMode]);

  // Global search keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => {
          if (!prev) previousFocusRef.current = getActiveEl();
          return !prev;
        });
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Listen for custom open-search event (from desktop window toolbar)
  useEffect(() => {
    const handleOpenSearch = () => {
      previousFocusRef.current = getActiveEl();
      setSearchOpen(true);
    };
    window.addEventListener("zenith_open_search", handleOpenSearch);
    return () => window.removeEventListener("zenith_open_search", handleOpenSearch);
  }, []);

  // Escape key to close mobile menu & scroll lock management
  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("scroll-locked");
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMobileOpen(false);
          menuButtonRef.current?.focus();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.classList.remove("scroll-locked");
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [mobileOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!mobileOpen || !menuRef.current) return;
    const focusableElements = menuRef.current.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;
    const firstCandidate = focusableElements[0];
    const lastCandidate = focusableElements[focusableElements.length - 1];
    if (!(firstCandidate instanceof HTMLElement) || !(lastCandidate instanceof HTMLElement)) return;
    const firstEl: HTMLElement = firstCandidate;
    const lastEl: HTMLElement = lastCandidate;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    };

    firstEl.focus();
    window.addEventListener("keydown", handleTab);
    return () => {
      window.removeEventListener("keydown", handleTab);
    };
  }, [mobileOpen]);

  // Smooth scroll handler for anchor links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    playRetroSound("click");
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      
      const doScroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      };

      if (currentMode === "desktop" && onToggleMode) {
        onToggleMode();
        setTimeout(doScroll, 100);
      } else {
        doScroll();
      }
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-dark-surface/95 border-b border-dark-border backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 h-12 flex items-center justify-between safe-area-px">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-6 min-w-0 flex-1 overflow-hidden">
            {/* Logo */}
            <Link href="/" onClick={() => playRetroSound("click")} className="flex items-center gap-1.5 sm:gap-2 shrink-0 group">
                <ZenithLogo animate={false} />
              <span className="font-extrabold text-[15px] tracking-tight text-dark-text hidden sm:inline">
                Zenith
              </span>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="relative navbar-item group">
                  <button type="button" onClick={() => playRetroSound("click")} className="flex items-center gap-1 px-2 xl:px-3 py-1.5 text-[13px] font-medium text-dark-text-muted hover:text-dark-text transition-colors rounded-md hover:bg-dark-surface cursor-pointer min-h-[36px] whitespace-nowrap">
                    {item.label}
                    {item.children && <ChevronDown className="w-3 h-3 opacity-50 shrink-0" />}
                  </button>

                  {/* Dropdown */}
                  {item.children && (
                    <div className="navbar-dropdown absolute top-full left-0 mt-1 w-56 xl:w-72 bg-dark-elevated border border-dark-border rounded-lg shadow-2xl p-2 z-50 transition-all duration-200">
                      {item.children.map((child) => {
                        const isHighlighted =
                          child.href.startsWith("#") &&
                          activeSection === child.href.substring(1);
                        return (
                          <a
                            key={child.label}
                            href={child.href}
                            target={child.href?.startsWith("http") ? "_blank" : undefined}
                            rel={child.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                            onClick={(e) => handleNavClick(e, child.href)}
                            className={`flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-dark-elevated/50 transition-colors group/item ${
                              isHighlighted ? "bg-amber-button/10 border-l-2 border-amber-button" : ""
                            }`}
                          >
                            <span className="mt-0.5 shrink-0 w-6 h-6 flex items-center justify-center">
                              {child.icon ? renderDesktopIcon(child.icon, "w-6 h-6") : null}
                            </span>
                            <div className="min-w-0">
                              <div className={`text-sm font-semibold transition-colors truncate ${
                                isHighlighted ? "text-amber-button" : "text-dark-text group-hover/item:text-amber-button"
                              }`}>
                                {child.label}
                                {child.badge && (
                                  <span className="ml-2 text-[9px] font-bold bg-accent-teal/20 text-accent-teal px-1.5 py-0.5 rounded uppercase">
                                    {child.badge}
                                  </span>
                                )}
                              </div>
                              {child.desc && (
                                <div className="text-xs text-dark-text-muted mt-0.5 truncate">{child.desc}</div>
                              )}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 shrink-0">
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playRetroSound("click")}
              className="hidden sm:flex items-center gap-1.5 bg-amber-button hover:bg-saffron-deep text-black px-2.5 md:px-4 py-1.5 rounded-md text-[11px] md:text-xs font-bold transition-all active:scale-95 border border-amber-shadow whitespace-nowrap"
            >
              Get started – free
            </a>

            {/* Global Search Button */}
            <button
              onClick={() => {
                playRetroSound("click");
        previousFocusRef.current = getActiveEl();
        setSearchOpen(true);
      }}
      className="p-2 sm:p-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-surface rounded-md transition-colors flex items-center gap-1 min-h-[44px] sm:min-h-[36px] min-w-[44px] sm:min-w-[36px]"
              title="Search (Cmd/Ctrl + K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <kbd className="hidden md:flex items-center gap-0.5 text-[9px] text-dark-text-faint bg-dark-bg border border-dark-border-subtle rounded px-1.5 py-0.5 font-mono">
                {isMac ? "⌘K" : "Ctrl K"}
              </kbd>
            </button>

            {/* Mode Switcher */}
            {onToggleMode && (
              <button
                type="button"
                onClick={() => {
                  playRetroSound("toggle");
                  onToggleMode();
                }}
                className="p-2 sm:p-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-surface rounded-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-semibold min-h-[44px] sm:min-h-[36px] min-w-[44px] sm:min-w-[36px]"
                title={`Switch to ${currentMode === "desktop" ? "Website" : "Desktop OS"} mode`}
                aria-label={`Switch to ${currentMode === "desktop" ? "Website" : "Desktop OS"} mode`}
              >
                {currentMode === "desktop" ? (
                  <>
                    <Globe className="w-4 h-4 text-accent-teal animate-pulse shrink-0" />
                    <span className="hidden md:inline">Website</span>
                  </>
                ) : (
                  <>
                    <Laptop className="w-4 h-4 text-amber-button shrink-0" />
                    <span className="hidden md:inline">Desktop OS</span>
                  </>
                )}
              </button>
            )}

            <a
              href="https://github.com/roshhellwett"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playRetroSound("click")}
              className="p-2 sm:p-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-surface rounded-md transition-colors min-h-[44px] sm:min-h-[36px] min-w-[44px] sm:min-w-[36px] flex items-center justify-center"
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* Mobile menu toggle */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => {
                playRetroSound("click");
                setMobileOpen(!mobileOpen);
              }}
              className="lg:hidden p-2.5 sm:p-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-surface rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-panel"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown & Backdrop */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="animate-backdrop-in fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              style={{ top: "var(--navbar-height)" }}
              onClick={() => { setMobileOpen(false); menuButtonRef.current?.focus(); }}
            />

            {/* Menu Panel */}
            <div
              ref={menuRef}
              id="mobile-menu-panel"
              className="mobile-menu-panel animate-expand-down lg:hidden absolute top-12 left-0 right-0 bg-dark-elevated border-b border-dark-border px-3 sm:px-4 py-3 space-y-2 max-h-[80vh] overflow-y-auto z-50 shadow-2xl safe-area-px overscroll-contain"
            >
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="space-y-0.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-dark-text-muted px-3 pt-2 pb-1 select-none">
                    {item.label}
                  </div>
                  {item.children?.map((child) => {
                    const isHighlighted =
                      child.href.startsWith("#") &&
                      activeSection === child.href.substring(1);
                    return (
                      <a
                        key={child.label}
                        href={child.href}
                        target={child.href?.startsWith("http") ? "_blank" : undefined}
                        rel={child.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                        onClick={(e) => handleNavClick(e, child.href)}
                        className={`flex items-center gap-2.5 px-3 py-3 sm:py-2 text-sm rounded-md transition-colors ${
                          isHighlighted
                            ? "bg-amber-button/10 text-amber-button font-semibold"
                            : "text-dark-text hover:bg-dark-surface"
                        }`}
                      >
                        <span className="shrink-0">{child.icon ? renderDesktopIcon(child.icon, "w-5 h-5 sm:w-4 sm:h-4") : null}</span>
                        <span className="truncate flex-1">{child.label}</span>
                        {child.desc && (
                          <span className="hidden xs:inline text-[10px] text-dark-text-faint truncate max-w-[100px]">{child.desc}</span>
                        )}
                      </a>
                    );
                  })}
                </div>
              ))}
              <div className="pt-3 pb-2 border-t border-dark-border-subtle">
                <a
                        href={STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playRetroSound("click")}
                  className="flex items-center justify-center gap-1.5 bg-amber-button hover:bg-saffron-deep text-black px-4 py-3 sm:py-2.5 rounded-md text-sm font-bold transition-all w-full shadow-md active:scale-95 min-h-[44px]"
                >
                  Get started – free
                </a>
              </div>
            </div>
          </>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          previousFocusRef.current?.focus();
          previousFocusRef.current = null;
        }}
        onSwitchMode={onToggleMode}
      />
    </>
  );
}
