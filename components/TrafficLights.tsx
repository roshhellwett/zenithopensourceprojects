export function TrafficLights() {
  return (
    <div className="flex gap-[3px]">
      <div className="w-[5px] h-[5px] rounded-full bg-rose-400/70 shadow-[inset_0_1px_1px_rgba(0,0,0,0.15)]" />
      <div className="w-[5px] h-[5px] rounded-full bg-amber-400/70 shadow-[inset_0_1px_1px_rgba(0,0,0,0.15)]" />
      <div className="w-[5px] h-[5px] rounded-full bg-emerald-400/70 shadow-[inset_0_1px_1px_rgba(0,0,0,0.15)]" />
    </div>
  );
}
