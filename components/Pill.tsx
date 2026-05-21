export function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase border border-slate-200/50 bg-white/85 text-slate-500 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] ${className}`}
    >
      {children}
    </span>
  );
}
