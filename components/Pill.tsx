export function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-[0.22em] uppercase border border-slate-800/80 bg-slate-950/80 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] ${className}`}
    >
      {children}
    </span>
  );
}
