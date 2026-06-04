"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      className="mb-6 sm:mb-8"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200/50" />
        <span className="text-center text-[8px] font-bold tracking-[0.3em] uppercase text-slate-400 select-none">
          {eyebrow}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200/50" />
      </motion.div>
      <motion.h2
        variants={fadeUp}
        className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.08]"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="mt-2.5 text-sm md:text-[15px] text-slate-500 max-w-xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
