import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        {/* Terminal-style 404 */}
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-2xl mb-8">
          {/* Title bar */}
          <div className="bg-dark-elevated px-4 py-2.5 flex items-center gap-2 border-b border-dark-border">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <span className="text-xs text-dark-text-muted font-mono ml-2">
              error_404.log
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-6 text-left font-mono text-sm space-y-3">
            <p className="text-amber-button font-bold">
              {">"} zenith --locate file
            </p>
            <p className="text-dark-text-muted">
              [ERROR] File not found in registry.
            </p>
            <p className="text-dark-text-muted">
              [INFO] The requested path does not exist in the Zenith project
              tree.
            </p>
            <div className="pt-2 border-t border-dark-border-subtle">
              <p className="text-accent-salmon font-bold text-4xl mb-1">404</p>
              <p className="text-dark-text text-base font-bold font-sans">
                Page not found
              </p>
              <p className="text-dark-text-muted text-xs mt-1 font-sans">
                The page you&apos;re looking for doesn&apos;t exist or has been
                moved to a different registry node.
              </p>
            </div>
            <div className="pt-3">
              <p className="text-accent-teal">
                {">"} Suggested actions:
              </p>
              <p className="text-dark-text-faint ml-4">
                1. Check the URL for typos
              </p>
              <p className="text-dark-text-faint ml-4">
                2. Return to the home registry
              </p>
              <p className="text-dark-text-faint ml-4">
                3. Browse projects on GitHub
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-amber-button hover:bg-saffron-deep text-black px-6 py-2.5 rounded-md text-sm font-bold transition-all active:scale-95 border border-amber-shadow w-full sm:w-auto"
          >
            ← Back to Home
          </Link>
          <a
            href="https://github.com/roshhellwett?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-dark-border hover:border-dark-text-muted text-dark-text px-6 py-2.5 rounded-md text-sm font-bold transition-all hover:bg-dark-surface w-full sm:w-auto"
          >
            Browse Projects
          </a>
        </div>

        {/* Footer hint */}
        <p className="text-[11px] text-dark-text-faint mt-8 font-mono">
          zenith@registry:~$ <span className="animate-pulse">▊</span>
        </p>
      </div>
    </div>
  );
}
