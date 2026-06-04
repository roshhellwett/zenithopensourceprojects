"use client";

import { useState, useRef } from "react";
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

  const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <div className="grain relative overflow-hidden rounded-xl border border-slate-200/50 ring-1 ring-slate-100/80 bg-white/70 backdrop-blur-lg backdrop-saturate-150 p-2.5 sm:p-3 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_3px_-1px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="p-1 rounded-md bg-white/80 border border-slate-200/50 text-slate-400 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8)]">
            <Zap size={9} />
          </span>
          <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-slate-400">
            Commit Cadence · Last 26 weeks
          </span>
        </div>
        <span className="text-[7px] font-bold tracking-[0.12em] uppercase text-slate-400">
          Less <span className="inline-flex gap-[1.5px] mx-1 align-middle">
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} className={`w-[4px] h-[4px] rounded-[1px] ${levelClass[l]}`} />
            ))}
          </span> More
        </span>
      </div>

      <div className="relative">
        <div
          ref={gridRef}
          className="grid gap-[1.5px]"
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
              transition={{ duration: 0.15, delay: (i / cells.length) * 0.3 }}
              className={`aspect-square rounded-[2px] cursor-default transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.8] hover:z-10 ${levelClass[c.level]}`}
              onMouseEnter={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                const parent = gridRef.current?.getBoundingClientRect();
                if (parent) {
                  setTooltip({
                    index: i,
                    x: rect.left - parent.left + rect.width / 2,
                    y: rect.top - parent.top - 3,
                  });
                }
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
        </div>

        {tooltip !== null && (
          <div
            className="absolute pointer-events-none z-20 px-2 py-1 rounded-md bg-slate-900 text-white text-[8px] font-bold tracking-wide shadow-[0_2px_8px_-2px_rgba(15,23,42,0.4)] whitespace-nowrap -translate-x-1/2 -translate-y-full"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {cells[tooltip.index].commits} commits
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-transparent border-t-slate-900" />
          </div>
        )}
      </div>
    </div>
  );
}
