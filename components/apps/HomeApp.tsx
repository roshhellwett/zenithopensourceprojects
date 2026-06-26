import React from 'react';
import { FileCode, ArrowUpRight } from 'lucide-react';

export default function HomeApp() {
  return (
    <div className="space-y-6">
      <div className="bg-dark-surface border-l-4 border-cobalt p-4 rounded-r flex flex-col gap-2 border border-dark-border">
        <h3 className="text-sm font-bold text-dark-text flex items-center gap-1.5 uppercase font-mono">
          <FileCode className="w-4 h-4 text-cobalt" />
          <span>The Zenith Open Source Thesis</span>
        </h3>
        <p className="text-xs text-dark-text-muted leading-relaxed">
          Zenith is a digital registry and project showcase for civic‑tech platforms, low‑level systems interfaces, local automation pipelines, and developer utilities. Designed in India and optimized for deterministic, accessible, and public-first deployment models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-dark-surface border border-dark-border p-4 rounded space-y-2.5">
          <span className="text-[10px] font-mono text-dark-text-faint block border-b pb-1 border-dark-border-subtle uppercase">✦ CORE THESIS 01</span>
          <h4 className="font-extrabold text-sm text-dark-text">Self-Reliance (Bharat First)</h4>
          <p className="text-xs text-dark-text-muted leading-relaxed">
            We prioritize building auditable digital voting blueprints, newsrooms filtering media bias, and utility scripts that empower students and system administrators locally without relying on proprietary structures.
          </p>
        </div>

        <div className="bg-dark-surface border border-dark-border p-4 rounded space-y-2.5">
          <span className="text-[10px] font-mono text-dark-text-faint block border-b pb-1 border-dark-border-subtle uppercase">✦ CORE THESIS 02</span>
          <h4 className="font-extrabold text-sm text-dark-text">Transparent Architectures</h4>
          <p className="text-xs text-dark-text-muted leading-relaxed">
            All modules feature deterministic execution, clean scripts, and readable documentation. No hidden integrations, fully offline-compatible utility stacks, and free to audit forever.
          </p>
        </div>
      </div>

      {/* FEATURED PROJECT */}
      <div className="bg-dark-elevated border-2 border-dark-border p-4 rounded space-y-3">
        <div className="flex items-center justify-between border-b pb-2 border-dark-border-subtle">
          <span className="font-mono text-xs font-bold text-dark-text">⭐️ KEY FEATURED REPOSITORY: PROJECT SENTINEL</span>
          <span className="text-[10px] font-mono text-cobalt border border-cobalt/30 px-2 py-0.5 rounded bg-cobalt/10 font-bold">AI News Scraper</span>
        </div>

        <p className="text-xs text-dark-text-muted leading-relaxed">
          Project Sentinel is an automated Indian news aggregator pipeline. It aggregates source RSS streams, isolates clickbait via lightweight NLP heuristics, classifying events dynamically in real-time. Fuses scraper routines and classification logic into a clean terminal simulator console.
        </p>

        <div className="flex items-center gap-3.5 pt-2 font-mono text-xs text-dark-text-muted">
          <span>Language: <b className="text-dark-text">TypeScript</b></span>
          <span>Target: <b className="text-dark-text">Verifiable Newsroom</b></span>
          <a
            href="https://github.com/roshhellwett/projectsentinel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-button hover:underline flex items-center gap-0.5 font-sans font-bold ml-auto"
          >
            <span>Inspect Repo</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
