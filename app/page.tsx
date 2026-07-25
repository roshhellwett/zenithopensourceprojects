"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { readMode, pathForMode } from "@/lib/mode";
import { ZenithLogo } from "@/components/ZenithLogo";

/**
 * `/` is a lightweight splash + redirect. It restores the visitor's
 * last-visited world (OS or Website) so the two modes feel truly
 * independent — no shared state, no cross-mode leakage, one canonical
 * URL per world.
 */
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const target = pathForMode(readMode());
    // Prefetch both so the destination hydrates instantly.
    router.prefetch("/os");
    router.prefetch("/site");
    const t = setTimeout(() => router.replace(target), 180);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-dark-bg text-dark-text">
      <div className="flex flex-col items-center gap-3 select-none">
        <ZenithLogo className="w-10 h-10" />
        <div className="text-xs font-mono uppercase tracking-widest text-dark-text-muted">
          Booting Zenith…
        </div>
        <div className="w-40 h-0.5 bg-dark-border overflow-hidden rounded-full">
          <div className="h-full bg-amber-button loading-progress" />
        </div>
      </div>
    </div>
  );
}
