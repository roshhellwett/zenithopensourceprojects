export function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-[0.22em] uppercase border border-slate-200/60 bg-white/90 text-slate-500 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),inset_0_-0.5px_0_rgba(15,23,42,0.03)] ${className}`}
    >
      {children}
    </span>
  );
}
