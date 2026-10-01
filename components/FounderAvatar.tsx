"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Lock } from "lucide-react";
import { playRetroSound } from "@/lib/audio";

interface FounderAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showBadge?: boolean;
}

export default function FounderAvatar({
  size = "md",
  className = "",
  showBadge = true,
}: FounderAvatarProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showProtectedNotice, setShowProtectedNotice] = useState(false);

  const sizeClasses = {
    sm: "w-12 h-12 rounded-xl",
    md: "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl",
    lg: "w-24 h-24 sm:w-28 sm:h-28 rounded-3xl",
  }[size];

  const pixelDimensions = {
    sm: 48,
    md: 80,
    lg: 112,
  }[size];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    playRetroSound("beep");
    setShowProtectedNotice(true);
    setTimeout(() => setShowProtectedNotice(false), 2600);
  };

  return (
    <div className={`relative inline-block select-none ${className}`}>
      <div
        className={`relative overflow-hidden bg-dark-elevated border-2 border-amber-button/50 shadow-[0_4px_24px_rgba(241,168,44,0.2)] ring-2 ring-amber-button/20 transition-transform duration-300 hover:scale-[1.02] ${sizeClasses}`}
      >
        {!hasError ? (
          <>
            <Image
              src="/assets/founder/roshan-verified.webp"
              alt="Roshan Kr Singh — Verified Founder & Architect"
              width={pixelDimensions * 2}
              height={pixelDimensions * 2}
              priority
              draggable={false}
              onLoad={() => setImageLoaded(true)}
              onError={() => setHasError(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Protective Glass Shield Overlay - disables raw image grabbing / scraping */}
            <div
              onContextMenu={handleContextMenu}
              className="absolute inset-0 z-10 cursor-default bg-gradient-to-t from-black/25 via-transparent to-transparent select-none pointer-events-auto"
              title="Roshan Kr Singh · Verified Founder & Maintainer (Protected Identity)"
              aria-label="Maintainer identity"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-button via-saffron-deep to-ember flex items-center justify-center text-black font-black text-xl">
            RK
          </div>
        )}

        {/* Loading shimmer placeholder */}
        {!imageLoaded && !hasError && (
          <div className="absolute inset-0 bg-dark-elevated animate-pulse flex items-center justify-center text-xs font-mono text-amber-button">
            RK
          </div>
        )}
      </div>

      {/* Verified Status Dot / Seal */}
      {showBadge && (
        <span
          className="absolute -bottom-1 -right-1 z-20 flex items-center justify-center bg-accent-teal text-white rounded-full border-2 border-dark-surface shadow-md p-0.5"
          title="Verified Bharat Maintainer & Architect"
          aria-label="Verified maintainer"
        >
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </span>
      )}

      {/* Protected Identity Popover Notice on right-click */}
      {showProtectedNotice && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-black/90 border border-amber-button/70 text-amber-button text-[10px] font-mono font-bold px-2.5 py-1 rounded-md shadow-xl flex items-center gap-1.5 animate-pop-in">
          <Lock className="w-3 h-3 text-amber-button shrink-0" />
          <span>Identity Protected · Verified Bharat Maintainer</span>
        </div>
      )}
    </div>
  );
}
