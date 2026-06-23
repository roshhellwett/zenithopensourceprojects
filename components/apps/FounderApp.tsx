import React from 'react';
import { SOCIALS } from "@/data/socials";

export default function FounderApp() {
  return (
    <div className="space-y-6">
      <div className="bg-dark-surface border border-dark-border p-5 rounded space-y-4">
        <div className="flex items-center gap-4 border-b pb-3 border-dark-border-subtle">
          <div className="w-12 h-12 rounded bg-gradient-to-br from-amber-button to-ember flex items-center justify-center border border-dark-border text-white text-lg font-bold">
            RK
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-dark-text leading-tight">Roshan Kr Singh</h3>
            <span className="font-mono text-[10px] text-dark-text-muted uppercase tracking-wider">@roshhellwett · Founder & Maintainer</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-dark-text-muted leading-relaxed">
          Independent developer, systems engineer, and Google Dev member based in India. Roshan builds micro-utilities, civic project concepts, and lightweight automation bots aimed at optimizing developer workspaces and administrative loops.
        </p>

        <blockquote className="p-3 border-l-4 border-amber-button bg-dark-elevated rounded-r text-xs italic text-dark-text-muted leading-normal">
          &ldquo;Open Source is the first step of development. Build public tools, verified lines, and transparent frameworks to empower the next generation.&rdquo;
        </blockquote>
      </div>

      {/* Social Vertices Grid */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-dark-text-faint uppercase tracking-wider block">Independent Developer Profiles</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 p-2 bg-dark-surface border border-dark-border rounded text-xs hover:bg-dark-elevated transition-colors font-semibold text-dark-text-muted hover:text-dark-text"
            >
              <span>{s.icon}</span>
              <span className="truncate">{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
