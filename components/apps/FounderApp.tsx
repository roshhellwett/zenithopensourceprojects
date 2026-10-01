"use client";

import React, { useState } from 'react';
import { SOCIALS } from "@/data/socials";
import { CheckCircle2, MessageSquare, Coffee, Heart } from 'lucide-react';
import { playRetroSound } from "@/lib/audio";
import FounderAvatar from "@/components/FounderAvatar";

export default function FounderApp() {
  const [coffeeGiven, setCoffeeGiven] = useState(false);

  const handleCoffee = () => {
    playRetroSound("success");
    setCoffeeGiven(true);
    setTimeout(() => setCoffeeGiven(false), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-dark-surface/90 border border-dark-border/80 p-4 sm:p-6 rounded-xl space-y-4 shadow-sm">
        <div className="flex items-center gap-3.5 sm:gap-4 border-b pb-4 border-dark-border-subtle">
          <FounderAvatar size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-dark-text leading-tight truncate">Roshan Kr Singh</h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono text-accent-teal bg-accent-teal/10 px-2 py-0.5 rounded border border-accent-teal/20 font-bold">
                <CheckCircle2 className="w-2.5 h-2.5" /> BHARAT
              </span>
            </div>
            <span className="font-mono text-[10px] text-dark-text-muted uppercase tracking-wider truncate block mt-0.5">
              @roshhellwett · Founder, Architect & Maintainer
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-dark-text-muted leading-relaxed">
          Independent developer, systems engineer, and open-source enthusiast based in India. Roshan builds micro-utilities, civic project concepts, and lightweight automation bots aimed at optimizing developer workspaces and public transparent architectures.
        </p>

        <blockquote className="p-3 sm:p-4 border-l-4 border-amber-button bg-dark-elevated/80 rounded-r-xl text-xs sm:text-sm italic text-dark-text leading-relaxed shadow-inner">
          &ldquo;Open Source is the foundation of genuine progress. Build public tools, auditable lines, and transparent frameworks to empower the next generation.&rdquo;
        </blockquote>

        {/* Quick Interaction */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleCoffee}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              coffeeGiven
                ? "bg-accent-teal text-white border-accent-teal shadow-md"
                : "bg-amber-button/10 text-amber-button border-amber-button/40 hover:bg-amber-button/20"
            }`}
          >
            {coffeeGiven ? (
              <>
                <Heart className="w-3.5 h-3.5 fill-white text-white animate-bounce" />
                <span>Thank you for the love!</span>
              </>
            ) : (
              <>
                <Coffee className="w-3.5 h-3.5" />
                <span>Send Virtual Coffee</span>
              </>
            )}
          </button>

          <a
            href="https://www.linkedin.com/in/roshhellwett"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playRetroSound("click")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-dark-border hover:bg-dark-elevated text-dark-text transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cobalt" />
            <span>Connect on LinkedIn</span>
          </a>
        </div>
      </div>

      {/* Social Profiles Grid */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] text-dark-text-faint uppercase tracking-wider block font-bold">
          Verified Developer Profiles & Channels
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.link}
              target="_blank"
              rel="noreferrer"
              onClick={() => playRetroSound("click")}
              className="flex items-center gap-2 p-2.5 bg-dark-surface/90 border border-dark-border/80 rounded-xl text-xs hover:bg-dark-elevated holo-card font-semibold text-dark-text-muted hover:text-dark-text min-h-[44px] transition-all"
            >
              <span className="shrink-0 text-base">{s.icon}</span>
              <span className="truncate text-xs">{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
