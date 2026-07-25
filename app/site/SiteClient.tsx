"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import WebsiteMode from "@/components/WebsiteMode";
import { writeMode } from "@/lib/mode";

export default function SiteClient() {
  const router = useRouter();

  useEffect(() => {
    writeMode("site");
    router.prefetch("/os");
  }, [router]);

  const goToOs = () => {
    writeMode("os");
    router.push("/os");
  };

  return (
    <div className="min-h-screen selection:bg-amber-button/30 selection:text-amber-button relative overflow-x-hidden">
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
        <Navbar currentMode="website" onToggleMode={goToOs} />
        <WebsiteMode onSwitchToDesktop={goToOs} />
      </div>
    </div>
  );
}
