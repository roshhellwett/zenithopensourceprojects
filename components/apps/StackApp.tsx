import React from 'react';
import { Sliders } from 'lucide-react';
import { STACK } from "@/data/stack";
import { SoundType } from '@/lib/audio';

export default function StackApp({ playRetroSound, addToast }: { playRetroSound: (type: SoundType) => void, addToast: (msg: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-dark-surface border-l-4 border-amber-button p-4 rounded-r flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-dark-border">
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
        <div className="bg-dark-elevated p-2 text-[11px] font-mono text-dark-text-muted grid grid-cols-12 border-b border-dark-border select-none">
          <div className="col-span-4">STACK SPECTRUM MODULE</div>
          <div className="col-span-5">CORE CAPABILITY ITEMS</div>
          <div className="col-span-3 text-center">GATE STATUS</div>
        </div>

        <div className="divide-y divide-dark-border-subtle">
          {STACK.map((group) => (
            <div
              key={group.category}
              className="p-3.5 grid grid-cols-12 items-center hover:bg-dark-elevated/50 transition-colors"
            >
              <div className="col-span-4">
                <span className="font-mono text-xs font-bold text-dark-text bg-dark-elevated px-2 py-0.5 rounded border border-dark-border-subtle">
                  {group.category}
                </span>
              </div>
              
              <div className="col-span-5 text-xs text-dark-text-muted pr-4 leading-relaxed font-semibold">
                {group.items.join(", ")}
              </div>

              <div className="col-span-3 flex justify-center">
                <button
                  onClick={() => {
                    playRetroSound("toggle");
                    addToast(`Toggled ${group.category} runtime scope context!`);
                  }}
                  className="px-4 py-1.5 rounded text-xs font-bold border cursor-pointer bg-accent-teal/10 text-accent-teal border-accent-teal/30 font-extrabold hover:bg-accent-teal/20 transition-colors"
                >
                  LOADED (OK)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client evaluation block */}
      <div className="bg-dark-elevated p-4 border border-dark-border rounded">
        <h4 className="font-bold text-xs font-mono uppercase text-dark-text mb-2">Simulated evaluation console</h4>
        
        <div className="bg-dark-bg p-3 border border-dark-border rounded grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div>
            <span className="font-bold text-dark-text-muted block">Live Environment Evaluations:</span>
            <p className="text-dark-text-muted mt-1">
              Our active pipeline validated <span className="font-mono font-bold text-cobalt">3 core stacks</span> and translated JavaScript interfaces into retro CRT visuals inside 8.4ms.
            </p>
          </div>

          <div className="flex flex-col justify-center bg-dark-surface p-2.5 border border-dark-border-subtle rounded">
            <span className="text-[10px] uppercase font-mono text-dark-text-faint mb-1">Evaluating runtime test snippet:</span>
            <code className="font-mono text-[10px] text-amber-button block leading-normal">
              {`zenith.isModuleLoaded('Web & Interface Ecosystem')`} → <span className="font-bold text-accent-teal">TRUE</span>
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
