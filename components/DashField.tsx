"use client";

import React, { useMemo } from "react";

export function DashField() {
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
      color: string;
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

      arr.push({ x, y, angle: dashAngle, length, color });
    }
    return arr;
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {dashes.map((d, i) => {
          const rad = (d.angle * Math.PI) / 180;
          const dx = Math.round(((Math.cos(rad) * d.length) / 2) * 10000) / 10000;
          const dy = Math.round(((Math.sin(rad) * d.length) / 2) * 10000) / 10000;
          return (
            <line key={i} x1={d.x - dx} y1={d.y - dy} x2={d.x + dx} y2={d.y + dy}
              stroke={d.color} strokeWidth={1.2} strokeLinecap="round" vectorEffect="non-scaling-stroke"
              style={{ opacity: 0.5 }} />
          );
        })}
      </svg>
    </div>
  );
}
