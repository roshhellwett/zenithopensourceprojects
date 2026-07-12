import React from 'react';
import { SOCIALS } from "@/data/socials";

export default function FounderApp() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-dark-surface border border-dark-border p-4 sm:p-5 rounded space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3 sm:gap-4 border-b pb-3 border-dark-border-subtle">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded bg-gradient-to-br from-amber-button to-ember flex items-center justify-center border border-dark-border text-white text-base sm:text-lg font-bold shrink-0">
            RK
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-extrabold text-dark-text leading-tight truncate">Roshan Kr Singh</h3>
            <span className="font-mono text-[10px] text-dark-text-muted uppercase tracking-wider truncate block">@roshhellwett · Founder & Maintainer</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-dark-text-muted leading-relaxed">
          Independent developer, systems engineer, and Google Dev member based in India. Roshan builds micro-utilities, civic project concepts, and lightweight automation bots aimed at optimizing developer workspaces and administrative loops.
        </p>

        <blockquote className="p-2.5 sm:p-3 border-l-4 border-amber-button bg-dark-elevated rounded-r text-[11px] sm:text-xs italic text-dark-text-muted leading-normal">
          &ldquo;Open Source is the first step of development. Build public tools, verified lines, and transparent frameworks to empower the next generation.&rdquo;
        </blockquote>
      </div>

      {/* Social Vertices Grid */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-dark-text-faint uppercase tracking-wider block">Independent Developer Profiles</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2 bg-dark-surface border border-dark-border rounded text-xs hover:bg-dark-elevated transition-colors font-semibold text-dark-text-muted hover:text-dark-text min-h-[44px] sm:min-h-[36px]"
            >
              <span className="shrink-0 text-sm sm:text-base">{s.icon}</span>
              <span className="truncate text-[11px] sm:text-xs">{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
