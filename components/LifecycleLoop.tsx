"use client";

import React from "react";

export function LifecycleLoop() {
  const codeLines = [
    { num: "01", content: <><span className="text-pink-500">import</span> {"{"} <span className="text-sky-400">Zenith</span> {"}"} <span className="text-pink-500">from</span> <span className="text-emerald-400">{"\"@zenith/core\""}</span>;</> },
    { num: "02", content: <>&nbsp;</> },
    { num: "03", content: <><span className="text-pink-500">export default</span> <span className="text-sky-400">Zenith</span>.<span className="text-teal-400">configure</span>({"{"}</> },
    { num: "04", content: <>&nbsp;&nbsp;engine: <span className="text-emerald-400">{"\"v2.4-IN\""}</span>,</> },
    { num: "05", content: <>&nbsp;&nbsp;threads: <span className="text-violet-400">8</span>,</> },
    { num: "06", content: <>&nbsp;&nbsp;metrics: [<span className="text-emerald-400">{"\"git\""}</span>, <span className="text-emerald-400">{"\"cli\""}</span>],</> },
    { num: "07", content: <>&nbsp;</> },
    { num: "08", content: <>&nbsp;&nbsp;<span className="text-pink-500">async</span> <span className="text-teal-400">onTick</span>(ctx) {"{"}</> },
    { num: "09", content: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-500">const</span> logs = <span className="text-pink-500">await</span> ctx.<span className="text-teal-400">fetch</span>();</> },
    { num: "10", content: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-500">return</span> ctx.<span className="text-teal-400">broadcast</span>(logs);</> },
    { num: "11", content: <>&nbsp;&nbsp;{"}"}</> },
    { num: "12", content: <>{"});"}</> }
  ];

  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto bg-[#02040a] rounded-xl border border-slate-900 overflow-hidden font-mono shadow-2xl relative select-none">
      {/* IDE Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/60 border-b border-slate-900/80">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-500/70" />
          <div className="w-2 h-2 rounded-full bg-amber-500/70" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
        </div>
        <span className="text-[9px] text-slate-500 font-bold tracking-wider">config.ts</span>
        <div className="w-8" />
      </div>

      {/* Editor Body */}
      <div className="p-3 text-[10px] sm:text-[11px] leading-relaxed text-slate-300 overflow-x-auto">
        {codeLines.map((line) => (
          <div key={line.num} className="flex items-start">
            <span className="w-5 shrink-0 text-right pr-2 text-slate-600 select-none">{line.num}</span>
            <code className="text-slate-300 font-medium whitespace-nowrap">{line.content}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
