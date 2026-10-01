"use client";

import React, { useState, useMemo } from 'react';
import { ExternalLink, ArrowUpRight, Search, Copy, Check, Star, GitBranch } from 'lucide-react';
import { CATEGORIES } from "@/data/categories";
import { FEATURED_FALLBACK, FALLBACK_REPOS } from "@/data/repos";
import { SoundType } from '@/lib/audio';

export default function RegistryApp({ playRetroSound }: { playRetroSound: (type: SoundType) => void }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedRepo, setCopiedRepo] = useState<string | null>(null);

  const allRepos = useMemo(() => [FEATURED_FALLBACK, ...FALLBACK_REPOS], []);

  const filteredRepos = useMemo(() => {
    return allRepos.filter((repo) => {
      const matchesCategory = activeCategory === "all" || repo.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.displayName && repo.displayName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (repo.desc && repo.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (repo.lang && repo.lang.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allRepos, activeCategory, searchQuery]);

  const handleCopyClone = (repoLink: string, repoName: string) => {
    playRetroSound("success");
    navigator.clipboard?.writeText(`git clone ${repoLink}.git`);
    setCopiedRepo(repoName);
    setTimeout(() => setCopiedRepo(null), 2500);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Bar & Category filter */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by repo name, tech, or concept..."
            className="w-full pl-8 pr-3 py-1.5 bg-dark-surface/90 border border-dark-border rounded-lg text-xs font-mono text-dark-text placeholder:text-dark-text-faint focus:outline-none focus:border-amber-button focus:ring-1 focus:ring-amber-button/30 transition-all"
          />
        </div>
        <span className="text-[10px] font-mono text-dark-text-faint self-end sm:self-center">
          {filteredRepos.length} of {allRepos.length} modules loaded
        </span>
      </div>

      {/* Category tabs */}
      <div className="flex overflow-x-auto pb-1 gap-1 border-b border-dark-border-subtle select-none scrollbar-none snap-x-mandatory -mx-1 px-1" role="tablist">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            aria-controls="registry-panel"
            onClick={() => {
              setActiveCategory(cat.id);
              playRetroSound("click");
            }}
            className={`px-3 py-1.5 rounded-t-lg text-[11px] sm:text-xs font-bold border-t border-x focus:outline-none transition-colors whitespace-nowrap cursor-pointer snap-start shrink-0 ${
              activeCategory === cat.id
                ? "bg-dark-surface border-dark-border text-dark-text border-b-2 border-b-amber-button -mb-[2px] z-10 font-black"
                : "bg-dark-bg/60 border-dark-border-subtle text-dark-text-muted hover:text-dark-text"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filtered Repos Grid */}
      <div id="registry-panel" className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {filteredRepos.map((repo) => (
          <div
            key={repo.name}
            className="bg-dark-surface/90 border border-dark-border/80 p-3.5 sm:p-4 rounded-xl flex flex-col justify-between hover:bg-dark-elevated holo-card transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-dark-text bg-dark-elevated px-2 py-0.5 rounded border border-dark-border-subtle">
                  {repo.name}
                </span>
                <div className="flex items-center gap-1.5">
                  {repo.stars !== undefined && (
                    <span className="text-[10px] font-mono text-amber-button bg-amber-button/10 px-1.5 py-0.5 rounded font-bold border border-amber-button/20 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-button text-amber-button" /> {repo.stars}
                    </span>
                  )}
                  <span className="text-[9px] font-mono uppercase bg-dark-bg px-1.5 py-0.5 rounded text-dark-text-faint border border-dark-border-subtle">
                    {repo.category}
                  </span>
                </div>
              </div>
              
              <h4 className="font-extrabold text-sm text-dark-text">{repo.displayName || repo.name.toUpperCase()}</h4>
              <p className="text-xs text-dark-text-muted leading-relaxed line-clamp-2">{repo.desc}</p>
            </div>

            <div className="flex items-center justify-between border-t border-dark-border-subtle pt-3 mt-3 font-mono text-[11px] text-dark-text-muted">
              <div className="flex items-center gap-1">
                <span className="text-dark-text-faint">Lang:</span>
                <span className="font-bold text-dark-text">{repo.lang}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyClone(repo.link, repo.name)}
                  className="text-dark-text-muted hover:text-amber-button flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded hover:bg-dark-bg transition-colors"
                  title="Copy git clone command"
                >
                  {copiedRepo === repo.name ? (
                    <span className="text-accent-teal flex items-center gap-0.5 font-bold">
                      <Check className="w-2.5 h-2.5" /> Copied
                    </span>
                  ) : (
                    <>
                      <Copy className="w-2.5 h-2.5" /> Clone
                    </>
                  )}
                </button>
                {repo.homepage && (
                  <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => playRetroSound("click")}
                    className="text-accent-teal hover:underline font-bold flex items-center gap-0.5 text-[10px]"
                  >
                    <span>Demo</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
                <a
                  href={repo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playRetroSound("click")}
                  className="text-cobalt hover:underline font-bold flex items-center gap-0.5 text-[10px]"
                >
                  <span>Code</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GitHub Repository Registry Button */}
      <div className="mt-4 flex justify-center">
        <a
          href="https://github.com/roshhellwett?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playRetroSound("click")}
          className="bg-amber-button hover:bg-saffron-deep text-black px-5 py-2 border border-amber-shadow rounded-lg text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Explore All 10+ Repos on GitHub</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
