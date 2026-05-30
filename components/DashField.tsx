"use client";

import React, { useMemo, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

export function DashField() {
  const reduce = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const dashes = useMemo(() => {
    const seed = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;
    const round = (n: number) => Math.round(n * 10000) / 10000;
    const COUNT = 170;
    const focals = [
      { x: 25, y: 35 },
      { x: 75, y: 62 },
    ];
    const arr: {
      x: number; y: number; angle: number; length: number;
      color: string; delay: number; duration: number;
    }[] = [];

    for (let i = 0; i < COUNT; i++) {
      const r1 = seed(i * 3.7 + 1);
      const r2 = seed(i * 5.1 + 11);
      const r3 = seed(i * 7.3 + 23);
      const r4 = seed(i * 11.1 + 37);
      const r5 = seed(i * 13.7 + 51);

      const focalIdx = r1 < 0.5 ? 0 : 1;
      const focal = focals[focalIdx];

      const angle = r2 * Math.PI * 2;
      const radius = Math.pow(r3, 0.55) * 55;
      const x = round(focal.x + Math.cos(angle) * radius);
      const y = round(focal.y + Math.sin(angle) * radius * 0.85);

      if (x < -5 || x > 105 || y < -5 || y > 105) continue;

      const dashAngle = round((r4 - 0.5) * 90);
      const length = round(0.7 + r5 * 1.6);

      const cRoll = (r2 + r5) / 2;
      let color: string;
      if (focalIdx === 0) {
        if (cRoll < 0.55) color = "rgba(234,88,12,0.95)";
        else if (cRoll < 0.78) color = "rgba(245,158,11,0.85)";
        else if (cRoll < 0.92) color = "rgba(15,23,42,0.55)";
        else color = "rgba(5,150,105,0.7)";
      } else {
        if (cRoll < 0.55) color = "rgba(5,150,105,0.95)";
        else if (cRoll < 0.78) color = "rgba(16,185,129,0.85)";
        else if (cRoll < 0.92) color = "rgba(15,23,42,0.55)";
        else color = "rgba(234,88,12,0.7)";
      }

      arr.push({ x, y, angle: dashAngle, length, color, delay: r5 * 5, duration: 4 + r4 * 4 });
    }
    return arr;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || reduce) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    let nx = 0;
    let ny = 0;
    const apply = () => {
      const el = containerRef.current;
      if (!el) return;
      el.style.setProperty("--cx", `${nx}px`);
      el.style.setProperty("--cy", `${ny}px`);
    };
    const onMove = (e: MouseEvent) => {
      nx = e.clientX;
      ny = e.clientY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      nx = -500;
      ny = -500;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0, "--cx": "-500px", "--cy": "-500px" } as React.CSSProperties}
    >
      <style>{`
        @supports (font-tech(color-COLRv1)) or (background: paint(a)) {
          @property --pulse-r { syntax: '<length>'; inherits: false; initial-value: 240px; }
        }
        @keyframes dashFade { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.9; } }
        @keyframes pulseBreathe { 0%, 100% { --pulse-r: 200px; } 50% { --pulse-r: 380px; } }
        @keyframes pulseBreatheScale { 0%, 100% { transform: scale(0.8); } 50% { transform: scale(1.5); } }
        @keyframes haloPulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
      `}</style>

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {dashes.map((d, i) => {
          const rad = (d.angle * Math.PI) / 180;
          const dx = Math.round(((Math.cos(rad) * d.length) / 2) * 10000) / 10000;
          const dy = Math.round(((Math.sin(rad) * d.length) / 2) * 10000) / 10000;
          return (
            <line key={i} x1={d.x - dx} y1={d.y - dy} x2={d.x + dx} y2={d.y + dy}
              stroke={d.color} strokeWidth={1.2} strokeLinecap="round" vectorEffect="non-scaling-stroke"
              style={reduce ? { opacity: 0.5 } : { animation: `dashFade ${d.duration}s ease-in-out ${d.delay}s infinite` }} />
          );
        })}
      </svg>

      {!reduce && (
        <div className="absolute inset-0" style={{
          animation: "pulseBreathe 3.6s ease-in-out infinite, pulseBreatheScale 3.6s ease-in-out infinite",
          WebkitMaskImage: "radial-gradient(var(--pulse-r) circle at var(--cx) var(--cy), rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)",
          maskImage: "radial-gradient(var(--pulse-r) circle at var(--cx) var(--cy), rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)",
        }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            {dashes.map((d, i) => {
              const rad = (d.angle * Math.PI) / 180;
              const dx = Math.round(((Math.cos(rad) * d.length * 1.35) / 2) * 10000) / 10000;
              const dy = Math.round(((Math.sin(rad) * d.length * 1.35) / 2) * 10000) / 10000;
              return (
                <line key={i} x1={d.x - dx} y1={d.y - dy} x2={d.x + dx} y2={d.y + dy}
                  stroke={d.color} strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              );
            })}
          </svg>
        </div>
      )}

      {!reduce && (
        <div className="absolute inset-0" style={{
          animation: "pulseBreathe 3.6s ease-in-out infinite, pulseBreatheScale 3.6s ease-in-out infinite, haloPulse 3.6s ease-in-out infinite",
          background: "radial-gradient(var(--pulse-r) circle at var(--cx) var(--cy), rgba(251,146,60,0.18) 0%, rgba(16,185,129,0.10) 40%, rgba(255,255,255,0) 75%)",
        }} />
      )}
    </div>
  );
}
