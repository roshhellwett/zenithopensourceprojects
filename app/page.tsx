"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import DesktopMode from "@/components/DesktopMode";
import WebsiteMode from "@/components/WebsiteMode";

export default function Page() {
  const [mode, setMode] = useState<"desktop" | "website">("desktop");

  return (
    <div className="min-h-screen selection:bg-amber-button/30 selection:text-amber-button relative">
      {/* Background image — rendered as a fixed full-screen img for maximum crispness */}
      <img
        src="/desktop_background.png"
        alt=""
        className="fixed inset-0 w-full h-full object-cover object-center pointer-events-none select-none crisp-bg"
        style={{ zIndex: 0 }}
        draggable={false}
        fetchPriority="high"
      />

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
