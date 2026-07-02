"use client";

import React, { memo, useState, useEffect, useRef } from "react";

interface DesktopIconProps {
  label: string;
  iconKey: string;
  onClick: () => void;
}

export default memo(function DesktopIcon({ label, iconKey, onClick }: DesktopIconProps) {
  const [selected, setSelected] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Click outside to deselect icon highlight
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setSelected(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if it's already selected
    if (selected) {
      onClick();
      setSelected(false);
    } else {
      setSelected(true);
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onClick();
        setSelected(false);
      }}
      className={`desktop-icon flex flex-col items-center gap-1.5 p-2 w-[78px] cursor-pointer focus:outline-none group relative transition-all rounded-lg select-none ${
        selected
          ? "bg-amber-button/20 border border-amber-button/40 shadow-inner scale-[0.98]"
          : "border border-transparent hover:bg-dark-border/20"
      }`}
      title={label.replace("\n", " ")}
      aria-label={label.replace("\n", " ")}
      aria-pressed={selected}
    >
      {/* Subtle hover glow behind icon */}
      <div className="absolute inset-0 bg-amber-button/10 opacity-0 group-hover:opacity-100 rounded-lg filter blur-md transition-opacity pointer-events-none" />

      <div className="w-12 h-12 flex items-center justify-center relative z-10 drop-shadow-sm group-hover:scale-105 transition-transform duration-200">
        {renderDesktopIcon(iconKey)}
      </div>
      <span className={`text-[10px] text-center font-bold tracking-tight leading-tight select-none z-10 break-words w-full ${
        selected ? "text-dark-text" : "text-dark-text/80 group-hover:text-dark-text"
      }`}>
        {label}
      </span>
    </button>
  );
}
);

