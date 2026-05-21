"use client";

import { useReducedMotion, motion } from "framer-motion";

export function Background() {
  const reduce = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ backgroundColor: "#FAFAF7" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.9),transparent_70%)]" />
      {!reduce && (
        <>
          <motion.div
            animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] blur-[140px] rounded-full bg-gradient-to-br from-amber-200/20 to-orange-100/15"
          />
          <motion.div
            animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] blur-[140px] rounded-full bg-gradient-to-tl from-emerald-200/20 to-teal-100/15"
          />
        </>
      )}
    </div>
  );
}
