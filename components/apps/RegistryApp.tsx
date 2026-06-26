"use client";

import React, { useState } from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from "@/data/categories";
import { FEATURED_FALLBACK, FALLBACK_REPOS } from "@/data/repos";
import { SoundType } from '@/lib/audio';

export default function RegistryApp({ playRetroSound }: { playRetroSound: (type: SoundType) => void }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredRepos = activeCategory === "all"
    ? [FEATURED_FALLBACK, ...FALLBACK_REPOS]
    : [FEATURED_FALLBACK, ...FALLBACK_REPOS].filter((repo) => repo.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex overflow-x-auto pb-1 gap-1.5 border-b border-dark-border-subtle select-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              playRetroSound("click");
            }}
            className={`px-3 py-1.5 rounded-t text-xs font-bold border-t border-x focus:outline-none transition-colors whitespace-nowrap cursor-pointer ${
              activeCategory === cat.id
                ? "bg-dark-surface border-dark-border text-dark-text border-b-2 border-b-amber-button -mb-[2px] z-10"
                : "bg-dark-bg border-dark-border-subtle text-dark-text-muted hover:text-dark-text"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filtered Repos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRepos.slice(0, 6).map((repo) => (
          <div
            key={repo.name}
            className="bg-dark-surface border border-dark-border p-4 rounded flex flex-col justify-between hover:bg-dark-elevated transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-dark-text bg-dark-elevated px-2 py-0.5 rounded border border-dark-border-subtle">
                  {repo.name}
                </span>
                {repo.stars !== undefined && (
                  <span className="text-[10px] font-mono text-amber-button bg-amber-button/10 px-1.5 py-0.5 rounded font-bold border border-amber-button/20">
                    ★ {repo.stars} stars
                  </span>
                )}
              </div>
              
              <h4 className="font-extrabold text-sm text-dark-text">{repo.displayName || repo.name.toUpperCase()}</h4>
              <p className="text-xs text-dark-text-muted leading-relaxed min-h-[54px]">{repo.desc}</p>
            </div>

            <div className="flex items-center justify-between border-t border-dark-border-subtle pt-3.5 mt-4 font-mono text-[11px] text-dark-text-muted">
              <div>
                Lang: <span className="font-bold text-dark-text">{repo.lang}</span>
              </div>
              <div className="flex gap-2">
                {repo.homepage && (
                  <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-teal hover:underline font-bold flex items-center gap-0.5"
                  >
                    <span>Demo</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
                <a
                  href={repo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cobalt hover:underline font-bold flex items-center gap-0.5"
                >
                  <span>Code</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See more link */}
      {filteredRepos.length > 3 && (
        <div className="mt-6 flex justify-center">
          <a
            href="https://github.com/roshhellwett?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-button hover:bg-saffron-deep text-black px-6 py-2.5 border border-amber-shadow rounded text-xs font-bold flex items-center gap-2 transition-transform active:translate-y-0.5"
          >
            Visit Zenith Registry Page <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
