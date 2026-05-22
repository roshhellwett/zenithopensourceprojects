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
    >
      <div className="grain relative h-full bg-white/65 hover:bg-white/80 backdrop-blur-lg backdrop-saturate-150 border border-white/50 ring-1 ring-slate-200/30 hover:ring-slate-300/40 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_24px_-16px_rgba(15,23,42,0.1)]">
        <div className="pointer-events-none absolute -inset-px rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-slate-200/30 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 to-transparent" />

        <div className="relative px-4 sm:px-5 py-3 border-b border-slate-200/50 flex items-center justify-between">
          <TrafficLights />
          <span className="text-[9px] font-bold text-slate-400 tracking-[0.15em] uppercase truncate ml-3">
            {repo.name}.sh
          </span>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
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
            <div className="shrink-0 p-2.5 rounded-xl border border-slate-200/60 bg-white/80 text-slate-500 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] transition-all duration-200 group-hover:shadow-[inset_0_2px_4px_-1px_rgba(15,23,42,0.08)]">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-black tracking-tight text-slate-900 leading-tight">
                {repo.displayName}
              </h3>
              <div className="mt-0.5 text-[9px] font-bold tracking-[0.15em] uppercase text-slate-400">
                Open Source · MIT
              </div>
            </div>
          </div>

          <p className="text-[13px] sm:text-sm leading-relaxed text-slate-500 mb-5 flex-1">{repo.desc}</p>

          <div className="flex items-center justify-between gap-3 mt-auto pt-3.5 border-t border-slate-200/50">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-500">
              <span className="w-1 h-1 rounded-full bg-slate-400" />
              {repo.lang}
            </span>
            <div className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-slate-800 transition-colors duration-200">
              View repo <ArrowUpRight size={13} />
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
