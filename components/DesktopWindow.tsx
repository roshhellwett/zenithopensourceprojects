"use client";

import React, { useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { X, Minus, Square, ChevronDown } from "lucide-react";

interface DesktopWindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onMinimize: () => void;
  showToolbar?: boolean;
  toolbarContent?: React.ReactNode;
}

export default function DesktopWindow({
  title,
  children,
  onClose,
  isMaximized,
  onToggleMaximize,
  onMinimize,
  showToolbar = true,
  toolbarContent,
}: DesktopWindowProps) {
  const dragControls = useDragControls();

  return (
    <motion.div
      className={`flex flex-col window-chrome ${
        isMaximized
          ? "fixed inset-0 w-full h-[calc(100vh-48px)] top-12 z-40 rounded-none"
          : "absolute w-[92vw] md:w-[880px] h-[80vh] md:h-[680px] top-8 left-[80px] md:left-[100px] z-40 rounded-xl"
      }`}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
    >
      <div
        className={`bg-dark-surface border border-dark-border overflow-hidden flex flex-col flex-1 ${
          isMaximized ? "rounded-none" : "rounded-xl"
        }`}
      >
        {/* Title bar */}
        <div
          className="bg-dark-elevated px-3 py-2 flex items-center justify-between border-b border-dark-border cursor-move select-none shrink-0"
          onPointerDown={(e) => !isMaximized && dragControls.start(e)}
          onDoubleClick={onToggleMaximize}
        >
          {/* Traffic lights */}
          <div
            className="flex items-center gap-1.5"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF3B30] border border-[#E04842] focus:outline-none transition-colors"
              title="Close"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#F5A623] border border-[#DFA023] focus:outline-none transition-colors"
              title="Minimize"
            />
            <button
              onClick={onToggleMaximize}
              className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#1DB954] border border-[#24A93B] focus:outline-none transition-colors"
              title="Maximize"
            />
          </div>

          {/* Center: file name with dropdown */}
          <div className="flex items-center gap-1.5 text-sm text-dark-text/70 font-medium">
            <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span>{title}</span>
            <ChevronDown className="w-3 h-3 opacity-40" />
          </div>

          {/* Right spacer / close */}
          <div className="flex items-center gap-2 text-dark-text-muted">
            <button
              onClick={onMinimize}
              className="p-0.5 hover:bg-dark-border rounded transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleMaximize}
              className="p-0.5 hover:bg-dark-border rounded transition-colors"
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              onClick={onClose}
              className="p-0.5 hover:bg-dark-border rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Optional toolbar */}
        {showToolbar && (
          <div className="bg-dark-surface px-3 py-1.5 flex items-center justify-between border-b border-dark-border-subtle shrink-0">
            {toolbarContent || (
              <>
                <div className="flex items-center gap-2 text-dark-text-muted">
                  <button className="px-2 py-0.5 text-[11px] hover:bg-dark-border rounded transition-colors flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
                  </button>
                  <div className="h-4 w-px bg-dark-border" />
                  <span className="text-[11px] px-2 py-0.5 bg-dark-border/50 rounded flex items-center gap-1">
                    Zoom
                    <ChevronDown className="w-2.5 h-2.5 opacity-50" />
                  </span>
                  <div className="h-4 w-px bg-dark-border" />
                  <span className="text-[11px] font-bold px-1 hover:bg-dark-border rounded cursor-pointer">B</span>
                  <span className="text-[11px] italic px-1 hover:bg-dark-border rounded cursor-pointer">I</span>
                  <span className="text-[11px] underline px-1 hover:bg-dark-border rounded cursor-pointer">U</span>
                  <div className="h-4 w-px bg-dark-border" />
                  <svg className="w-3.5 h-3.5 hover:text-dark-text cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                  <svg className="w-3.5 h-3.5 hover:text-dark-text cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h10M4 18h14"/></svg>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-dark-text-muted hover:text-dark-text cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  <svg className="w-3.5 h-3.5 text-dark-text-muted hover:text-dark-text cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  <a
                    href="https://github.com/roshhellwett/zenithopensourceprojects"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-button hover:bg-saffron-deep text-black text-[11px] font-bold px-3 py-1 rounded border border-amber-shadow transition-colors"
                  >
                    Get started - free
                  </a>
                </div>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-dark-surface">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
