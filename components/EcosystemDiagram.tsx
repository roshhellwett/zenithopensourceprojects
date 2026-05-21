"use client";

import { useReducedMotion, motion } from "framer-motion";
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
  const reduce = useReducedMotion();
  const cats = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <div className="grain relative rounded-3xl border border-white/50 ring-1 ring-slate-200/30 bg-white/65 backdrop-blur-lg backdrop-saturate-150 p-6 md:p-8 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-100/40 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-100/40 blur-[80px]" />

      <div className="relative flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-slate-500 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)]">
            <Workflow size={14} />
          </span>
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400">Ecosystem Map</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
          </span>
          Live · Synced from GitHub
        </div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-center">
        <svg className="hidden md:block absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="lineGrad_eco" x1="0" x2="1">
              <stop offset="0%" stopColor="rgb(148 163 184 / 0.15)" />
              <stop offset="50%" stopColor="rgb(148 163 184 / 0.45)" />
              <stop offset="100%" stopColor="rgb(148 163 184 / 0.15)" />
            </linearGradient>
          </defs>
          {[20, 35, 50, 65, 80].map((y, i) => (
            <g key={`l${i}`}>
              <line x1="18" y1={y} x2="50" y2="50" stroke="url(#lineGrad_eco)" strokeWidth="0.4" strokeDasharray="1 1.5" />
              {!reduce && (
                <motion.circle r="0.7" fill="rgb(245 158 11)" initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], cx: [18, 50], cy: [y, 50] }}
                  transition={{ duration: 2.6, delay: i * 0.45, repeat: Infinity, ease: "easeInOut" }} />
              )}
            </g>
          ))}
          {[30, 50, 70].map((y, i) => (
            <g key={`r${i}`}>
              <line x1="50" y1="50" x2="82" y2={y} stroke="url(#lineGrad_eco)" strokeWidth="0.4" strokeDasharray="1 1.5" />
              {!reduce && (
                <motion.circle r="0.7" fill="rgb(16 185 129)" initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], cx: [50, 82], cy: [50, y] }}
                  transition={{ duration: 2.4, delay: 0.6 + i * 0.4, repeat: Infinity, ease: "easeInOut" }} />
              )}
            </g>
          ))}
        </svg>

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2">
          {cats.map((c, i) => {
            const isActive = active === c.id;
            return (
              <motion.button key={c.id} type="button" onClick={() => onSelect(isActive ? "all" : c.id)}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06, ...spring }}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2 ${
                  isActive
                    ? "bg-white/90 border-slate-300/60 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.06)]"
                    : "bg-white/80 border-slate-200/60 hover:bg-slate-50/80 hover:shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)]"
                }`}>
                <span className="p-1.5 rounded-lg border border-slate-200/60 bg-white/80 text-slate-500">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold tracking-wide text-slate-700 truncate">{c.label}</div>
                  <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-slate-400">{countsByCategory[c.id] || 0} repos</div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="relative z-10 flex justify-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={spring} className="relative">
            {!reduce && (
              <>
                <motion.div animate={{ scale: [1, 1.4], opacity: [0.5, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-3xl border-2 border-slate-300" />
                <motion.div animate={{ scale: [1, 1.6], opacity: [0.35, 0] }} transition={{ duration: 2.4, delay: 0.8, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-3xl border-2 border-slate-300" />
              </>
            )}
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-slate-900 flex flex-col items-center justify-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.3)] ring-1 ring-slate-700/40">
              <BrandMark size={64} rounded="rounded-2xl" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-white/90 border border-slate-200/60 text-[9px] font-bold tracking-[0.15em] uppercase text-slate-500 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] whitespace-nowrap">
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-200/60 bg-white/80 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] hover:shadow-[inset_0_2px_4px_-1px_rgba(15,23,42,0.08)] hover:bg-white transition-all duration-200">
              <span className="p-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-slate-500">{o.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold tracking-[0.15em] text-slate-800 truncate">{o.label}</div>
                <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400 truncate">{o.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative mt-8 pt-6 border-t border-slate-200/40 flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
        <span className="flex items-center gap-1.5"><Filter size={10} /> Tap a category to filter the grid below</span>
        <span>{active === "all" ? "Showing all projects" : `Filtering: ${CATEGORIES.find((c) => c.id === active)?.label}`}</span>
      </div>
    </div>
  );
}
