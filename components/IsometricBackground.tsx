"use client";

import React from "react";
import Image from "next/image";

export default function IsometricBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
      <Image
        src="/desktop_background.png"
        alt=""
        fill
        priority
        className="object-cover object-center isometric-bg crisp-bg"
        sizes="100vw"
      />
    </div>
  );
}
