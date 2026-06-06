"use client";

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ backgroundColor: "#FAFAF7" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.9),transparent_70%)]" />

      <div
        className="absolute inset-0 opacity-[0.018] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] blur-[140px] rounded-full bg-gradient-to-br from-amber-200/20 to-orange-100/15" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] blur-[140px] rounded-full bg-gradient-to-tl from-emerald-200/20 to-teal-100/15" />
    </div>
  );
}
