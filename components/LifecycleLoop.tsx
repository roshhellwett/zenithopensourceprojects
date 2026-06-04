"use client";

import { motion } from "framer-motion";
import { spring } from "@/lib/animations";

export function LifecycleLoop() {
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
    <div className="relative aspect-square w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px] mx-auto p-2">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="loopGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(255,255,255)" />
            <stop offset="100%" stopColor="rgb(248,250,252)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="url(#loopGlow)" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(15,23,42)" strokeOpacity="0.06" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="rgb(15,23,42)" strokeOpacity="0.12" strokeWidth="0.3" strokeDasharray="0.6 1" />
        <circle cx="50" cy="50" r="12" fill="white" stroke="rgb(15,23,42)" strokeOpacity="0.08" strokeWidth="0.25" />

        {/* Static accent dot */}
        <circle cx="50" cy="16" r="1.2" fill="rgb(245,158,11)" />
        <circle cx="50" cy="16" r="2.2" fill="rgb(245,158,11)" fillOpacity="0.2" />

        {stages.map((s, i) => {
          const p = polar(s.angle, 34);
          return (
            <motion.circle key={s.label} cx={p.x} cy={p.y} r="3" fill="white" stroke="rgb(15,23,42)" strokeOpacity="0.2" strokeWidth="0.3"
              initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, ...spring }} style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
          );
        })}
      </svg>

      {stages.map((s) => {
        const p = polar(s.angle, 37);
        return (
          <div key={`label-${s.label}`} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/90 border border-slate-200/50 text-slate-600 text-[7px] sm:text-[8px] font-bold tracking-[0.12em] uppercase shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8)] whitespace-nowrap">
              <span className="w-0.5 h-0.5 rounded-full bg-slate-400/50" />
              {s.label}
            </span>
          </div>
        );
      })}

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-[6px] sm:text-[7px] font-bold tracking-[0.3em] uppercase text-slate-400">Open Source</div>
        <div className="text-[10px] sm:text-xs font-bold tracking-tight text-slate-800">Lifecycle</div>
      </div>
    </div>
  );
}
