"use client";

export function BharatWave() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-28 md:h-36"
      viewBox="0 0 200 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="saffronWave" x1="0" x2="1">
          <stop offset="0%" stopColor="rgb(251,146,60)" stopOpacity="0" />
          <stop offset="50%" stopColor="rgb(251,146,60)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(251,146,60)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="emeraldWave" x1="0" x2="1">
          <stop offset="0%" stopColor="rgb(16,185,129)" stopOpacity="0" />
          <stop offset="50%" stopColor="rgb(16,185,129)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(16,185,129)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M -10 30 Q 25 10 50 30 T 110 30 T 170 30 T 230 30"
        fill="none" stroke="url(#saffronWave)" strokeWidth="1" strokeLinecap="round"
      />
      <path
        d="M -10 38 Q 25 58 50 38 T 110 38 T 170 38 T 230 38"
        fill="none" stroke="url(#emeraldWave)" strokeWidth="1" strokeLinecap="round"
      />
      {[
        { x: 20 }, { x: 55 }, { x: 90 },
        { x: 120 }, { x: 155 }, { x: 180 },
      ].map((p, i) => (
        <circle key={i} cx={p.x} cy={i % 2 === 0 ? 25 : 42} r="0.6"
          fill={i % 2 === 0 ? "rgb(251,146,60)" : "rgb(16,185,129)"}
          opacity="0.5" />
      ))}
    </svg>
  );
}
