"use client";

import React from 'react';
import { Sliders } from 'lucide-react';
import { STACK } from "@/data/stack";
import { SoundType } from '@/lib/audio';

export default function StackApp({ playRetroSound, addToast }: { playRetroSound: (type: SoundType) => void, addToast: (msg: string) => void }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-dark-surface border-l-4 border-amber-button p-3 sm:p-4 rounded-r flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border border-dark-border">
        <div>
          <h3 className="text-sm font-bold text-dark-text flex items-center gap-1.5 uppercase font-mono">
            <Sliders className="w-4 h-4 text-amber-button" />
            <span>Core Module Gates</span>
          </h3>
          <p className="text-xs text-dark-text-muted mt-1 leading-normal">
            Inspect the dynamic tech stack clusters. Toggle modules locally to test fallback offline compilation frameworks.
          </p>
        </div>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded overflow-hidden">
        <div className="hidden sm:grid bg-dark-elevated p-2.5 text-[11px] font-mono text-dark-text-muted grid-cols-12 gap-0 border-b border-dark-border select-none">
          <div className="col-span-4 font-bold">STACK SPECTRUM MODULE</div>
          <div className="col-span-5">CORE CAPABILITY ITEMS</div>
          <div className="col-span-3 text-center">GATE STATUS</div>
        </div>

        <div className="divide-y divide-dark-border-subtle">
          {STACK.map((group) => (
            <div
              key={group.category}
              className="p-3 sm:p-3.5 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-0 items-start sm:items-center hover:bg-dark-elevated/50 transition-colors"
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
                  onClick={() => {
                    playRetroSound("toggle");
                    addToast(`Toggled ${group.category} runtime scope context!`);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-1.5 rounded text-xs font-bold border cursor-pointer bg-accent-teal/10 text-accent-teal border-accent-teal/30 font-extrabold hover:bg-accent-teal/20 transition-colors text-center min-h-[44px] sm:min-h-0"
                >
                  LOADED (OK)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client evaluation block */}
      <div className="bg-dark-elevated p-3 sm:p-4 border border-dark-border rounded">
        <h4 className="font-bold text-xs font-mono uppercase text-dark-text mb-2">Simulated evaluation console</h4>
        
        <div className="bg-dark-bg p-3 border border-dark-border rounded grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs font-sans">
          <div>
            <span className="font-bold text-dark-text-muted block">Live Environment Evaluations:</span>
            <p className="text-dark-text-muted mt-1">
              Our active pipeline validated <span className="font-mono font-bold text-cobalt">3 core stacks</span> and translated JavaScript interfaces into retro CRT visuals inside 8.4ms.
            </p>
          </div>

          <div className="flex flex-col justify-center bg-dark-surface p-2.5 border border-dark-border-subtle rounded">
            <span className="text-[10px] uppercase font-mono text-dark-text-faint mb-1">Evaluating runtime test snippet:</span>
            <code className="font-mono text-[9px] sm:text-[10px] text-amber-button block leading-normal break-all">
              {`zenith.isModuleLoaded('Web & Interface Ecosystem')`} → <span className="font-bold text-accent-teal">TRUE</span>
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
