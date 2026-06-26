import { ZenithLogo } from "@/components/ZenithLogo";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-dark-bg flex flex-col items-center justify-center z-[9999]">
      <div className="relative mb-8">
        <ZenithLogo className="w-16 h-16" />
        <div className="absolute inset-0 -m-3">
          <svg className="w-[88px] h-[88px] animate-spin" style={{ animationDuration: "2s" }} viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="40" stroke="rgba(241, 168, 44, 0.15)" strokeWidth="2" fill="none" />
            <circle cx="44" cy="44" r="40" stroke="#F1A82C" strokeWidth="2" fill="none" strokeDasharray="62.83 188.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-dark-text font-extrabold text-lg tracking-tight mb-2">Zenith</h2>
        <div className="flex items-center gap-2 text-dark-text-muted text-xs font-mono">
          <span className="w-1.5 h-1.5 bg-amber-button rounded-full animate-pulse" />
          <span>Loading registry modules...</span>
        </div>
      </div>

      <div className="mt-8 w-48">
        <div className="bg-dark-border/30 h-1 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-button to-accent-teal rounded-full loading-progress" />
        </div>
      </div>
    </div>
  );
}
