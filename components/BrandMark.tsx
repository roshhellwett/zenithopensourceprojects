export function BrandMark({ size = 36, rounded = "rounded-2xl" }: { size?: number; rounded?: string }) {
  const s = (n: number) => Math.round((n / 36) * size);
  return (
    <div
      className={`relative ${rounded} bg-slate-900 flex items-center justify-center overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.3)] ring-1 ring-slate-700/40`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: s(20), height: s(20) }}
        aria-hidden="true"
      >
        <polyline points="4,4 20,4 4,20 20,20" />
      </svg>
    </div>
  );
}
