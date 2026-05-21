"use client";

import { useReducedMotion, motion } from "framer-motion";

export function BharatWave() {
  const reduce = useReducedMotion();
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-28 md:h-36"
      viewBox="0 0 200 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="saffronWave" x1="0" x2="1">
          <stop offset="0%" stopColor="rgb(251,146,60)" stopOpacity="0" />
          <stop offset="50%" stopColor="rgb(251,146,60)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(251,146,60)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="emeraldWave" x1="0" x2="1">
          <stop offset="0%" stopColor="rgb(16,185,129)" stopOpacity="0" />
          <stop offset="50%" stopColor="rgb(16,185,129)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(16,185,129)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M -10 30 Q 25 10 50 30 T 110 30 T 170 30 T 230 30"
        fill="none" stroke="url(#saffronWave)" strokeWidth="1" strokeLinecap="round"
        animate={reduce ? {} : { x: [0, -60, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
      <motion.path
        d="M -10 38 Q 25 58 50 38 T 110 38 T 170 38 T 230 38"
        fill="none" stroke="url(#emeraldWave)" strokeWidth="1" strokeLinecap="round"
        animate={reduce ? {} : { x: [0, 60, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />
      {!reduce && [
        { x: 20, d: 0 }, { x: 55, d: 1.5 }, { x: 90, d: 3 },
        { x: 120, d: 0.8 }, { x: 155, d: 2.4 }, { x: 180, d: 4 },
      ].map((p, i) => (
        <motion.circle key={i} cx={p.x} r="0.6"
          fill={i % 2 === 0 ? "rgb(251,146,60)" : "rgb(16,185,129)"}
          animate={{ cy: [50, 12, 50], opacity: [0, 0.8, 0] }}
          transition={{ duration: 6, delay: p.d, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </svg>
  );
}
