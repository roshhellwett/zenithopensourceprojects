"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  scriptTitle = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  scriptTitle?: boolean;
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="mb-8 sm:mb-10"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
        <span className="text-center text-[9px] font-semibold tracking-[0.25em] uppercase text-white/30 select-none">
          {eyebrow}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
      </motion.div>
      <motion.h2
        variants={fadeUp}
        className={scriptTitle 
          ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-dancing font-normal tracking-normal pb-2" 
          : "text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.02em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 leading-tight"
        }
      >
        {scriptTitle ? (
          <span className="relative inline-flex overflow-hidden">
            <span 
              className="inline-block whitespace-nowrap overflow-hidden pr-2 glass-tube-hero"
              data-text={title}
            >
              {title}
            </span>
          </span>
        ) : (
          title
        )}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="mt-3 text-sm md:text-[15px] text-white/35 max-w-xl leading-relaxed tracking-[-0.005em]"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
