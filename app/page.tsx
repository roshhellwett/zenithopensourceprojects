"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";

const DesktopMode = dynamic(() => import("@/components/DesktopMode"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-dark-bg flex items-center justify-center">
      <div className="animate-pulse text-dark-text-muted text-sm">Loading desktop...</div>
    </div>
  ),
});

const WebsiteMode = dynamic(() => import("@/components/WebsiteMode"), {
  loading: () => (
    <div className="fixed inset-0 bg-dark-bg flex items-center justify-center">
      <div className="animate-pulse text-dark-text-muted text-sm">Loading website...</div>
    </div>
  ),
});

export default function Page() {
  const [mode, setMode] = useState<"desktop" | "website">("desktop");

  return (
    <div className="min-h-screen selection:bg-amber-button/30 selection:text-amber-button relative">
      {/* Background images for different screen sizes */}
      <div className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 bg-noise" aria-hidden="true">
        <picture>
          <source media="(min-width: 768px)" srcSet="/desktop_background.webp" />
          <Image
            src="/mobile_background.webp"
            alt=""
            fill
            priority
            quality={80}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12N4BgAA/AD+yPJ3oAAAAABJRU5ErkJggg=="
            className="object-cover object-center crisp-bg"
            sizes="100vw"
          />
        </picture>
      </div>

      {/* Content layer */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Shared Navbar */}
        <Navbar
          currentMode={mode}
          onToggleMode={() => setMode(mode === "desktop" ? "website" : "desktop")}
        />

        {/* Mode-based content */}
        {mode === "desktop" ? (
          <DesktopMode onSwitchToWebsite={() => setMode("website")} />
        ) : (
          <WebsiteMode onSwitchToDesktop={() => setMode("desktop")} />
        )}
      </div>
    </div>
  );
}
