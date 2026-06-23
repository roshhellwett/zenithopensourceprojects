"use client";

import React, { useState } from "react";
import { NAV_ITEMS } from "@/data/nav";
import { Search, ChevronDown, Github } from "lucide-react";
import { renderDesktopIcon } from "@/components/DesktopIcon";

interface NavbarProps {
  onToggleMode?: () => void;
  currentMode?: "desktop" | "website";
}

export default function Navbar({ onToggleMode, currentMode }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-dark-surface/95 border-b border-dark-border">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-12 flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0 group">
            <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="6" width="28" height="20" rx="3" fill="#1d1f27" stroke="#F1A82C" strokeWidth="2"/>
              <path d="M6 10h4v2H6zM12 10h4v2h-4zM20 10h6v2h-6z" fill="#F1A82C" opacity="0.8"/>
              <path d="M6 15h20v1H6z" fill="#65675e"/>
              <path d="M6 18h14v1H6z" fill="#65675e"/>
              <path d="M6 21h8v1H6z" fill="#65675e"/>
            </svg>
            <span className="font-extrabold text-[15px] tracking-tight text-dark-text hidden sm:inline">
              Zenith
            </span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative navbar-item group">
                <button className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium text-dark-text-muted hover:text-dark-text transition-colors rounded-md hover:bg-dark-surface cursor-pointer">
                  {item.label}
                  {item.children && <ChevronDown className="w-3 h-3 opacity-50" />}
                </button>

                {/* Dropdown */}
                {item.children && (
                  <div className="navbar-dropdown absolute top-full left-0 mt-1 w-72 bg-dark-elevated border border-dark-border rounded-lg shadow-2xl p-2 z-50">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        target={child.href?.startsWith("http") ? "_blank" : undefined}
                        rel={child.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-dark-elevated transition-colors group/item"
                      >
                        <span className="mt-0.5 shrink-0 w-6 h-6 flex items-center justify-center">{child.icon ? renderDesktopIcon(child.icon, "w-6 h-6") : null}</span>
                        <div>
                          <div className="text-sm font-semibold text-dark-text group-hover/item:text-amber-button transition-colors">
                            {child.label}
                            {child.badge && (
                              <span className="ml-2 text-[9px] font-bold bg-accent-teal/20 text-accent-teal px-1.5 py-0.5 rounded uppercase">
                                {child.badge}
                              </span>
                            )}
                          </div>
                          {child.desc && (
                            <div className="text-xs text-dark-text-muted mt-0.5">{child.desc}</div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/roshhellwett/zenithopensourceprojects"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-amber-button hover:bg-saffron-deep text-black px-4 py-1.5 rounded-md text-xs font-bold transition-all active:scale-95 border border-amber-shadow"
          >
            Get started – free
          </a>

          <button
            className="p-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-surface rounded-md transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <a
            href="https://github.com/roshhellwett"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-surface rounded-md transition-colors"
            title="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>

          <button
            className="p-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-surface rounded-md transition-colors"
            title="Profile"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-dark-text-muted hover:text-dark-text hover:bg-dark-surface rounded-md transition-colors"
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

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-dark-elevated border-t border-dark-border px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-dark-text-muted px-2 pt-2">
                {item.label}
              </div>
              {item.children?.map((child) => (
                <a
                  key={child.label}
                  href={child.href}
                  target={child.href?.startsWith("http") ? "_blank" : undefined}
                  rel={child.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-2 px-2 py-2 text-sm text-dark-text hover:bg-dark-elevated rounded-md transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{child.icon}</span>
                  <span>{child.label}</span>
                </a>
              ))}
            </div>
          ))}
          <div className="pt-3 border-t border-dark-border-subtle">
            <a
              href="https://github.com/roshhellwett/zenithopensourceprojects"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-amber-button hover:bg-saffron-deep text-black px-4 py-2.5 rounded-md text-sm font-bold transition-all w-full"
            >
              Get started – free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
