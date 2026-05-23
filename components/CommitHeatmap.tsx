"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function CommitHeatmap() {
  const seed = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;
  const cols = 26;
  const rows = 7;
  const cells: { level: number; commits: number }[] = Array.from({ length: cols * rows }, (_, i) => {
    const r = seed(i);
    const recencyBoost = (i % cols) / cols;
    const v = r * 0.65 + recencyBoost * 0.35;
    let level = 0;
    let commits = 0;
    if (v > 0.85) { level = 4; commits = Math.round(8 + r * 12); }
    else if (v > 0.7) { level = 3; commits = Math.round(4 + r * 6); }
    else if (v > 0.5) { level = 2; commits = Math.round(2 + r * 3); }
    else if (v > 0.3) { level = 1; commits = Math.round(1 + r * 2); }
    return { level, commits };
  });

  const levelClass = ["bg-slate-100", "bg-emerald-200", "bg-emerald-300", "bg-emerald-400", "bg-emerald-600"];
  const dayNames = ["Mon", "", "Wed", "", "Fri", "", ""];

  const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number } | null>(null);

  return (
    <div className="grain relative overflow-hidden rounded-2xl border border-white/50 ring-1 ring-slate-200/30 bg-white/65 backdrop-blur-lg backdrop-saturate-150 p-3 sm:p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-slate-500">
            <Zap size={11} />
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase text-slate-500">
            Commit Cadence · Last 26 weeks
          </span>
        </div>
        <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-slate-400">
          Less <span className="inline-flex gap-[2px] mx-1 align-middle">
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} className={`w-[5px] h-[5px] rounded-[1px] ${levelClass[l]}`} />
            ))}
          </span> More
        </span>
      </div>

      <div className="relative">
        <div
          className="grid gap-[2px]"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {cells.map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: (i / cells.length) * 0.4 }}
              className={`aspect-square rounded-[3px] cursor-default transition-transform duration-150 hover:scale-[1.6] hover:z-10 relative ${levelClass[c.level]}`}
              onMouseEnter={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                const parent = (e.target as HTMLElement).closest('.relative')?.getBoundingClientRect();
                if (parent) {
                  setTooltip({
                    index: i,
                    x: rect.left - parent.left + rect.width / 2,
                    y: rect.top - parent.top - 4,
                  });
                }
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
        </div>

        {/* Tooltip */}
        {tooltip !== null && (
          <div
            className="absolute pointer-events-none z-20 px-2 py-1 rounded-lg bg-slate-900 text-white text-[9px] font-bold tracking-wide shadow-lg whitespace-nowrap -translate-x-1/2 -translate-y-full"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {cells[tooltip.index].commits} commits
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-slate-900" />
          </div>
        )}
      </div>
    </div>
  );
}
