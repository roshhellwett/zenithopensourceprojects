"use client";

import { motion } from "framer-motion";
import { Flag, Sparkles, Bot, Terminal, Cpu, Workflow, FolderGit2, Star, ArrowUpRight } from "lucide-react";
import { TrafficLights } from "@/components/TrafficLights";
import { spring, fadeUp } from "@/lib/animations";
import type { Repo } from "@/types";

const categoryIcon: Record<string, React.ReactNode> = {
  civic: <Flag size={18} />,
  ai: <Sparkles size={18} />,
  bots: <Bot size={18} />,
  linux: <Terminal size={18} />,
  systems: <Cpu size={18} />,
  tools: <Workflow size={18} />,
};

export function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const icon = categoryIcon[repo.category] ?? <FolderGit2 size={18} />;

  return (
    <motion.a
      href={repo.link}
      target="_blank"
      rel="noreferrer"
      variants={fadeUp}
      transition={{ ...spring, delay: index * 0.04 }}
      className="group block h-full"
      aria-label={`${repo.displayName} — ${repo.desc}. Built with ${repo.lang}. View on GitHub.`}
    >
      <div className="grain relative h-full liquid-glass rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] hover:border-white/[0.12] hover:shadow-[0_16px_40px_-12px_rgba(56,189,248,0.1)] hover:-translate-y-1">
        <div className="liquid-glass-shine" />
        <div className="liquid-glass-sheen" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent-1/5 via-transparent to-accent-3/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative px-4 sm:px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <TrafficLights />
          <span className="text-[9px] font-semibold text-white/30 tracking-[0.15em] uppercase truncate ml-3">
            {repo.name}.sh
          </span>
          <div className="flex items-center gap-1 text-[10px] text-white/40 font-semibold">
            {typeof repo.stars === "number" && (
              <>
                <Star size={10} className="fill-amber-400/80 text-amber-400/80" />
                {repo.stars}
              </>
            )}
          </div>
        </div>

        <div className="relative p-4 sm:p-5 flex flex-col h-[calc(100%-45px)]">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="shrink-0 p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] text-white/40 transition-all duration-300 group-hover:text-accent-1 group-hover:border-white/[0.12] group-hover:scale-105">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-black tracking-[-0.01em] text-white leading-tight">
                {repo.displayName}
              </h3>
              <div className="mt-0.5 text-[9px] font-semibold tracking-[0.15em] uppercase text-white/25">
                Open Source · MIT
              </div>
            </div>
          </div>

          <p className="text-[13px] sm:text-sm leading-relaxed text-white/50 mb-5 flex-1">{repo.desc}</p>

          <div className="flex items-center justify-between gap-3 mt-auto pt-3.5 border-t border-white/[0.06]">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-3" />
              {repo.lang}
            </span>
            <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-white/30 group-hover:text-white transition-colors duration-200">
              View repo <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
