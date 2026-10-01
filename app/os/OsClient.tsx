"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { writeMode, isMobileDevice } from "@/lib/mode";

const DesktopMode = dynamic(() => import("@/components/DesktopMode"), { ssr: false });

export default function OsClient() {
  const router = useRouter();

  useEffect(() => {
    // Prevent mobile users from accessing OS mode - throw them to /site
    if (isMobileDevice()) {
      writeMode("site");
      router.replace("/site");
      return;
    }

    writeMode("os");
    router.prefetch("/site");

    const handleResize = () => {
      if (isMobileDevice()) {
        writeMode("site");
        router.replace("/site");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  const goToSite = () => {
    writeMode("site");
    router.push("/site");
  };

  return (
    <div className="min-h-screen selection:bg-amber-button/30 selection:text-amber-button relative overflow-x-hidden">
      {/* Mobile redirect placeholder - visible only on mobile screens */}
      <div className="md:hidden fixed inset-0 bg-[#e1d7c2] flex items-center justify-center text-dark-text font-mono text-xs z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-button animate-pulse" />
          <span>Redirecting to Zenith Mobile Web…</span>
        </div>
      </div>

      {/* Desktop OS Workspace - rendered only on desktop screens */}
      <div className="hidden md:block">
        <div
          className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 bg-noise"
          aria-hidden="true"
        >
          <picture>
            <source media="(min-width: 768px)" srcSet="/desktop_background.webp" />
            <img
              src="/mobile_background.webp"
              alt=""
              className="w-full h-full object-cover object-center crisp-bg"
            />
          </picture>
        </div>
        <div className="relative" style={{ zIndex: 1 }}>
          <Navbar currentMode="desktop" onToggleMode={goToSite} />
          <DesktopMode onSwitchToWebsite={goToSite} />
        </div>
      </div>
    </div>
  );
}
