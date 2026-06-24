"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-dark-bg flex flex-col items-center justify-center z-[9999]">
      {/* Zenith Logo Animation */}
      <div className="relative mb-8">
        <svg className="w-16 h-16 animate-pulse" viewBox="0 0 32 32" fill="none">
          <rect
            x="2" y="6" width="28" height="20" rx="3"
            fill="#1d1f27" stroke="#F1A82C" strokeWidth="2"
          />
          <path d="M6 10h4v2H6zM12 10h4v2h-4zM20 10h6v2h-6z" fill="#F1A82C" opacity="0.8" />
          <path d="M6 15h20v1H6z" fill="#65675e" />
          <path d="M6 18h14v1H6z" fill="#65675e" />
          <path d="M6 21h8v1H6z" fill="#65675e" />
        </svg>
        {/* Spinning ring */}
        <div className="absolute inset-0 -m-3">
          <svg className="w-[88px] h-[88px] animate-spin" style={{ animationDuration: "2s" }} viewBox="0 0 88 88">
            <circle
              cx="44" cy="44" r="40"
              stroke="rgba(241, 168, 44, 0.15)"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="44" cy="44" r="40"
              stroke="#F1A82C"
              strokeWidth="2"
              fill="none"
              strokeDasharray="62.83 188.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <h2 className="text-dark-text font-extrabold text-lg tracking-tight mb-2">
          Zenith
        </h2>
        <div className="flex items-center gap-2 text-dark-text-muted text-xs font-mono">
          <span className="w-1.5 h-1.5 bg-amber-button rounded-full animate-pulse" />
          <span>Loading registry modules...</span>
        </div>
      </div>

      {/* Terminal-style progress bar */}
      <div className="mt-8 w-48">
        <div className="bg-dark-border/30 h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-button to-accent-teal rounded-full"
            style={{
              animation: "loading-progress 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-progress {
          0% { width: 0%; transform: translateX(0); }
          50% { width: 70%; }
          100% { width: 100%; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
