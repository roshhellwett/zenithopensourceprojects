"use client";

import { motion } from "framer-motion";
import { spring, fadeUp } from "@/lib/animations";
import type { PanelProps } from "@/types";

export function Panel({ children, className = "", delay = 0 }: PanelProps) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ ...spring, delay }}
      className={`grain relative bg-white/70 backdrop-blur-lg backdrop-saturate-150 border border-slate-200/50 ring-1 ring-slate-100/80 rounded-2xl overflow-hidden shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_3px_-1px_rgba(15,23,42,0.06)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/50 to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
