"use client";

import { motion } from "framer-motion";
import { spring, fadeUp } from "@/lib/animations";
import type { PanelProps } from "@/types";

export function Panel({ children, className = "", delay = 0 }: PanelProps) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ ...spring, delay }}
      className={`grain relative bg-white/65 backdrop-blur-lg backdrop-saturate-150 border border-white/50 ring-1 ring-slate-200/30 rounded-3xl overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/40 to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
