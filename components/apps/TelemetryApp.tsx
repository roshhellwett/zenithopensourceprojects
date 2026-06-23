import React, { useState, useEffect } from 'react';
import { Activity, Play, Pause } from 'lucide-react';

export default function TelemetryApp({ playRetroSound, addToast }: { playRetroSound: (type: any) => void, addToast: (msg: string) => void }) {
  const [isPlayingRecording, setIsPlayingRecording] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [playbackCursor, setPlaybackCursor] = useState<{ x: number; y: number }>({ x: 120, y: 150 });
  const [playbackAction, setPlaybackAction] = useState<string>("Sentinel compilation loop initialized...");

  useEffect(() => {
    let interval: any;
    if (isPlayingRecording) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= 60) {
            setIsPlayingRecording(false);
            addToast("Build verification pipeline completed!");
            playRetroSound("success");
            return 0;
          }
          const cursorCoords = [
            { x: 80, y: 70, act: "Compiling news classification tree..." },
            { x: 190, y: 120, act: "Verifying ZKP ballot zero-leak signatures..." },
            { x: 310, y: 180, act: "Loading PulseWire DSP audio channels..." },
            { x: 110, y: 220, act: "Polling database indices..." },
            { x: 260, y: 90, act: "Linting Python registry bot files..." },
            { x: 140, y: 160, act: "Pipeline audit validated successfully." }
          ];
          const step = Math.floor(prev / 10) % cursorCoords.length;
          setPlaybackCursor({
            x: cursorCoords[step].x + (Math.random() * 10 - 5),
            y: cursorCoords[step].y + (Math.random() * 10 - 5),
          });
          setPlaybackAction(cursorCoords[step].act);
          return prev + 1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlayingRecording, addToast, playRetroSound]);

  const cols = 26;
  const rows = 7;
  const seed = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;
  
  const heatmapCells = React.useMemo(() => Array.from({ length: cols * rows }, (_, i) => {
    const r = seed(i);
    const recencyBoost = (i % cols) / cols;
    const v = r * 0.65 + recencyBoost * 0.35;
    let level = 0;
    if (v > 0.85) level = 4;
    else if (v > 0.7) level = 3;
    else if (v > 0.5) level = 2;
    else if (v > 0.3) level = 1;
    return { level, commits: Math.round(v * 15) };
  }), [cols, rows]);

  const levelClass = [
    "bg-dark-surface border border-dark-border-subtle",
    "bg-accent-teal/15 border border-accent-teal/20",
    "bg-accent-teal/35 border border-accent-teal/30",
    "bg-accent-teal/60 shadow-[0_0_8px_rgba(44,182,125,0.2)]",
    "bg-accent-teal shadow-[0_0_12px_rgba(44,182,125,0.4)] border border-accent-teal/80"
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left: Commit cadence heatmap */}
      <div className="col-span-12 md:col-span-5 space-y-4">
        <h3 className="font-bold text-sm text-dark-text uppercase tracking-wide font-mono flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-accent-teal" />
          <span>Commit Cadence Heatmap</span>
        </h3>

        <div className="bg-dark-surface border border-dark-border p-4 rounded">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold tracking-widest text-dark-text-faint uppercase">Last 26 weeks</span>
            <span className="text-[9px] font-bold tracking-widest text-dark-text-faint uppercase flex items-center">
              Less <span className="inline-flex gap-1 mx-2 align-middle">
                {[0, 1, 2, 3, 4].map((l) => (
                  <span key={l} className={`w-[8px] h-[8px] rounded-sm ${levelClass[l]}`} />
                ))}
              </span> More
            </span>
          </div>

          <div className="grid gap-[4px] justify-center" style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
          }}>
            {heatmapCells.map((c, i) => (
              <div
                key={i}
                className={`aspect-square rounded-[2px] transition-all hover:scale-125 ${levelClass[c.level]}`}
                title={`${c.commits} commits recorded`}
              />
            ))}
          </div>
        </div>

        <div className="bg-dark-bg border border-dark-border-subtle p-3 rounded text-xs leading-normal">
          <p className="text-dark-text-muted">
            Our build telemetries verify compilation metrics, static audit outcomes, and EasyEffects script loads dynamically every 24 hours.
          </p>
        </div>
      </div>

      {/* Right: Live compiler console simulator */}
      <div className="col-span-12 md:col-span-7 flex flex-col justify-between space-y-4">
        <div className="bg-dark-surface border border-dark-border p-4 rounded flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b pb-2 border-dark-border-subtle mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-salmon animate-pulse inline-block" />
              <span className="font-bold text-xs font-mono text-dark-text">Simulated Build Diagnostics Stream</span>
            </div>
            <div className="text-[10px] font-mono text-dark-text-muted bg-dark-elevated px-2 py-0.5 rounded">
              Node: New Delhi
            </div>
          </div>

          {/* Terminal */}
          <div className="relative border border-dark-border h-48 bg-[#0a0b0e] text-accent-teal p-3 rounded font-mono text-[10px] overflow-y-auto leading-relaxed">
            <div className="absolute inset-0 bg-grid-line opacity-[0.02] pointer-events-none" />
            
            <div className="space-y-1">
              <p className="text-amber-button font-bold">&gt; sh ./scripts/audit_pipeline.sh</p>
              <p className="text-dark-text-faint">[info] Initializing Zenith registry validation tools...</p>
              <p className="text-dark-text-faint">[info] Checked project sentinel classifier dependencies: verified.</p>
              <p className="text-dark-text-faint">[info] Checked ZeroGapVote cryptographic proofs: 0 issues found.</p>
              <p className="text-dark-text-faint">[info] Checked EasyEffects sound preset frequencies: stable.</p>
              <p className="text-dark-text font-bold">&gt; Pipeline Status: GREEN (Build Cadence 98.4%)</p>
              {playbackTime > 0 && (
                <p className="text-amber-button animate-pulse mt-2">[simulation active] {playbackAction}</p>
              )}
            </div>

            <div
              className="absolute w-5 h-5 transition-all duration-300 pointer-events-none z-30"
              style={{ top: `${playbackCursor.y}px`, left: `${playbackCursor.x}px` }}
            >
              <div className="relative">
                <span className="text-xl select-none absolute -top-2.5 -left-2.5">🖱️</span>
                {playbackTime > 0 && playbackTime % 2 === 0 && (
                  <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full border border-amber-button animate-ping opacity-75 inline-block" />
                )}
              </div>
            </div>

            <div className="absolute bottom-2 right-2 bg-dark-elevated text-dark-text-faint text-[8px] px-1.5 py-0.5 rounded border border-dark-border-subtle select-none pointer-events-none">
              COORD: ({Math.floor(playbackCursor.x)}px, {Math.floor(playbackCursor.y)}px)
            </div>
          </div>

          {/* Timeline controller */}
          <div className="mt-4 flex items-center justify-between gap-3 bg-dark-elevated p-2 rounded border border-dark-border-subtle">
            <button
              onClick={() => {
                setIsPlayingRecording(!isPlayingRecording);
                playRetroSound("click");
              }}
              className="p-1 px-3 border border-amber-shadow rounded bg-amber-button text-black text-xs font-bold flex items-center gap-1.5 hover:bg-saffron-deep cursor-pointer"
            >
              {isPlayingRecording ? (
                <><Pause className="w-3.5 h-3.5" /><span>PAUSE</span></>
              ) : (
                <><Play className="w-3.5 h-3.5" /><span>SIMULATE PIPELINE RUN</span></>
              )}
            </button>

            <div className="flex-1">
              <div className="bg-dark-border h-2.5 rounded border border-dark-border-subtle relative overflow-hidden">
                <div
                  className="bg-cobalt h-full absolute top-0 left-0 transition-all"
                  style={{ width: `${(playbackTime / 60) * 100}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono mt-1 text-dark-text-faint">
                <span>RUNNING: {playbackTime}s</span>
                <span>TOTAL CAP: 60s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
