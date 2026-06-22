"use client";

import { motion } from "framer-motion";
import { Github, Eye, Users, Workflow, Filter } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { spring } from "@/lib/animations";
import { CATEGORIES } from "@/data/categories";
import type { CategoryId } from "@/types";

export function EcosystemDiagram({
  active,
  onSelect,
  countsByCategory,
}: {
  active: CategoryId | "all";
  onSelect: (id: CategoryId | "all") => void;
  countsByCategory: Record<string, number>;
}) {
  const cats = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <div className="grain relative rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-xl p-4 sm:p-6 md:p-8 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_12px_32px_-12px_rgba(0,0,0,0.5)]">
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-500/5 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/5 blur-[80px]" />

      <div className="relative flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center mb-5 md:mb-8">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-slate-400 shadow-[inset_0_1px_2px_-1px_rgba(255,255,255,0.01)]">
            <Workflow size={14} />
          </span>
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400">Ecosystem Map</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold tracking-[0.18em] sm:tracking-[0.25em] uppercase text-slate-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
          </span>
          Live · Synced from GitHub
        </div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-10 items-center">
        <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="lineGrad_eco" x1="0" x2="1">
              <stop offset="0%" stopColor="rgba(30, 41, 59, 0.1)" />
              <stop offset="50%" stopColor="rgba(56, 189, 248, 0.25)" />
              <stop offset="100%" stopColor="rgba(30, 41, 59, 0.1)" />
            </linearGradient>
          </defs>
          {[20, 35, 50, 65, 80].map((y, i) => (
            <line key={`l${i}`} x1="18" y1={y} x2="50" y2="50" stroke="url(#lineGrad_eco)" strokeWidth="0.4" strokeDasharray="1 1.5" />
          ))}
          {[30, 50, 70].map((y, i) => (
            <line key={`r${i}`} x1="50" y1="50" x2="82" y2={y} stroke="url(#lineGrad_eco)" strokeWidth="0.4" strokeDasharray="1 1.5" />
          ))}
        </svg>

        <div className="relative z-10 grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2">
          {cats.map((c, i) => {
            const isActive = active === c.id;
            return (
              <motion.button key={c.id} type="button" onClick={() => onSelect(isActive ? "all" : c.id)}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06, ...spring }}
                className={`touch-target group flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-sky-500 focus-visible:outline-offset-2 ${
                  isActive
                    ? "bg-slate-900 border-slate-700 shadow-[inset_0_1px_2px_-1px_rgba(255,255,255,0.04)]"
                    : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:shadow-[inset_0_1px_2px_-1px_rgba(255,255,255,0.02)]"
                }`}>
                <span className={`p-1.5 rounded-lg border transition-colors ${isActive ? "border-slate-700 bg-slate-950 text-accent-1" : "border-slate-800/80 bg-slate-900/80 text-slate-400 group-hover:text-slate-200"}`}>{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-[11px] font-bold tracking-wide truncate ${isActive ? "text-white" : "text-slate-300 group-hover:text-white"}`}>{c.label}</div>
                  <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-slate-500">{countsByCategory[c.id] || 0} repos</div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="relative z-10 flex justify-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={spring} className="relative">
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-slate-950 flex flex-col items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.8)] border border-slate-800/80">
              <BrandMark size={64} rounded="rounded-2xl" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-850 text-[9px] font-bold tracking-[0.15em] uppercase text-slate-400 shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap">
                Zenith Core
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-2.5">
          {[
            { label: "GitHub Repos", value: `${Object.values(countsByCategory).reduce((a, b) => a + b, 0) || 9}+ Public`, icon: <Github size={14} /> },
            { label: "Live Demos", value: "Sentinel · ZeroGapVote", icon: <Eye size={14} /> },
            { label: "Community", value: "Stars · Forks · PRs", icon: <Users size={14} /> },
          ].map((o, i) => (
            <motion.div key={o.label} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08, ...spring }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-800/80 bg-slate-950/60 shadow-[inset_0_1px_2px_-1px_rgba(255,255,255,0.01)] hover:bg-slate-900/60 hover:border-slate-700/60 transition-all duration-200">
              <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-400">{o.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold tracking-[0.15em] text-slate-200 truncate">{o.label}</div>
                <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-500 truncate">{o.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2 text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase text-slate-500">
        <span className="flex items-center gap-1.5"><Filter size={10} className="text-slate-400" /> Tap a category to filter the grid below</span>
        <span className="text-slate-400">{active === "all" ? "Showing all projects" : `Filtering: ${CATEGORIES.find((c) => c.id === active)?.label}`}</span>
      </div>
    </div>
  );
}
