"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export function CommitHeatmap() {
  const seed = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;
  const cols = 26;
  const rows = 7;
  const cells: { level: number }[] = Array.from({ length: cols * rows }, (_, i) => {
    const r = seed(i);
    const recencyBoost = (i % cols) / cols;
    const v = r * 0.65 + recencyBoost * 0.35;
    let level = 0;
    if (v > 0.85) level = 4;
    else if (v > 0.7) level = 3;
    else if (v > 0.5) level = 2;
    else if (v > 0.3) level = 1;
    return { level };
  });

  const levelClass = ["bg-slate-100", "bg-emerald-200", "bg-emerald-300", "bg-emerald-400", "bg-emerald-600"];

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
            className={`aspect-square rounded-[3px] ${levelClass[c.level]}`}
          />
        ))}
      </div>
    </div>
  );
}
