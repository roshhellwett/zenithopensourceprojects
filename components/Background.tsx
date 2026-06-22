"use client";

import { motion } from "framer-motion";

import { WebGLBackground } from "@/components/WebGLBackground";

export function Background() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-slate-950 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,23,42,0.8),transparent_80%)]" />

      {/* Animated glowing orbs */}
      <motion.div 
        animate={{ 
          transform: ["translate(0px, 0px) scale(1)", "translate(20px, -20px) scale(1.05)", "translate(0px, 0px) scale(1)"]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] blur-[160px] rounded-full bg-gradient-to-br from-sky-500/15 via-indigo-500/5 to-transparent" 
      />
      <motion.div 
        animate={{ 
          transform: ["translate(0px, 0px) scale(1)", "translate(-20px, 20px) scale(1.05)", "translate(0px, 0px) scale(1)"]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-20%] right-[-10%] w-[65vw] h-[65vw] blur-[160px] rounded-full bg-gradient-to-tl from-teal-500/10 via-cyan-500/5 to-transparent" 
      />
      
      {/* Interactive WebGL Shader Grid */}
      <WebGLBackground />
    </div>
  );
}
