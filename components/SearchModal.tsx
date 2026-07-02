"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, X, ArrowUpRight } from "lucide-react";
import { FEATURED_FALLBACK, FALLBACK_REPOS } from "@/data/repos";
import { NAV_ITEMS } from "@/data/nav";
import { STACK } from "@/data/stack";
import { playRetroSound } from "@/lib/audio";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/scroll-lock";

interface SearchResult {
  type: "project" | "nav" | "stack" | "action";
  title: string;
  description: string;
  href?: string;
  icon?: string;
  action?: () => void;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchMode?: () => void;
}

export default function SearchModal({ isOpen, onClose, onSwitchMode }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Build searchable index
  const allItems: SearchResult[] = useMemo(() => {
    const items: SearchResult[] = [];

    // Projects
    const allRepos = [FEATURED_FALLBACK, ...FALLBACK_REPOS];
    allRepos.forEach((repo) => {
      items.push({
        type: "project",
        title: repo.displayName,
        description: repo.desc,
        href: repo.link,
        icon: "📁",
      });
    });

    // Nav items
    NAV_ITEMS.forEach((group) => {
      group.children?.forEach((child) => {
        items.push({
          type: "nav",
          title: child.label,
          description: child.desc || group.label,
          href: child.href,
          icon: "🔗",
        });
      });
    });

    // Stack items
    STACK.forEach((group) => {
      items.push({
        type: "stack",
        title: group.category,
        description: group.items.join(", "),
        icon: "⚙️",
      });
    });

    // Quick actions
    if (onSwitchMode) {
      items.push({
        type: "action",
        title: "Switch Mode",
        description: "Toggle between Desktop OS and Website mode",
        icon: "🔄",
        action: () => { onSwitchMode?.(); onClose?.(); },
      });
    }

    return items;
  }, [onSwitchMode, onClose]);

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8);
    const q = query.toLowerCase();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [query, allItems]);

  // Reset on open + body scroll lock
  useEffect(() => {
    if (isOpen) {
      playRetroSound("beep");
      lockBodyScroll();
      const timer = setTimeout(() => {
        setQuery("");
        setSelectedIndex(0);
      }, 0);
      const focusTimer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => {
        unlockBodyScroll();
        clearTimeout(timer);
        clearTimeout(focusTimer);
      };
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    playRetroSound("close");
    onClose();
  }, [onClose]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        playRetroSound("click");
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        playRetroSound("click");
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        playRetroSound("success");
        const result = results[selectedIndex];
        if (result.action) {
          result.action();
        } else if (result.href) {
          if (result.href.startsWith("http")) {
            window.open(result.href, "_blank", "noopener,noreferrer");
          }
          handleClose();
        }
      } else if (e.key === "Escape") {
        handleClose();
      }
    },
    [results, selectedIndex, handleClose]
  );

  // Scroll selected into view
  useEffect(() => {
    const child = resultsRef.current?.children[selectedIndex];
    if (child instanceof HTMLElement) { child.scrollIntoView({ block: "nearest" }); }
  }, [selectedIndex]);

  // Reset selection on query change deleted and handled in onChange event handler

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark-text/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[560px] bg-dark-surface border border-dark-border rounded-xl shadow-2xl overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            const focusable = e.currentTarget.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-dark-border">
          <Search className="w-4 h-4 text-dark-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, stack, navigation..."
            className="flex-1 bg-transparent text-base sm:text-sm text-dark-text placeholder-dark-text-faint focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-dark-text-faint bg-dark-bg border border-dark-border-subtle rounded px-1.5 py-0.5 font-mono">
            ESC
          </kbd>
          <button
            onClick={handleClose}
            className="sm:hidden p-1 text-dark-text-muted hover:text-dark-text transition-colors"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div
          ref={resultsRef}
          className="max-h-[50vh] overflow-y-auto p-2"
          role="listbox"
        >
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-dark-text-muted">
              <p className="font-semibold mb-1">No results found</p>
              <p className="text-xs text-dark-text-faint">
                Try searching for &quot;Sentinel&quot;, &quot;TypeScript&quot;, or &quot;voting&quot;
              </p>
            </div>
          ) : (
            results.map((result, i) => (
              <button
                key={`${result.type}-${result.title}-${i}`}
                onClick={() => {
                  playRetroSound("success");
                  if (result.action) {
                    result.action();
                  } else if (result.href) {
                    if (result.href.startsWith("http")) {
                      window.open(result.href, "_blank", "noopener,noreferrer");
                    }
                    handleClose();
                  }
                }}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                  i === selectedIndex
                    ? "bg-amber-button/10 border border-amber-button/20"
                    : "hover:bg-dark-elevated border border-transparent"
                }`}
                role="option"
                aria-selected={i === selectedIndex}
              >
                <span className="text-base mt-0.5 shrink-0">{result.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-dark-text truncate">
                      {result.title}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-dark-text-faint bg-dark-bg px-1.5 py-0.5 rounded shrink-0">
                      {result.type}
                    </span>
                  </div>
                  <p className="text-xs text-dark-text-muted truncate mt-0.5">
                    {result.description}
                  </p>
                </div>
                {result.href?.startsWith("http") && (
                  <ArrowUpRight className="w-3.5 h-3.5 text-dark-text-faint shrink-0 mt-1" />
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-dark-border-subtle flex items-center justify-between text-[10px] text-dark-text-faint">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-dark-bg border border-dark-border-subtle rounded px-1 py-0.5 font-mono">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-dark-bg border border-dark-border-subtle rounded px-1 py-0.5 font-mono">↵</kbd>
              open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-dark-bg border border-dark-border-subtle rounded px-1 py-0.5 font-mono">esc</kbd>
              close
            </span>
          </div>
          <span className="font-semibold text-dark-text-muted">
            {results.length} results
          </span>
        </div>
      </div>
    </div>
  );
}
