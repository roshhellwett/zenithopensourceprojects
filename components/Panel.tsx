"use client";

import { motion } from "framer-motion";
import { spring, fadeUp } from "@/lib/animations";
import { useMouseSpotlight } from "@/lib/useMouseSpotlight";
import type { PanelProps } from "@/types";

export function Panel({ children, className = "", delay = 0 }: PanelProps) {
  const { ref, x, y, isHovered, bind } = useMouseSpotlight();

  return (
    <motion.div
      ref={ref}
      {...bind}
      variants={fadeUp}
      transition={{ ...spring, delay }}
      className={`grain group relative liquid-glass rounded-2xl overflow-hidden shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] ${className}`}
    >
      <div className="liquid-glass-shine" />
      <div className="liquid-glass-sheen" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent-1/5 via-transparent to-accent-3/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {isHovered && (
        <>
          <div 
            className="pointer-events-none absolute inset-0 transition-opacity duration-500 opacity-100"
            style={{
              background: `radial-gradient(300px circle at ${x}px ${y}px, rgba(56,189,248,0.05), transparent 80%)`,
            }}
          />
          <div 
            className="absolute inset-0 pointer-events-none z-10 border border-transparent rounded-2xl transition-all duration-350"
            style={{
              borderColor: "transparent",
              backgroundImage: `radial-gradient(260px circle at ${x}px ${y}px, rgba(56,189,248,0.2), transparent 70%)`,
              WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              maskComposite: "exclude",
            }}
          />
        </>
      )}

      <div className="relative">{children}</div>
    </motion.div>
  );
}
