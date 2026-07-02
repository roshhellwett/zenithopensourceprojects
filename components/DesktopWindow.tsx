"use client";

import React, { memo, useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface DesktopWindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onMinimize: () => void;
  showToolbar?: boolean;
  toolbarContent?: React.ReactNode;
  onRefresh?: () => void;
  onSearch?: () => void;
  onToggleSettings?: () => void;
}

export default memo(function DesktopWindow({
  title,
  children,
  onClose,
  isMaximized,
  onToggleMaximize,
  onMinimize,
  showToolbar = true,
  toolbarContent,
  onRefresh,
  onSearch,
  onToggleSettings,
}: DesktopWindowProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, top: 0 });

  // Check screen size to auto-maximize on mobile viewports
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const shouldMaximize = isMaximized || isMobile;

  const handleDragStart = (e: React.PointerEvent) => {
    if (shouldMaximize) return;
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      left: dragOffset.x,
      top: dragOffset.y,
    };
    if (e.target instanceof HTMLElement) { e.target.setPointerCapture(e.pointerId); }
  };

  const handleDragMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || shouldMaximize) return;
    setDragOffset({
      x: dragStart.current.left + (e.clientX - dragStart.current.x),
      y: dragStart.current.top + (e.clientY - dragStart.current.y),
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
  };

  return (
    <div
      className={`animate-window-fade-in flex flex-col window-chrome shadow-2xl border border-dark-border overflow-hidden bg-dark-surface ${
        shouldMaximize
          ? "fixed inset-x-0 top-[var(--navbar-height)] bottom-10 z-[60] rounded-none border-none"
          : "absolute w-[95vw] max-w-[880px] h-[85vh] max-h-[700px] top-[2vh] sm:top-[4vh] left-0 right-0 mx-auto z-40 rounded-xl"
      }`}
      style={!shouldMaximize ? { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`, transition: isDragging ? 'none' : 'transform 0.1s ease-out' } : undefined}
      role="dialog"
      aria-label={title}
    >
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Title bar */}
        <div
          className="bg-dark-elevated px-3 py-2 flex items-center justify-between border-b border-dark-border cursor-move select-none shrink-0"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onDoubleClick={onToggleMaximize}
        >
          {/* Traffic lights with touch-friendly hit areas */}
          <div
            className="flex items-center gap-0.5"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center hover:bg-dark-surface/10 rounded-full transition-colors focus:outline-none cursor-pointer"
              title="Close window"
              aria-label="Close window"
            >
              <span className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF3B30] border border-[#E04842]" />
            </button>
            <button
              onClick={onMinimize}
              className="w-6 h-6 flex items-center justify-center hover:bg-dark-surface/10 rounded-full transition-colors focus:outline-none cursor-pointer"
              title="Minimize window"
              aria-label="Minimize window"
            >
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#F5A623] border border-[#DFA023]" />
            </button>
            <button
              onClick={onToggleMaximize}
              className="w-6 h-6 flex items-center justify-center hover:bg-dark-surface/10 rounded-full transition-colors focus:outline-none cursor-pointer"
              title="Maximize window"
              aria-label="Maximize window"
            >
              <span className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#1DB954] border border-[#24A93B]" />
            </button>
          </div>

          {/* Center: file name with dropdown */}
          <div className="flex items-center gap-1.5 text-sm text-dark-text/70 font-medium select-none">
            <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="font-mono text-xs tracking-tight">{title}</span>
            <ChevronDown className="w-3 h-3 opacity-40" />
          </div>

          {/* Right spacer to balance traffic lights */}
          <div className="w-18" />
        </div>

        {/* Toolbar */}
        {showToolbar && (
          <div className="bg-dark-surface px-4 py-1.5 flex items-center justify-between border-b border-dark-border-subtle shrink-0 select-none">
            {toolbarContent || (
              <>
                <div className="flex items-center gap-3 text-dark-text-muted">
                  <button
                    onClick={onRefresh}
                    className="p-1 hover:bg-dark-border/50 rounded transition-colors flex items-center justify-center cursor-pointer"
                    title="Refresh database"
                    aria-label="Refresh database"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 4v6h6M23 20v-6h-6" />
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                    </svg>
                  </button>
                  <div className="h-4 w-px bg-dark-border" />
                  <span className="text-[11px] px-2 py-0.5 bg-dark-border/40 rounded font-mono">
                    Next.js 16
                  </span>
                  <div className="h-4 w-px bg-dark-border" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-accent-teal">
                    registry: active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onSearch}
                    className="p-1 text-dark-text-muted hover:text-dark-text hover:bg-dark-border/50 rounded transition-colors cursor-pointer"
                    title="Search registry index (Cmd+K)"
                    aria-label="Search registry"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </button>
                  <button
                    onClick={onToggleSettings}
                    className="p-1 text-dark-text-muted hover:text-dark-text hover:bg-dark-border/50 rounded transition-colors cursor-pointer"
                    title="CRT & Sound settings"
                    aria-label="CRT and sound settings"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-dark-surface min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
);
