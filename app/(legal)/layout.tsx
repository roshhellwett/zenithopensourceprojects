import Link from "next/link";

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
  { href: "/open-source", label: "Open Source" },
  { href: "/security", label: "Security" },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-50 bg-dark-surface/95 border-b border-dark-border backdrop-blur-md">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-dark-text hover:text-amber-button transition-colors"
          >
            ← Back to Zenith
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2.5 py-1.5 text-[11px] font-semibold text-dark-text-muted hover:text-dark-text hover:bg-dark-elevated rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        {children}
      </div>

      {/* Compact footer */}
      <footer className="border-t border-dark-border bg-dark-surface/90 select-none">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-5 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-dark-text-faint font-medium">
            {LEGAL_LINKS.map((link, i) => (
              <span key={link.href} className="flex items-center gap-3">
                <Link
                  href={link.href}
                  className="hover:text-dark-text transition-colors"
                >
                  {link.label}
                </Link>
                {i < LEGAL_LINKS.length - 1 && (
                  <span className="text-dark-border">·</span>
                )}
              </span>
            ))}
          </div>
          <div className="text-center text-[10px] text-dark-text-faint font-semibold">
            © {new Date().getFullYear()} Zenith Open Source Projects · MIT
            Licensed ·{" "}
            <Link href="/" className="hover:text-dark-text transition-colors">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
