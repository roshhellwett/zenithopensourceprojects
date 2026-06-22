"use client";

import { motion } from "framer-motion";
import { spring, fadeUp } from "@/lib/animations";
import type { PanelProps } from "@/types";

export function Panel({ children, className = "", delay = 0 }: PanelProps) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ ...spring, delay }}
      className={`grain group relative liquid-glass rounded-2xl overflow-hidden shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="liquid-glass-shine" />
      <div className="liquid-glass-sheen" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent-1/5 via-transparent to-accent-3/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
