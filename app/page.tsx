"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import DesktopMode from "@/components/DesktopMode";
import WebsiteMode from "@/components/WebsiteMode";

export default function Page() {
  const [mode, setMode] = useState<"desktop" | "website">("desktop");

  return (
    <div className="min-h-screen selection:bg-amber-button/30 selection:text-amber-button relative">
      {/* Background images for different screen sizes */}
      <div className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 bg-noise" aria-hidden="true">
        {/* Desktop Background */}
        <div className="hidden md:block relative w-full h-full">
          <Image
            src="/desktop_background.png"
            alt=""
            fill
            priority
            quality={80}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12N4BgAA/AD+yPJ3oAAAAABJRU5ErkJggg=="
            className="object-cover object-center crisp-bg"
            sizes="100vw"
          />
        </div>
        {/* Mobile Background */}
        <div className="block md:hidden relative w-full h-full">
          <Image
            src="/mobile_background.png"
            alt=""
            fill
            priority
            quality={80}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12N4BgAA/AD+yPJ3oAAAAABJRU5ErkJggg=="
            className="object-cover object-center crisp-bg"
            sizes="100vw"
          />
        </div>
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
