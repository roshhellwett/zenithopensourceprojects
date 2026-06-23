import React, { useState } from "react";

interface LandBlock {
  id: string;
  letter: string;
  name: string;
  description: string;
  color: string;
  sideColor: string;
  borderColor: string;
  x: number; // grid x
  y: number; // grid y
}

export default function IsometricBlocks() {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  // 6 blocks forming "ZENITH"
  const blocks: LandBlock[] = [
    {
      id: "z-block",
      letter: "Z",
      name: "Project ZeroGapVote Node [Z]",
      description: "Verifiable digital voting registry proposal for public audit.",
      color: "bg-[#6aa84f]", // Green
      sideColor: "bg-[#4d7339]",
      borderColor: "border-[#23251d]",
      x: 0,
      y: 0,
    },
    {
      id: "e-block",
      letter: "E",
      name: "Project Sentinel Node [E]",
      description: "AI Indian news scraper isolating editorial bias.",
      color: "bg-[#f1a82c]", // Yellow/Amber
      sideColor: "bg-[#be7e18]",
      borderColor: "border-[#23251d]",
      x: 1,
      y: 0,
    },
    {
      id: "n-block",
      letter: "N",
      name: "Project PulseWire Node [N]",
      description: "Linux audio preset chains and EasyEffects dsp configurations.",
      color: "bg-[#2f80fa]", // Blue
      sideColor: "bg-[#1b4fa3]",
      borderColor: "border-[#111827]",
      x: 0,
      y: 1,
    },
    {
      id: "i-block",
      letter: "I",
      name: "Project Monolith Node [I]",
      description: "Telegram SaaS bots automating student notifications.",
      color: "bg-[#818cf8]", // Purple
      sideColor: "bg-[#5b65cc]",
      borderColor: "border-[#23251d]",
      x: 1,
      y: 1,
    },
    {
      id: "t-block",
      letter: "T",
      name: "WinActivation Audit Node [T]",
      description: "Windows licensing audit utilities and housekeeper scripts.",
      color: "bg-[#f54e00]", // Red/Ember
      sideColor: "bg-[#b53600]",
      borderColor: "border-[#23251d]",
      x: 2,
      y: 1,
    },
    {
      id: "h-block",
      letter: "H",
      name: "Project ReadmeGen Node [H]",
      description: "Automated documentation tool compiling repository details.",
      color: "bg-[#2dd4bf]", // Teal
      sideColor: "bg-[#17a18f]",
      borderColor: "border-[#23251d]",
      x: 1,
      y: 2,
    }
  ];

  return (
    <div className="relative w-full h-[400px] select-none flex flex-col justify-center">
      {/* 3D Isometric Keycap Cluster Canvas */}
      <div className="relative flex-grow transform scale-90 sm:scale-95 flex items-center justify-center">
        {blocks.map((block) => {
          const isHovered = hoveredBlock === block.id;

          // Compute screen offsets based on isometric math projection
          const leftOffset = (block.x - block.y) * 44;
          const topOffset = 180 + (block.x + block.y) * 26;
          const zIndex = topOffset;

          return (
            <div
              key={block.id}
              className="absolute cursor-pointer transition-all duration-300 group"
              style={{
                top: `${topOffset}px`,
                left: `calc(50% + ${leftOffset}px)`,
                transform: `translate(-50%, -50%) ${isHovered ? "translateY(-8px)" : ""}`,
                zIndex: zIndex,
              }}
              onMouseEnter={() => setHoveredBlock(block.id)}
              onMouseLeave={() => setHoveredBlock(null)}
            >
              {/* Voxel keycap drawing */}
              <div className="relative w-28 h-14">
                {/* Keycap top face */}
                <div
                  className={`absolute top-0 left-0 w-28 h-14 ${block.color} border-2 ${block.borderColor} rounded-[100%/100%] flex items-center justify-center`}
                  style={{
                    transform: "rotateX(60deg) rotateZ(45deg)",
                    boxShadow: "inset 0px 0px 8px rgba(255,255,255,0.4)"
                  }}
                >
                  <div className="transform -rotate-45 text-white font-mono font-black text-xl select-none flex items-center justify-center tracking-tighter drop-shadow-md">
                    {block.letter}
                  </div>
                </div>

                {/* Keycap Left Side Shadow */}
                <div
                  className={`absolute top-7 left-0 w-[56px] h-10 ${block.sideColor} border-l-2 border-b-2 border-r border-[#23251d]`}
                  style={{
                    clipPath: "polygon(0 0, 100% 50%, 100% 100%, 0 70%)"
                  }}
                />

                {/* Keycap Right Side Shadow */}
                <div
                  className={`absolute top-7 left-[56px] w-[56px] h-10 ${block.sideColor} brightness-75 border-r-2 border-b-2 border-[#23251d]`}
                  style={{
                    clipPath: "polygon(0 50%, 100% 0, 100% 70%, 0 100%)"
                  }}
                />

                {/* Led indicator dot */}
                <div className="absolute top-[3px] left-[52px] w-2.5 h-2.5 bg-green-400 rounded-full border border-black animate-pulse-signal" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Hover Text Box - Borderless, sits cleanly below */}
      <div className="text-center h-8 font-mono text-[11px] text-olive select-none mt-2">
        {hoveredBlock ? (
          <span className="animate-pulse">
            ★ {blocks.find(b => b.id === hoveredBlock)?.name}: {blocks.find(b => b.id === hoveredBlock)?.description}
          </span>
        ) : (
          <span className="opacity-60">[ Hover on Z-E-N-I-T-H keycaps to read specs ]</span>
        )}
      </div>
    </div>
  );
}
