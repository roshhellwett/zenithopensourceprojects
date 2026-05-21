export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-slate-200/50" />
        <span className="text-[9px] font-bold tracking-[0.35em] uppercase text-slate-400">
          {eyebrow}
        </span>
        <div className="h-px flex-1 bg-slate-200/50" />
      </div>
      <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.04]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm md:text-base text-slate-500 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
