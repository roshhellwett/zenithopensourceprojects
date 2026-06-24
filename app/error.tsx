"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Zenith Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        {/* Terminal-style crash report */}
        <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-2xl mb-8">
          {/* Title bar */}
          <div className="bg-dark-elevated px-4 py-2.5 flex items-center gap-2 border-b border-dark-border">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <span className="text-xs text-dark-text-muted font-mono ml-2">
              crash_report.log
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-6 text-left font-mono text-sm space-y-3">
            <p className="text-accent-salmon font-bold">
              {">"} SYSTEM CRASH DETECTED
            </p>
            <p className="text-dark-text-muted">
              [FATAL] An unexpected error occurred in the Zenith runtime.
            </p>
            <div className="bg-dark-bg border border-dark-border-subtle rounded p-3 mt-2">
              <p className="text-[11px] text-dark-text-faint break-all">
                {error.message || "Unknown error"}
              </p>
              {error.digest && (
                <p className="text-[10px] text-dark-text-faint mt-1">
                  Digest: {error.digest}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-dark-border-subtle">
              <p className="text-accent-teal">
                {">"} Recovery options:
              </p>
              <p className="text-dark-text-faint ml-4">
                1. Retry the current operation
              </p>
              <p className="text-dark-text-faint ml-4">
                2. Return to safe state (home)
              </p>
              <p className="text-dark-text-faint ml-4">
                3. Report issue on GitHub
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 bg-accent-salmon rounded-full animate-pulse" />
              <span className="text-[10px] text-dark-text-faint">
                Error captured at {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-amber-button hover:bg-saffron-deep text-black px-6 py-2.5 rounded-md text-sm font-bold transition-all active:scale-95 border border-amber-shadow w-full sm:w-auto cursor-pointer"
          >
            ↻ Retry
          </button>
          <Link
            href="/"
            className="border border-dark-border hover:border-dark-text-muted text-dark-text px-6 py-2.5 rounded-md text-sm font-bold transition-all hover:bg-dark-surface w-full sm:w-auto text-center"
          >
            ← Back to Home
          </Link>
          <a
            href="https://github.com/roshhellwett/zenithopensourceprojects/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-text-muted hover:text-dark-text text-sm font-bold transition-colors"
          >
            Report Bug →
          </a>
        </div>

        <p className="text-[11px] text-dark-text-faint mt-8 font-mono">
          zenith@recovery:~$ <span className="animate-pulse">▊</span>
        </p>
      </div>
    </div>
  );
}
