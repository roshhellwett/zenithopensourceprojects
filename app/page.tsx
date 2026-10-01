"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { readMode, pathForMode, isMobileDevice } from "@/lib/mode";
import { ZenithLogo } from "@/components/ZenithLogo";

/**
 * `/` is a lightweight splash + redirect. It restores the visitor's
 * last-visited world (OS or Website).
 * If the user is on mobile, they are always redirected immediately to `/site`.
 */
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const isMobile = isMobileDevice();
    const target = isMobile ? "/site" : pathForMode(readMode());

    // Prefetch destination
    if (!isMobile) {
      router.prefetch("/os");
    }
    router.prefetch("/site");

    const t = setTimeout(() => router.replace(target), isMobile ? 50 : 180);
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
