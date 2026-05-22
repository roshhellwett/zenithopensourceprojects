"use client";

import { useReducedMotion, motion } from "framer-motion";
import { spring } from "@/lib/animations";

export function LifecycleLoop() {
  const reduce = useReducedMotion();
  const stages = [
    { label: "Build", angle: -90, accent: "amber" },
    { label: "Ship", angle: 0, accent: "emerald" },
    { label: "Open", angle: 90, accent: "sky" },
    { label: "Iterate", angle: 180, accent: "rose" },
  ];

  const polar = (angle: number, r: number) => ({
    x: 50 + r * Math.cos((angle * Math.PI) / 180),
    y: 50 + r * Math.sin((angle * Math.PI) / 180),
  });

  return (
    <div className="relative aspect-square w-full max-w-[300px] sm:max-w-[360px] md:max-w-[420px] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="loopGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(255,255,255)" />
            <stop offset="100%" stopColor="rgb(248,250,252)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="42" fill="url(#loopGlow)" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(15,23,42)" strokeOpacity="0.08" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="36" fill="none" stroke="rgb(15,23,42)" strokeOpacity="0.18" strokeWidth="0.4" strokeDasharray="0.7 1.2" />
        <circle cx="50" cy="50" r="14" fill="white" stroke="rgb(15,23,42)" strokeOpacity="0.1" strokeWidth="0.3" />

        {!reduce && (
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "50px 50px" }}>
            <circle cx="50" cy="14" r="1.4" fill="rgb(245,158,11)" />
            <circle cx="50" cy="14" r="2.6" fill="rgb(245,158,11)" fillOpacity="0.25" />
          </motion.g>
        )}

        {stages.map((s, i) => {
          const p = polar(s.angle, 36);
          return (
            <g key={s.label}>
              <motion.circle cx={p.x} cy={p.y} r="3.5" fill="white" stroke="rgb(15,23,42)" strokeOpacity="0.25" strokeWidth="0.4"
                initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.15, ...spring }} style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
              {!reduce && (
                <motion.circle cx={p.x} cy={p.y} r="3.5" fill="none" stroke="rgb(15,23,42)" strokeOpacity="0.4" strokeWidth="0.3"
                  animate={{ r: [3.5, 6, 3.5], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }} />
              )}
            </g>
          );
        })}
      </svg>

      {stages.map((s) => {
        const p = polar(s.angle, 43);
        return (
          <div key={`label-${s.label}`} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 sm:px-2.5 rounded-full bg-white/90 border border-slate-200/60 text-slate-700 text-[9px] sm:text-[10px] font-bold tracking-[0.12em] sm:tracking-[0.15em] uppercase shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] whitespace-nowrap">
              <span className="w-1 h-1 rounded-full bg-slate-400/60" />
              {s.label}
            </span>
          </div>
        );
      })}

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-[8px] font-bold tracking-[0.3em] uppercase text-slate-400">Open Source</div>
        <div className="text-sm font-bold tracking-tight text-slate-800">Lifecycle</div>
      </div>
    </div>
  );
}
