export function ZenithLogo({ className = "w-7 h-7", animate = true }: { className?: string; animate?: boolean }) {
  return (
    <svg className={`${className} ${animate ? "animate-pulse" : ""}`} viewBox="0 0 32 32" fill="none">
      <rect x="2" y="6" width="28" height="20" rx="3" fill="#1d1f27" stroke="#F1A82C" strokeWidth="2"/>
      <path d="M6 10h4v2H6zM12 10h4v2h-4zM20 10h6v2h-6z" fill="#F1A82C" opacity="0.8"/>
      <path d="M6 15h20v1H6z" fill="#65675e"/>
      <path d="M6 18h14v1H6z" fill="#65675e"/>
      <path d="M6 21h8v1H6z" fill="#65675e"/>
    </svg>
  );
}
