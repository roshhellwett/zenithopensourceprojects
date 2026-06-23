"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  const levelClass = [
    "bg-slate-900/60 border border-slate-800/80",
    "bg-accent-3/20 border border-accent-3/20",
    "bg-accent-3/50 border border-accent-3/40",
    "bg-accent-3/80 shadow-[0_0_8px_rgba(45,212,191,0.4)]",
    "bg-accent-3 shadow-[0_0_15px_rgba(45,212,191,0.8)]"
  ];

  const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full h-full flex flex-col justify-center">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-500">
          Last 26 weeks
        </span>
        <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-slate-600 flex items-center">
          L <span className="inline-flex gap-[3px] mx-2 align-middle">
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} className={`w-[8px] h-[8px] rounded-sm ${levelClass[l]}`} />
            ))}
          </span> M
        </span>
      </div>

      <div className="relative w-full overflow-x-auto scrollbar-none">
        <div className="min-w-[520px] md:min-w-0 relative">
          <div
            ref={gridRef}
            className="grid gap-1 md:gap-[5px]"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridAutoFlow: "column",
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
          >
            {cells.map((c, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: (i / cells.length) * 0.4 }}
                className={`aspect-square rounded-[3px] cursor-default transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.8] hover:z-10 hover:shadow-[0_0_20px_rgba(45,212,191,1)] ${levelClass[c.level]}`}
                onMouseEnter={(e) => {
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  const parent = gridRef.current?.getBoundingClientRect();
                  if (parent) {
                    setTooltip({
                      index: i,
                      x: rect.left - parent.left + rect.width / 2,
                      y: rect.top - parent.top - 8,
                    });
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>

          <AnimatePresence>
            {tooltip !== null && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="absolute pointer-events-none z-20 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-[10px] font-black tracking-widest uppercase shadow-[0_10px_20px_-5px_rgba(0,0,0,0.8)] whitespace-nowrap -translate-x-1/2 -translate-y-full"
                style={{ left: tooltip.x, top: tooltip.y }}
              >
                <span className="text-accent-3">{cells[tooltip.index].commits}</span> commits
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-slate-800" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
