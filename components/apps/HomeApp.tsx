"use client";

import React, { useState } from 'react';
import { FileCode, ArrowUpRight, Play, Terminal, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { playRetroSound } from '@/lib/audio';

export default function HomeApp() {
  const [runningSentinel, setRunningSentinel] = useState(false);
  const [sentinelOutput, setSentinelOutput] = useState<string[]>([
    "[READY] Press 'Run Live Scraper Simulator' to test the NLP pipeline."
  ]);

  const runSentinelDemo = () => {
    if (runningSentinel) return;
    playRetroSound("click");
    setRunningSentinel(true);
    setSentinelOutput(["[INIT] Establishing optical connection to civic RSS feeds..."]);

    const steps = [
      "[FETCH] Polling 14 verified Indian open data streams...",
      "[NLP] Analyzing headline: 'Open-source election integrity blueprint released'",
      "[SCORE] Neutrality metric: 96.4% · Clickbait probability: 1.8%",
      "[TAG] Classifier: CIVIC_GOVERNANCE_SYSTEMS (High confidence)",
      "[DISPATCH] Broadcast deterministic verified payload to client nodes.",
      "[COMPLETE] Pipeline cycle finished in 38ms. 0 external trackers."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSentinelOutput((prev) => [...prev, step]);
        playRetroSound("pop");
        if (idx === steps.length - 1) {
          setRunningSentinel(false);
          playRetroSound("success");
        }
      }, (idx + 1) * 320);
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Thesis Header */}
      <div className="bg-dark-surface/90 border-l-4 border-cobalt p-3.5 sm:p-5 rounded-r flex flex-col gap-2.5 border border-dark-border/80 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-dark-text flex items-center gap-2 uppercase font-mono tracking-wide">
            <FileCode className="w-4 h-4 text-cobalt shrink-0" />
            <span>The Zenith Open Source Thesis</span>
          </h3>
          <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono font-bold text-accent-teal bg-accent-teal/10 px-2 py-0.5 rounded border border-accent-teal/20">
            <CheckCircle2 className="w-3 h-3" /> VERIFIED BHARAT TECH
          </span>
        </div>
        <p className="text-xs sm:text-sm text-dark-text-muted leading-relaxed">
          Zenith is a digital registry and project showcase for civic‑tech platforms, low‑level systems interfaces, local automation pipelines, and developer utilities. Designed in India and optimized for deterministic, accessible, and public-first deployment models.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-dark-surface/90 border border-dark-border/80 p-3.5 sm:p-4 rounded-xl space-y-2 holo-card">
          <span className="text-[10px] font-mono text-dark-text-faint block border-b pb-1 border-dark-border-subtle uppercase flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-button" /> CORE THESIS 01 · SELF-RELIANCE
          </span>
          <h4 className="font-extrabold text-sm text-dark-text">Bharat First & Sovereignty</h4>
          <p className="text-xs text-dark-text-muted leading-relaxed">
            We prioritize building auditable digital voting blueprints, newsrooms filtering media bias, and utility scripts that empower students and system administrators locally without relying on proprietary structures.
          </p>
        </div>

        <div className="bg-dark-surface/90 border border-dark-border/80 p-3.5 sm:p-4 rounded-xl space-y-2 holo-card">
          <span className="text-[10px] font-mono text-dark-text-faint block border-b pb-1 border-dark-border-subtle uppercase flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-accent-teal" /> CORE THESIS 02 · ZERO LOCK-IN
          </span>
          <h4 className="font-extrabold text-sm text-dark-text">Transparent Architectures</h4>
          <p className="text-xs text-dark-text-muted leading-relaxed">
            All modules feature deterministic execution, clean scripts, and readable documentation. No hidden integrations, fully offline-compatible utility stacks, and free to audit forever.
          </p>
        </div>
      </div>

      {/* Featured Project & Interactive Simulator */}
      <div className="bg-dark-elevated/90 border border-dark-border/80 p-3.5 sm:p-5 rounded-xl space-y-3.5 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-2.5 border-dark-border-subtle gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-button animate-pulse" />
            <span className="font-mono text-xs font-bold text-dark-text">KEY REPOSITORY: PROJECT SENTINEL</span>
          </div>
          <span className="text-[10px] font-mono text-cobalt border border-cobalt/30 px-2 py-0.5 rounded bg-cobalt/10 font-bold whitespace-nowrap">
            AI News Classifier
          </span>
        </div>

        <p className="text-xs text-dark-text-muted leading-relaxed">
          Project Sentinel is an automated Indian news aggregator pipeline. It aggregates source RSS streams, isolates clickbait via lightweight NLP heuristics, classifying events dynamically in real-time.
        </p>

        {/* Live Interactive Terminal Simulator */}
        <div className="bg-[#1c1d18] text-[#c9bfa8] p-3 rounded-lg border border-dark-border font-mono text-[11px] space-y-2">
          <div className="flex items-center justify-between border-b border-[#35372d] pb-2 text-[10px] text-dark-text-faint">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-accent-teal" /> sentinel_nlp_daemon
            </span>
            <button
              onClick={runSentinelDemo}
              disabled={runningSentinel}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                runningSentinel
                  ? "bg-amber-button/30 text-amber-button cursor-wait"
                  : "bg-amber-button hover:bg-saffron-deep text-black active:scale-95"
              }`}
            >
              <Play className="w-3 h-3" />
              <span>{runningSentinel ? "Classifying..." : "Run Simulator"}</span>
            </button>
          </div>

          <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
            {sentinelOutput.map((line, i) => (
              <div
                key={i}
                className={
                  line.startsWith("[COMPLETE]") || line.startsWith("[TAG]")
                    ? "text-accent-teal font-bold"
                    : line.startsWith("[SCORE]")
                    ? "text-amber-button"
                    : "text-[#dcd5c4]"
                }
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1 font-mono text-[11px] text-dark-text-muted">
          <span>Lang: <b className="text-dark-text">TypeScript</b></span>
          <span>·</span>
          <span>Target: <b className="text-dark-text">Verifiable Newsroom</b></span>
          <span>·</span>
          <a
            href="https://github.com/roshhellwett/projectsentinel"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playRetroSound("click")}
            className="text-amber-button hover:underline flex items-center gap-0.5 font-sans font-bold ml-auto"
          >
            <span>Inspect Source</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
