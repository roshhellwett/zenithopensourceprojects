"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { TrafficLights } from "@/components/TrafficLights";

const TERMINAL_LINES = [
  { text: "sentinel --pull --origin=IN", type: "command" as const },
  { text: "Initializing Sentinel pipeline (v2.4.1-rc3)...", type: "output" as const },
  { text: "→ GET https://api.zenith.org/v1/feeds... [200 OK]", type: "output" as const, highlight: "[200 OK]" },
  { text: "→ Parsing regional RSS descriptors...", type: "output" as const },
  { text: "→ Fusing headers via local logic...", type: "output" as const },
  { text: "→ Verification PASS · Latency: 42ms", type: "output" as const },
  { text: "✓ Sentinel completed. 142 stories synced.", type: "success" as const },
];

export function FeaturedProject() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasStarted) return;
    if (visibleLines >= TERMINAL_LINES.length) return;

    const delays = [0, 500, 700, 400, 600, 400, 500];
    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, delays[visibleLines] || 400);
    return () => clearTimeout(timer);
  }, [visibleLines, hasStarted]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-full flex flex-col font-mono bg-[#02040a]">
      <div className="px-4 py-2 border-b border-slate-900/80 flex items-center justify-between bg-slate-950/40">
        <TrafficLights />
        <span className="text-[8px] font-black tracking-[0.2em] uppercase text-slate-600">sentinel ~ live</span>
        <div className="w-8" />
      </div>

      <div ref={containerRef} className="p-4 text-[10px] space-y-2 text-slate-300 flex-grow">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {line.type === "command" && (
              <div><span className="text-accent-1 mr-2">$</span> <span className="text-white">{line.text}</span></div>
            )}
            {line.type === "output" && (
              <div className="text-slate-500">
                {line.highlight ? (
                  <>
                    {line.text.replace(line.highlight, "")}<span className="text-accent-3 text-shadow-[0_0_8px_rgba(45,212,191,0.5)]">{line.highlight}</span>
                  </>
                ) : (
                  line.text
                )}
              </div>
            )}
            {line.type === "success" && (
              <div className="text-accent-3 flex items-center gap-1.5 font-bold drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]">
                <CheckCircle2 size={12} className="text-accent-3" /> {line.text.replace("✓ ", "")}
              </div>
            )}
          </motion.div>
        ))}
        {visibleLines < TERMINAL_LINES.length && hasStarted && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block w-1.5 h-3.5 bg-accent-1/80 rounded-[1px] ml-1 align-middle"
          />
        )}
      </div>
    </div>
  );
}