const ICON_MAP: Record<string, React.ReactNode> = {
  "file-text": (
    <><path d="M10 6h20l8 8v28H10V6z" fill="#fdfdf8" stroke="#23251d" strokeWidth="2.5" strokeLinejoin="round" />
<path d="M30 6v8h8" fill="none" stroke="#23251d" strokeWidth="2.5" strokeLinejoin="round" />
<line x1="15" y1="18" x2="33" y2="18" stroke="#9ea096" strokeWidth="2" strokeLinecap="round" />
<line x1="15" y1="24" x2="33" y2="24" stroke="#9ea096" strokeWidth="2" strokeLinecap="round" />
<line x1="15" y1="30" x2="25" y2="30" stroke="#9ea096" strokeWidth="2" strokeLinecap="round" />
<polygon points="32,28 34,33 39,33 35,36 36,41 32,38 28,41 29,36 25,33 30,33" fill="#f54e00" stroke="#23251d" strokeWidth="1" /></>
  ),
  "folder-project": (
    <><path d="M6 12h14l4 4h18v24H6V12z" fill="#2f80fa" stroke="#23251d" strokeWidth="2.5" strokeLinejoin="round" />
<rect x="10" y="22" width="28" height="16" rx="1" fill="#fdfdf8" stroke="#23251d" strokeWidth="2" />
<rect x="30" y="14" width="4" height="4" fill="#23251d" />
<line x1="14" y1="27" x2="34" y2="27" stroke="#9ea096" strokeWidth="1.5" />
<line x1="14" y1="32" x2="34" y2="32" stroke="#9ea096" strokeWidth="1.5" /></>
  ),
  stack: (
    <><path d="M8 14c0-3 7.2-5.5 16-5.5S40 11 40 14s-7.2 5.5-16 5.5S8 17 8 14z" fill="#f1a82c" stroke="#23251d" strokeWidth="2.5" />
<path d="M8 14v7c0 3 7.2 5.5 16 5.5S40 24 40 21v-7" stroke="#23251d" strokeWidth="2.5" />
<path d="M8 21v7c0 3 7.2 5.5 16 5.5S40 31 40 28v-7" stroke="#23251d" strokeWidth="2.5" />
<path d="M8 28v7c0 3 7.2 5.5 16 5.5S40 38 40 35v-7" stroke="#23251d" strokeWidth="2.5" /></>
  ),
  "file-mdx": (
    <><path d="M10 6h20l8 8v28H10V6z" fill="#eeefe9" stroke="#23251d" strokeWidth="2.5" strokeLinejoin="round" />
<path d="M30 6v8h8" fill="none" stroke="#23251d" strokeWidth="2.5" strokeLinejoin="round" />
<rect x="14" y="17" width="20" height="6" rx="1" fill="#2CB67D" />
<text x="16" y="22" fontSize="5" fontFamily="monospace" fill="white" fontWeight="bold">MDX</text>
<line x1="15" y1="28" x2="33" y2="28" stroke="#9ea096" strokeWidth="1.5" />
<line x1="15" y1="32" x2="28" y2="32" stroke="#9ea096" strokeWidth="1.5" /></>
  ),
  video: (
    <><rect x="6" y="10" width="36" height="28" rx="3" fill="#1d1f27" stroke="#23251d" strokeWidth="2.5" />
<rect x="10" y="14" width="28" height="20" rx="2" fill="#2C2E3A" />
<path d="M20 18v12l10-6z" fill="#f1a82c" />
<text x="8" y="44" fontSize="4" fontFamily="monospace" fill="#65675e">DEMO</text></>
  ),
  docs: (
    <><path d="M10 6h20l8 8v28H10V6z" fill="#EE6E5E" stroke="#23251d" strokeWidth="2.5" strokeLinejoin="round" />
<path d="M30 6v8h8" fill="none" stroke="#23251d" strokeWidth="2.5" strokeLinejoin="round" />
<rect x="14" y="18" width="8" height="8" rx="1" fill="#fdfdf8" />
<circle cx="18" cy="22" r="2" fill="#23251d" />
<line x1="25" y1="19" x2="33" y2="19" stroke="#fdfdf8" strokeWidth="1.5" />
<line x1="25" y1="23" x2="31" y2="23" stroke="#fdfdf8" strokeWidth="1.5" />
<line x1="14" y1="30" x2="33" y2="30" stroke="#fdfdf8" strokeWidth="1.5" />
<line x1="14" y1="34" x2="28" y2="34" stroke="#fdfdf8" strokeWidth="1.5" /></>
  ),
  "chat-bubble": (
    <><path d="M8 8h32v24H22l-10 8V32H8V8z" fill="#fdfdf8" stroke="#23251d" strokeWidth="2.5" strokeLinejoin="round" />
<circle cx="17" cy="19" r="2" fill="#23251d" />
<circle cx="24" cy="19" r="2" fill="#23251d" />
<circle cx="31" cy="19" r="2" fill="#23251d" /></>
  ),
  question: (
    <><path d="M8 8h32v24H22l-10 8V32H8V8z" fill="#fdfdf8" stroke="#23251d" strokeWidth="2.5" strokeLinejoin="round" />
<rect x="12" y="13" width="7" height="7" rx="2" fill="#bfc1b7" />
<rect x="27" y="13" width="7" height="7" rx="2" fill="#bfc1b7" />
<circle cx="15.5" cy="16.5" r="1.5" fill="#23251d" />
<circle cx="30.5" cy="16.5" r="1.5" fill="#23251d" />
<ellipse cx="23" cy="21" rx="3" ry="1.5" fill="#23251d" />
<path d="M20 25q3 2 6 0" fill="none" stroke="#23251d" strokeWidth="1.5" strokeLinecap="round" /></>
  ),
  signup: (
    <><circle cx="24" cy="24" r="18" fill="#eeefe9" stroke="#23251d" strokeWidth="2.5" />
<circle cx="24" cy="18" r="5" fill="#2f80fa" stroke="#23251d" strokeWidth="1.5" />
<path d="M14 34c0-5 5-7 10-7s10 2 10 7" fill="#2f80fa" stroke="#23251d" strokeWidth="1.5" />
<path d="M34 14l4-4M38 14l-4-4" stroke="#f1a82c" strokeWidth="2" strokeLinecap="round" /></>
  ),
  switch: (
    <><rect x="6" y="8" width="36" height="32" rx="4" fill="#e1d7c2" stroke="#23251d" strokeWidth="2.5" />
<rect x="10" y="12" width="28" height="24" rx="2" fill="#23251d" />
<circle cx="36" cy="34" r="1.5" fill="#6aa84f" />
<line x1="15" y1="17" x2="33" y2="17" stroke="#eb9d2a" strokeWidth="2.5" strokeLinecap="round" />
<line x1="15" y1="23" x2="27" y2="23" stroke="#eb9d2a" strokeWidth="2.5" strokeLinecap="round" />
<line x1="15" y1="29" x2="21" y2="29" stroke="#eb9d2a" strokeWidth="2" strokeLinecap="round" /></>
  ),
  why: (
    <><rect x="8" y="4" width="32" height="40" rx="3" fill="#eeefe9" stroke="#23251d" strokeWidth="2.5" />
<rect x="12" y="8" width="24" height="32" fill="#fdfdf8" stroke="#23251d" strokeWidth="2" />
<text x="18" y="29" fontSize="18" fontFamily="serif" fill="#23251d" fontWeight="bold">?</text>
<rect x="28" y="10" width="5" height="5" rx="1" fill="#f1a82c" /></>
  ),
  changelog: (
    <><rect x="8" y="4" width="32" height="40" rx="3" fill="#EE6E5E" stroke="#23251d" strokeWidth="2.5" />
<rect x="12" y="10" width="24" height="4" rx="1" fill="#fdfdf8" />
<rect x="12" y="18" width="24" height="4" rx="1" fill="#fdfdf8" opacity="0.7" />
<rect x="12" y="26" width="24" height="4" rx="1" fill="#fdfdf8" opacity="0.5" />
<rect x="12" y="34" width="16" height="4" rx="1" fill="#fdfdf8" opacity="0.3" /></>
  ),
  handbook: (
    <><rect x="8" y="4" width="32" height="40" rx="3" fill="#B392F0" stroke="#23251d" strokeWidth="2.5" />
<rect x="14" y="8" width="20" height="32" fill="#fdfdf8" stroke="#23251d" strokeWidth="1.5" />
<line x1="18" y1="14" x2="30" y2="14" stroke="#9ea096" strokeWidth="1.5" />
<line x1="18" y1="19" x2="30" y2="19" stroke="#9ea096" strokeWidth="1.5" />
<line x1="18" y1="24" x2="28" y2="24" stroke="#9ea096" strokeWidth="1.5" />
<line x1="18" y1="29" x2="26" y2="29" stroke="#9ea096" strokeWidth="1.5" /></>
  ),
  store: (
    <><rect x="6" y="14" width="36" height="28" rx="3" fill="#eeefe9" stroke="#23251d" strokeWidth="2.5" />
<path d="M6 14h36v8H6z" fill="#f54e00" stroke="#23251d" strokeWidth="2.5" />
<rect x="18" y="28" width="12" height="14" rx="1" fill="#fdfdf8" stroke="#23251d" strokeWidth="1.5" />
<line x1="24" y1="28" x2="24" y2="42" stroke="#23251d" strokeWidth="1.5" />
<path d="M16 6l-4 8M32 6l4 8M24 4v10" stroke="#23251d" strokeWidth="2.5" strokeLinecap="round" /></>
  ),
  work: (
    <><rect x="8" y="14" width="32" height="24" rx="3" fill="#2f80fa" stroke="#23251d" strokeWidth="2.5" />
<path d="M16 14V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" stroke="#23251d" strokeWidth="2.5" />
<rect x="20" y="22" width="8" height="6" rx="1" fill="#fdfdf8" stroke="#23251d" strokeWidth="1.5" />
<line x1="8" y1="26" x2="20" y2="26" stroke="#23251d" strokeWidth="1.5" />
<line x1="28" y1="26" x2="40" y2="26" stroke="#23251d" strokeWidth="1.5" /></>
  ),
  trash: (
    <><path d="M14 16h20v22a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V16z" fill="#eeefe9" stroke="#23251d" strokeWidth="2.5" />
<path d="M10 16h28" stroke="#23251d" strokeWidth="2.5" strokeLinecap="round" />
<path d="M18 16V12a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" stroke="#23251d" strokeWidth="2.5" />
<line x1="20" y1="22" x2="20" y2="34" stroke="#9ea096" strokeWidth="2" strokeLinecap="round" />
<line x1="24" y1="22" x2="24" y2="34" stroke="#9ea096" strokeWidth="2" strokeLinecap="round" />
<line x1="28" y1="22" x2="28" y2="34" stroke="#9ea096" strokeWidth="2" strokeLinecap="round" /></>
  ),
};

export function renderDesktopIcon(key: string, className: string = "w-10 h-10") {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {ICON_MAP[key] ?? (
        <><rect x="8" y="8" width="32" height="32" rx="4" fill="#eeefe9" stroke="#23251d" strokeWidth="2.5" />
<line x1="16" y1="18" x2="32" y2="18" stroke="#9ea096" strokeWidth="2" />
<line x1="16" y1="24" x2="32" y2="24" stroke="#9ea096" strokeWidth="2" />
<line x1="16" y1="30" x2="28" y2="30" stroke="#9ea096" strokeWidth="2" /></>
      )}
    </svg>
  );
}
