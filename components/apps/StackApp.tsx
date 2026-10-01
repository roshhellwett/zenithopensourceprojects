"use client";

import React, { useState } from 'react';
import { Sliders, CheckCircle, AlertCircle, Cpu } from 'lucide-react';
import { STACK } from "@/data/stack";
import { SoundType } from '@/lib/audio';

export default function StackApp({ playRetroSound, addToast }: { playRetroSound: (type: SoundType) => void, addToast: (msg: string) => void }) {
  const [moduleState, setModuleState] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    STACK.forEach((group) => {
      initial[group.category] = true;
    });
    return initial;
  });

  const toggleModule = (category: string) => {
    playRetroSound("toggle");
    const nextState = !moduleState[category];
    setModuleState((prev) => ({ ...prev, [category]: nextState }));
    addToast(`${category} module gate: ${nextState ? "ONLINE" : "BYPASS"}`);
  };

  const activeCount = Object.values(moduleState).filter(Boolean).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header bar */}
      <div className="bg-dark-surface/90 border-l-4 border-amber-button p-3.5 sm:p-5 rounded-r flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-dark-border/80 shadow-sm">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-dark-text flex items-center gap-2 uppercase font-mono tracking-wide">
            <Sliders className="w-4 h-4 text-amber-button" />
            <span>Interactive Tech Stack Gates</span>
          </h3>
          <p className="text-xs text-dark-text-muted mt-1 leading-relaxed">
            Inspect the dynamic tech stack clusters. Toggle gates locally to simulate offline fallback compilation pipelines.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-dark-elevated px-3 py-1.5 rounded-lg border border-dark-border-subtle font-mono text-[11px] shrink-0">
          <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
          <span className="font-bold text-dark-text">{activeCount} / {STACK.length} Gates Online</span>
        </div>
      </div>

      {/* Modules Table */}
      <div className="bg-dark-surface/90 border border-dark-border/80 rounded-xl overflow-hidden shadow-sm">
        <div className="hidden sm:grid bg-dark-elevated p-2.5 text-[11px] font-mono text-dark-text-muted grid-cols-12 gap-0 border-b border-dark-border select-none">
          <div className="col-span-4 font-bold">STACK SPECTRUM MODULE</div>
          <div className="col-span-5">CORE CAPABILITY ITEMS</div>
          <div className="col-span-3 text-center">GATE STATUS</div>
        </div>

        <div className="divide-y divide-dark-border-subtle">
          {STACK.map((group) => {
            const isOnline = moduleState[group.category] !== false;
            return (
              <div
                key={group.category}
                className="p-3 sm:p-3.5 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-0 items-start sm:items-center hover:bg-dark-elevated/60 transition-colors"
              >
                <div className="sm:col-span-4 w-full">
                  <span className="font-mono text-[11px] sm:text-xs font-bold text-dark-text bg-dark-elevated px-2 py-0.5 rounded border border-dark-border-subtle inline-block truncate max-w-full">
                    {group.category}
                  </span>
                </div>
                
                <div className="sm:col-span-5 text-[11px] sm:text-xs text-dark-text-muted pr-0 sm:pr-4 leading-relaxed font-semibold w-full">
                  <span className="sm:hidden text-[10px] text-dark-text-faint font-mono uppercase mr-1">Items:</span>
                  <span className="break-words">{group.items.join(", ")}</span>
                </div>

                <div className="sm:col-span-3 flex justify-start sm:justify-center w-full">
                  <button
                    onClick={() => toggleModule(group.category)}
                    className={`w-full sm:w-auto px-4 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5 min-h-[36px] ${
                      isOnline
                        ? "bg-accent-teal/15 text-accent-teal border-accent-teal/40 hover:bg-accent-teal/25 font-black shadow-sm"
                        : "bg-amber-button/10 text-amber-button border-amber-button/30 hover:bg-amber-button/20 font-bold"
                    }`}
                  >
                    {isOnline ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-accent-teal" />
                        <span>ONLINE</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 text-amber-button" />
                        <span>BYPASS</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated evaluation console */}
      <div className="bg-[#1c1d18] text-[#c9bfa8] p-3.5 sm:p-4 border border-dark-border rounded-xl space-y-2.5 font-mono text-xs shadow-md">
        <div className="flex items-center justify-between border-b border-[#35372d] pb-2 text-[10px] text-dark-text-faint">
          <span className="flex items-center gap-1.5 text-accent-teal font-bold uppercase">
            <Cpu className="w-3.5 h-3.5" /> Runtime Evaluation Sandbox
          </span>
          <span className="text-[#a09a89]">Deterministic Execution: 8.2ms</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="text-[11px] text-[#c9bfa8] leading-relaxed">
            <span className="text-amber-button font-bold block mb-1">&gt; Pipeline Status Diagnostic:</span>
            Active runtime loaded <span className="font-bold text-accent-teal">{activeCount} core clusters</span>. All telemetry events stream through local memory channels.
          </div>

          <div className="bg-[#11120f] p-2.5 rounded-lg border border-[#2b2d24]">
            <span className="text-[9px] uppercase text-dark-text-faint block mb-1">Live Module Check:</span>
            <code className="text-[10px] text-amber-button block leading-normal">
              {`zenith.isOperational('All Gates')`} →{" "}
              <span className={`font-bold ${activeCount === STACK.length ? "text-accent-teal" : "text-amber-button"}`}>
                {activeCount === STACK.length ? "TRUE (OPTIMAL)" : `PARTIAL (${activeCount}/${STACK.length})`}
              </span>
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
