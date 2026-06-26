export function TrafficLights({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-1.5 ${className}`}>
      <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
      <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
      <span className="w-3 h-3 rounded-full bg-[#28C840]" />
    </div>
  );
}
