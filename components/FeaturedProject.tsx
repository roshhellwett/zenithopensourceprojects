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
    <div ref={containerRef} className="p-4 sm:p-5 font-mono text-[10px] sm:text-[11px] md:text-xs space-y-2 text-white/80 overflow-hidden min-h-[140px]">
      {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {line.type === "command" && (
            <div><span className="text-amber-300">$</span> {line.text}</div>
          )}
          {line.type === "output" && (
            <div className="text-white/50">
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
            <div className="text-emerald-300 flex items-center gap-2">
              <CheckCircle2 size={12} /> {line.text.replace("✓ ", "")}
            </div>
          )}
        </motion.div>
      ))}
      {visibleLines < TERMINAL_LINES.length && hasStarted && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="inline-block w-1.5 h-3 bg-amber-300/70 rounded-[1px]"
        />
      )}
      {visibleLines >= TERMINAL_LINES.length && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="pt-3 grid grid-cols-3 gap-1.5 sm:gap-2"
        >
          {["AI", "TS", "Next", "Edge", "RSS", "NLP"].map((t) => (
            <span key={t}
              className="text-center px-1.5 sm:px-2 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.12] text-white/70 text-[9px] sm:text-[10px] font-bold tracking-[0.1em] sm:tracking-[0.15em] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-white/[0.1] transition-colors duration-200">
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
      <div className="grain relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/50 ring-1 ring-slate-200/30 bg-gradient-to-br from-amber-50/80 via-white/65 to-emerald-50/80 backdrop-blur-lg backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        <div className="absolute top-0 left-0 right-0 h-px bg-slate-200/50" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-200/40 blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-200/40 blur-[100px]" />

        <div className="relative grid md:grid-cols-[1.2fr_1fr] gap-6 md:gap-8 p-5 sm:p-6 md:p-10">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5">
              <Pill><Sparkles size={10} /> Featured · Latest</Pill>
              <Pill><Flag size={10} /> Made for Bharat</Pill>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight md:leading-[0.95]">
              {repo.displayName}
            </h3>
            <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase text-slate-400">
              AI · News Intelligence · {repo.lang}
            </div>

            <p className="mt-4 sm:mt-5 text-[15px] md:text-lg text-slate-500 leading-relaxed max-w-xl">
              {repo.desc}
            </p>

            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:flex sm:flex-wrap gap-3">
              {repo.homepage && (
                <a href={repo.homepage} target="_blank" rel="noreferrer"
                  className="touch-target inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-orange-400 focus-visible:outline-offset-2">
                  <Eye size={16} /> Live Demo <ArrowUpRight size={16} />
                </a>
              )}
              <a href={repo.link} target="_blank" rel="noreferrer"
                className="touch-target inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/90 border border-slate-200/60 text-slate-700 font-bold text-sm hover:bg-white transition-all duration-200 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2">
                <Github size={16} /> Source Code <ChevronRight size={16} />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-slate-900/80 bg-slate-950 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="px-4 py-2.5 border-b border-white/[0.07] flex items-center justify-between bg-slate-900/60">
                <TrafficLights />
                <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/40">sentinel ~ live</span>
                <div className="w-10" />
              </div>
              <TypingTerminal />
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
              <Shield size={12} /> MIT Licensed · Built in India · Public good
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
