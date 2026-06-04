"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Github, Eye, ArrowUpRight, Sparkles, Flag, ChevronRight, CheckCircle2, Shield } from "lucide-react";
import { Pill } from "@/components/Pill";
import { TrafficLights } from "@/components/TrafficLights";
import { spring, fadeUp } from "@/lib/animations";
import type { Repo } from "@/types";

const TERMINAL_LINES = [
  { text: "sentinel --pull --india", type: "command" as const },
  { text: "→ resolving sources... 200 OK", type: "output" as const, highlight: "200 OK" },
  { text: "→ classifying headlines (AI) ✓", type: "output" as const },
  { text: "→ cross-verifying with mirror feeds ✓", type: "output" as const },
  { text: "✓ 142 verified stories published", type: "success" as const },
];

function TypingTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasStarted) return;
    if (visibleLines >= TERMINAL_LINES.length) return;

    const delays = [0, 600, 400, 400, 500];
    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, delays[visibleLines] || 400);
    return () => clearTimeout(timer);
  }, [visibleLines, hasStarted]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="p-3 sm:p-4 font-mono text-[9px] sm:text-[10px] md:text-[11px] space-y-1.5 text-white/80 overflow-hidden min-h-[120px]">
      {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {line.type === "command" && (
            <div><span className="text-amber-300">$</span> {line.text}</div>
          )}
          {line.type === "output" && (
            <div className="text-white/45">
              {line.highlight ? (
                <>
                  {line.text.replace(line.highlight, "")}<span className="text-emerald-300">{line.highlight}</span>
                </>
              ) : (
                line.text
              )}
            </div>
          )}
          {line.type === "success" && (
            <div className="text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 size={10} /> {line.text.replace("✓ ", "")}
            </div>
          )}
        </motion.div>
      ))}
      {visibleLines < TERMINAL_LINES.length && hasStarted && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block w-1 h-2.5 bg-amber-300/70 rounded-[1px]"
        />
      )}
      {visibleLines >= TERMINAL_LINES.length && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.25 }}
          className="pt-2 grid grid-cols-3 gap-1"
        >
          {["AI", "TS", "Next", "Edge", "RSS", "NLP"].map((t) => (
            <span key={t}
              className="text-center px-1 py-1 rounded-md bg-white/[0.05] border border-white/[0.1] text-white/60 text-[8px] font-bold tracking-[0.12em] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.04)] hover:bg-white/[0.08] transition-colors duration-200">
              {t}
            </span>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function FeaturedProject({ repo }: { repo: Repo }) {
  return (
    <motion.div variants={fadeUp} transition={spring} className="relative">
      <div className="grain relative overflow-hidden rounded-2xl border border-slate-200/50 ring-1 ring-slate-100/80 bg-gradient-to-br from-amber-50/60 via-white/70 to-emerald-50/60 backdrop-blur-lg backdrop-saturate-150 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_3px_-1px_rgba(15,23,42,0.06)]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/40 to-transparent" />
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-200/30 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-200/30 blur-[80px]" />

        <div className="relative grid md:grid-cols-[1.2fr_1fr] gap-4 md:gap-6 p-4 sm:p-5 md:p-7">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <Pill><Sparkles size={8} /> Featured · Latest</Pill>
              <Pill><Flag size={8} /> Made for Bharat</Pill>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 leading-tight">
              {repo.displayName}
            </h3>
            <div className="mt-1.5 text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
              AI · News Intelligence · {repo.lang}
            </div>

            <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-xl">
              {repo.desc}
            </p>

            <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
              {repo.homepage && (
                <a href={repo.homepage} target="_blank" rel="noreferrer"
                  className="touch-target inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06),inset_0_-0.5px_0_rgba(0,0,0,0.2),0_2px_8px_-3px_rgba(15,23,42,0.2)]">
                  <Eye size={13} /> Live Demo <ArrowUpRight size={12} />
                </a>
              )}
              <a href={repo.link} target="_blank" rel="noreferrer"
                className="touch-target inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/90 border border-slate-200/60 text-slate-700 font-bold text-xs hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_2px_-1px_rgba(15,23,42,0.06)]">
                <Github size={13} /> Source Code <ChevronRight size={12} />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950 overflow-hidden shadow-[inset_0_0.5px_0_rgba(255,255,255,0.04),0_2px_8px_-3px_rgba(15,23,42,0.3)]">
              <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between bg-slate-900/60">
                <TrafficLights />
                <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-white/35">sentinel ~ live</span>
                <div className="w-8" />
              </div>
              <TypingTerminal />
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[9px] text-slate-400 font-medium">
              <Shield size={10} /> MIT Licensed · Built in India · Public good
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
