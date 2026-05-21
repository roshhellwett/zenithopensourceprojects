"use client";

/* =========================================================================
   1. IMPORTS
   ========================================================================= */
import React, { useState, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useReducedMotion,
  useScroll,
  useTransform,
  type Transition,
  type Variants
} from "framer-motion";

import {
  Github,
  Twitter,
  Gitlab,
  Terminal,
  FolderGit2,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Globe,
  Linkedin,
  Layers,
  Box,
  Cpu,
  Server,
  LayoutTemplate,
  Code2,
  Sparkles,
  Star,
  Heart,
  Shield,
  Zap,
  Flag,
  Rocket,
  Eye,
  ChevronRight,
  Bot,
  Workflow,
  Users,
  Boxes,
  Filter
} from "lucide-react";

import Script from "next/script";
/* =========================================================================
   BRAND MARK COMPONENT — flat inline SVG "Z" on slate-900
   ========================================================================= */
function BrandMark({ size = 36, rounded = "rounded-2xl" }: { size?: number; rounded?: string }) {
  const pad = Math.round(size * 0.22);
  return (
    <div
      className={`relative ${rounded} bg-slate-900 flex items-center justify-center overflow-hidden shadow-[0_4px_16px_-8px_rgba(15,23,42,0.4)] ring-1 ring-slate-700/50`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size - pad * 2, height: size - pad * 2 }}
        aria-hidden="true"
      >
        <polyline points="4,4 20,4 4,20 20,20" />
      </svg>
    </div>
  );
}

/* =========================================================================
   2. TYPES & INTERFACES
   ========================================================================= */
interface Repo {
  name: string;
  displayName: string;
  link: string;
  desc: string;
  lang: string;
  accent: string;       // tailwind color stem e.g. "emerald"
  category: CategoryId; // ecosystem grouping
  stars?: number;
  homepage?: string | null;
  topics?: string[];
}

type CategoryId =
  | "civic"
  | "ai"
  | "bots"
  | "linux"
  | "systems"
  | "tools";

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/* =========================================================================
   3. STATIC DATA CONFIGURATION
   ========================================================================= */

const SITE_URL = "https://zenithopensourceprojects.vercel.app/";

// Featured (top, latest, nation-focused) project
const FEATURED_FALLBACK: Repo = {
  name: "projectsentinel",
  displayName: "PROJECT SENTINEL",
  link: "https://github.com/roshhellwett/projectsentinel",
  desc:
    "An AI-powered, fully automated Indian news aggregator — built to surface verified, source-checked stories from across the nation in real time. A TypeScript pipeline that fuses scraping, classification, and editorial automation into a single live newsroom.",
  lang: "TypeScript",
  accent: "amber",
  category: "ai",
  homepage: "https://verifiedindian.vercel.app",
  topics: ["ai", "india", "news-aggregator", "automation"]
};

const FALLBACK_REPOS: Repo[] = [
  {
    name: "projectzerogapvote",
    displayName: "PROJECT ZEROGAPVOTE",
    link: "https://github.com/roshhellwett/projectzerogapvote",
    desc:
      "Blueprint for modernizing India's electronic voting system — a transparent, verifiable, and tamper-resistant architecture proposal designed for the world's largest democracy.",
    lang: "TypeScript",
    accent: "emerald",
    category: "civic",
    homepage: "https://projectzerogapvote.vercel.app"
  },
  {
    name: "projectpulsewire",
    displayName: "PROJECT PULSEWIRE",
    link: "https://github.com/roshhellwett/projectpulsewire",
    desc:
      "PulseWire and EasyEffects presets for Linux — a curated audio chain library for creators, gamers, and engineers running open source desktop stacks.",
    lang: "Python",
    accent: "sky",
    category: "linux"
  },
  {
    name: "projectmonolith",
    displayName: "PROJECT MONOLITH",
    link: "https://github.com/roshhellwett/projectmonolith",
    desc:
      "Multi-tenant SaaS Telegram bots for academic notifications, automation, and student workflows — a Python platform built to keep universities and learners updated in real time.",
    lang: "Python",
    accent: "indigo",
    category: "bots"
  },
  {
    name: "projectwinactivation",
    displayName: "PROJECT WINACTIVATION",
    link: "https://github.com/roshhellwett/projectwinactivation",
    desc:
      "Windows OS activation and housekeeping utilities — reproducible, transparent open source tooling for license checks, system audits, and clean‑boot automation.",
    lang: "Python",
    accent: "blue",
    category: "systems"
  },
  {
    name: "projectgrub",
    displayName: "PROJECT GRUB",
    link: "https://github.com/roshhellwett/projectgrub",
    desc:
      "Custom GRUB bootloader themes and presets for Linux — student-friendly, aesthetic multi-boot setups with readable, minimal typography.",
    lang: "Python",
    accent: "purple",
    category: "linux"
  },
  {
    name: "projectlogichands",
    displayName: "PROJECT LOGICHANDS",
    link: "https://github.com/roshhellwett/projectlogichands",
    desc:
      "A fast, minimal, and interactive Rock–Paper–Scissors engine in C++ — a teaching artifact for clean game loops, input parsing, and deterministic outcomes.",
    lang: "C++",
    accent: "rose",
    category: "systems"
  },
  {
    name: "projectpaynix",
    displayName: "PROJECT PAYNIX",
    link: "https://github.com/roshhellwett/projectpaynix",
    desc:
      "Lightweight C++ billing software — clean transaction flows, validation, and receipt generation for small businesses and counter terminals.",
    lang: "C++",
    accent: "orange",
    category: "systems"
  },
  {
    name: "projectreadmegen",
    displayName: "PROJECT README-GEN",
    link: "https://github.com/roshhellwett/projectreadmegen",
    desc:
      "Auto-generate beautiful, structured README files for any repository — built for developers who care about discoverability and onboarding.",
    lang: "Python",
    accent: "teal",
    category: "tools"
  }
];

/* =========================================================================
   3b. CATEGORIES — used by ecosystem diagram + project filter
   ========================================================================= */
const CATEGORIES: {
  id: CategoryId | "all";
  label: string;
  short: string;
  icon: React.ReactNode;
  accent: string;
  description: string;
}[] = [
  { id: "all", label: "All projects", short: "All", icon: <Boxes size={14} />, accent: "slate", description: "Every project in one place" },
  { id: "civic", label: "Civic-Tech", short: "Civic", icon: <Flag size={14} />, accent: "emerald", description: "Tools for democracy & public good" },
  { id: "ai", label: "AI & Intelligence", short: "AI", icon: <Sparkles size={14} />, accent: "amber", description: "Automated systems & inference" },
  { id: "bots", label: "Bots & Automation", short: "Bots", icon: <Bot size={14} />, accent: "indigo", description: "Telegram, scheduled jobs, agents" },
  { id: "linux", label: "Linux & Audio", short: "Linux", icon: <Terminal size={14} />, accent: "sky", description: "GRUB, audio chains, desktop" },
  { id: "systems", label: "Systems & C/C++", short: "Systems", icon: <Cpu size={14} />, accent: "rose", description: "Low-level engines & utilities" },
  { id: "tools", label: "Developer Tools", short: "Tools", icon: <Workflow size={14} />, accent: "teal", description: "Workflows & DX accelerators" }
];

const STACK = [
  {
    category: "Systems & Logic Core",
    icon: <Cpu size={16} />,
    accent: "indigo",
    concept:
      "Low-level memory, OOP, and algorithmic thinking across multiple paradigms.",
    items: ["C", "C++", "Python", "Java"]
  },
  {
    category: "Web & Interface Ecosystem",
    icon: <LayoutTemplate size={16} />,
    accent: "sky",
    concept:
      "Component-based architecture, async state, and responsive design at scale.",
    items: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js"]
  },
  {
    category: "Data Infrastructure & Ops",
    icon: <Server size={16} />,
    accent: "emerald",
    concept:
      "Relational vs NoSQL modeling, distributed VCS, Linux administration.",
    items: ["MySQL", "MongoDB", "Linux", "Git"]
  }
];

const SOCIALS = [
  { label: "LinkedIn", icon: <Linkedin size={16} />, link: "https://www.linkedin.com/in/roshhellwett", accent: "sky" },
  { label: "GitHub", icon: <Github size={16} />, link: "https://github.com/roshhellwett", accent: "zinc" },
  { label: "ORCID", icon: <GraduationCap size={16} />, link: "https://orcid.org/0009-0008-7213-6376", accent: "lime" },
  { label: "Stack Overflow", icon: <Layers size={16} />, link: "https://stackoverflow.com/users/17301307/roshhellwett", accent: "amber" },
  { label: "SourceForge", icon: <Box size={16} />, link: "https://sourceforge.net/u/roshhellwett/profile", accent: "orange" },
  { label: "GitLab", icon: <Gitlab size={16} />, link: "https://gitlab.com/roshhellwett", accent: "rose" },
  { label: "Twitter / X", icon: <Twitter size={16} />, link: "https://twitter.com/roshhellwett", accent: "sky" },
  { label: "Google Dev", icon: <Globe size={16} />, link: "https://g.dev/roshhellwett", accent: "blue" }
];

const NAV_LINKS = [
  { label: "Mission", href: "#mission" },
  { label: "Featured", href: "#featured" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#stack" },
  { label: "Founder", href: "#founder" }
];

/* =========================================================================
   4. ANIMATION CONFIG
   ========================================================================= */
const spring: Transition = { type: "spring", stiffness: 100, damping: 20 };
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};
const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

/* =========================================================================
   5. UI PRIMITIVES
   ========================================================================= */

/* =========================================================================
   DASH FIELD — antigravity-style scattered diagonal dashes in Indian palette
   (saffron + emerald + slate). Two swirl focal points, gentle fade animation,
   subtle cursor halo overlay for warmth.
   ========================================================================= */
function DashField() {
  const reduce = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Deterministic scatter — seeded so SSR matches client.
  // All floats are rounded to fixed precision to avoid hydration drift
  // between Node and browser JS engines (Math.sin/cos can differ in the
  // last few decimals).
  const dashes = useMemo(() => {
    const seed = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;
    const round = (n: number) => Math.round(n * 10000) / 10000;
    const COUNT = 170;
    // Two soft focal points (left wing, right wing)
    const focals = [
      { x: 25, y: 35 },
      { x: 75, y: 62 }
    ];
    const arr: {
      x: number;
      y: number;
      angle: number;
      length: number;
      color: string;
      delay: number;
      duration: number;
    }[] = [];

    for (let i = 0; i < COUNT; i++) {
      const r1 = seed(i * 3.7 + 1);
      const r2 = seed(i * 5.1 + 11);
      const r3 = seed(i * 7.3 + 23);
      const r4 = seed(i * 11.1 + 37);
      const r5 = seed(i * 13.7 + 51);

      const focalIdx = r1 < 0.5 ? 0 : 1;
      const focal = focals[focalIdx];

      // Polar coordinates around the focal — biased toward closer
      const angle = r2 * Math.PI * 2;
      const radius = Math.pow(r3, 0.55) * 55;
      const x = round(focal.x + Math.cos(angle) * radius);
      const y = round(focal.y + Math.sin(angle) * radius * 0.85);

      // Off-screen culling
      if (x < -5 || x > 105 || y < -5 || y > 105) continue;

      const dashAngle = round((r4 - 0.5) * 90); // -45° to 45°
      const length = round(0.7 + r5 * 1.6);

      // Color palette: saffron-side, emerald-side, slate accents
      const cRoll = (r2 + r5) / 2;
      let color: string;
      if (focalIdx === 0) {
        if (cRoll < 0.55) color = "rgba(234,88,12,0.95)"; // orange-600
        else if (cRoll < 0.78) color = "rgba(245,158,11,0.85)"; // amber-500
        else if (cRoll < 0.92) color = "rgba(15,23,42,0.55)"; // slate
        else color = "rgba(5,150,105,0.7)"; // emerald accent
      } else {
        if (cRoll < 0.55) color = "rgba(5,150,105,0.95)"; // emerald-600
        else if (cRoll < 0.78) color = "rgba(16,185,129,0.85)"; // emerald-500
        else if (cRoll < 0.92) color = "rgba(15,23,42,0.55)"; // slate
        else color = "rgba(234,88,12,0.7)"; // saffron accent
      }

      arr.push({
        x,
        y,
        angle: dashAngle,
        length,
        color,
        delay: r5 * 5,
        duration: 4 + (r4 * 4)
      });
    }
    return arr;
  }, []);

  // Optional subtle cursor halo (CSS-var driven, so no React re-renders)
  useEffect(() => {
    if (typeof window === "undefined" || reduce) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    let nx = 0;
    let ny = 0;
    const apply = () => {
      const el = containerRef.current;
      if (!el) return;
      el.style.setProperty("--cx", `${nx}px`);
      el.style.setProperty("--cy", `${ny}px`);
    };
    const onMove = (e: MouseEvent) => {
      nx = e.clientX;
      ny = e.clientY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      nx = -500;
      ny = -500;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={
        {
          zIndex: 0,
          "--cx": "-500px",
          "--cy": "-500px"
        } as React.CSSProperties
      }
    >
      {/* Keyframes + @property registration for the breathing pulse */}
      <style>{`
        @property --pulse-r {
          syntax: '<length>';
          inherits: false;
          initial-value: 240px;
        }
        @keyframes dashFade {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.9; }
        }
        @keyframes pulseBreathe {
          0%, 100% { --pulse-r: 200px; }
          50%      { --pulse-r: 380px; }
        }
        @keyframes haloPulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1;    }
        }
      `}</style>

      {/* Layer 1 — base dash field, ambient fade */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {dashes.map((d, i) => {
          const rad = (d.angle * Math.PI) / 180;
          const dx = Math.round(((Math.cos(rad) * d.length) / 2) * 10000) / 10000;
          const dy = Math.round(((Math.sin(rad) * d.length) / 2) * 10000) / 10000;
          return (
            <line
              key={i}
              x1={d.x - dx}
              y1={d.y - dy}
              x2={d.x + dx}
              y2={d.y + dy}
              stroke={d.color}
              strokeWidth={1.2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={
                reduce
                  ? { opacity: 0.5 }
                  : {
                      animation: `dashFade ${d.duration}s ease-in-out ${d.delay}s infinite`
                    }
              }
            />
          );
        })}
      </svg>

      {/* Layer 2 — bolder highlight dashes, masked by breathing radial.
          The mask radius pulses continuously, so the "alive" zone around the
          cursor contracts and expands like a slow breath. */}
      {!reduce && (
        <div
          className="absolute inset-0"
          style={{
            animation: "pulseBreathe 3.6s ease-in-out infinite",
            WebkitMaskImage:
              "radial-gradient(var(--pulse-r) circle at var(--cx) var(--cy), rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)",
            maskImage:
              "radial-gradient(var(--pulse-r) circle at var(--cx) var(--cy), rgba(0,0,0,1) 0%, rgba(0,0,0,0) 75%)"
          }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            {dashes.map((d, i) => {
              const rad = (d.angle * Math.PI) / 180;
              // Highlight dashes are ~35% longer for a "blooming" feel
              const dx =
                Math.round(((Math.cos(rad) * d.length * 1.35) / 2) * 10000) / 10000;
              const dy =
                Math.round(((Math.sin(rad) * d.length * 1.35) / 2) * 10000) / 10000;
              return (
                <line
                  key={i}
                  x1={d.x - dx}
                  y1={d.y - dy}
                  x2={d.x + dx}
                  y2={d.y + dy}
                  stroke={d.color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Layer 3 — warm saffron+emerald halo, also breathes */}
      {!reduce && (
        <div
          className="absolute inset-0"
          style={{
            animation:
              "pulseBreathe 3.6s ease-in-out infinite, haloPulse 3.6s ease-in-out infinite",
            background:
              "radial-gradient(var(--pulse-r) circle at var(--cx) var(--cy), rgba(251,146,60,0.18) 0%, rgba(16,185,129,0.10) 40%, rgba(255,255,255,0) 75%)"
          }}
        />
      )}
    </div>
  );
}

function Background() {
  const reduce = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ backgroundColor: "#FAFAF7" }}>
      {/* Soft top vignette */}
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

function Panel({ children, className = "", delay = 0 }: PanelProps) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ ...spring, delay }}
      className={`grain relative bg-white/60 backdrop-blur-xl backdrop-saturate-150 border border-white/70 ring-1 ring-slate-200/40 rounded-3xl overflow-hidden shadow-[0_8px_30px_-16px_rgba(15,23,42,0.12)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-white/70 to-transparent" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

const TrafficLights = () => (
  <div className="flex gap-1">
    <div className="w-2 h-2 rounded-full bg-rose-400/80" />
    <div className="w-2 h-2 rounded-full bg-amber-400/80" />
    <div className="w-2 h-2 rounded-full bg-emerald-400/80" />
  </div>
);

const Pill = ({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase border border-slate-200/60 bg-white/85 text-slate-500 shadow-[0_1px_3px_-2px_rgba(15,23,42,0.06)] ${className}`}
  >
    {children}
  </span>
);

const Divider = () => (
  <div className="max-w-7xl mx-auto px-6 md:px-6">
    <div className="relative h-px">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/40 to-transparent" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 rounded-full bg-slate-300/50 ring-[6px] ring-[#fafaf7]" />
    </div>
  </div>
);

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  icon
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) => (
  <div className="mb-12 md:mb-16">
    <div className="flex items-center gap-3 mb-4">
      {icon && (
        <span className="p-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-slate-500 shadow-[0_1px_3px_-2px_rgba(15,23,42,0.06)]">
          {icon}
        </span>
      )}
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400">
        {eyebrow}
      </span>
    </div>
    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.04]">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-5 text-sm md:text-base text-slate-500 max-w-2xl leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

/* =========================================================================
   5b. ECOSYSTEM DIAGRAM — animated SVG showing how Zenith projects connect
   ========================================================================= */
function EcosystemDiagram({
  active,
  onSelect,
  countsByCategory
}: {
  active: CategoryId | "all";
  onSelect: (id: CategoryId | "all") => void;
  countsByCategory: Record<string, number>;
}) {
  const reduce = useReducedMotion();
  const cats = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <div className="grain relative rounded-3xl border border-white/70 ring-1 ring-slate-200/40 bg-white/60 backdrop-blur-xl backdrop-saturate-150 p-6 md:p-10 overflow-hidden shadow-[0_8px_30px_-16px_rgba(15,23,42,0.12)]">
      {/* Soft ambient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-100/40 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-100/40 blur-[80px]" />

      {/* Header */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-10">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-slate-500 shadow-[0_1px_3px_-2px_rgba(15,23,42,0.06)]">
            <Workflow size={14} />
          </span>
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400">
            Ecosystem Map
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          Live · Synced from GitHub
        </div>
      </div>

      {/* Diagram body */}
      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 items-center">
        {/* SVG connectors (desktop only, behind nodes) */}
        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="lineGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="rgb(148 163 184 / 0.15)" />
              <stop offset="50%" stopColor="rgb(148 163 184 / 0.45)" />
              <stop offset="100%" stopColor="rgb(148 163 184 / 0.15)" />
            </linearGradient>
            <linearGradient id="pulseGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="rgb(245 158 11 / 0)" />
              <stop offset="50%" stopColor="rgb(245 158 11 / 0.9)" />
              <stop offset="100%" stopColor="rgb(16 185 129 / 0)" />
            </linearGradient>
          </defs>
          {/* Left bundle */}
          {[20, 35, 50, 65, 80].map((y, i) => (
            <g key={`l${i}`}>
              <line
                x1="18"
                y1={y}
                x2="50"
                y2="50"
                stroke="url(#lineGrad)"
                strokeWidth="0.4"
                strokeDasharray="1 1.5"
              />
              {!reduce && (
                <motion.circle
                  r="0.7"
                  fill="rgb(245 158 11)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    cx: [18, 50],
                    cy: [y, 50]
                  }}
                  transition={{
                    duration: 2.6,
                    delay: i * 0.45,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </g>
          ))}
          {/* Right bundle */}
          {[30, 50, 70].map((y, i) => (
            <g key={`r${i}`}>
              <line
                x1="50"
                y1="50"
                x2="82"
                y2={y}
                stroke="url(#lineGrad)"
                strokeWidth="0.4"
                strokeDasharray="1 1.5"
              />
              {!reduce && (
                <motion.circle
                  r="0.7"
                  fill="rgb(16 185 129)"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    cx: [50, 82],
                    cy: [50, y]
                  }}
                  transition={{
                    duration: 2.4,
                    delay: 0.6 + i * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </g>
          ))}
        </svg>

        {/* LEFT: Category nodes */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2">
          {cats.map((c, i) => {
            const isActive = active === c.id;
            return (
              <motion.button
                key={c.id}
                type="button"
                onClick={() => onSelect(isActive ? "all" : c.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, ...spring }}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2 ${
                  isActive
                    ? `bg-${c.accent}-50/80 border-${c.accent}-300/60 shadow-[0_2px_6px_-3px_rgba(15,23,42,0.08)]`
                    : "bg-white/80 border-slate-200/60 hover:bg-slate-50/80"
                }`}
              >
                <span
                  className={`p-1.5 rounded-lg border bg-${c.accent}-50/80 border-${c.accent}-200/60 text-${c.accent}-600`}
                >
                  {c.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold tracking-wide text-slate-700 truncate">
                    {c.label}
                  </div>
                  <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-slate-400">
                    {countsByCategory[c.id] || 0} repos
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* CENTER: Zenith Core */}
        <div className="relative z-10 flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={spring}
            className="relative"
          >
            {/* Pulsing ring */}
            {!reduce && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-3xl border-2 border-slate-300"
                />
                <motion.div
                  animate={{ scale: [1, 1.6], opacity: [0.35, 0] }}
                  transition={{
                    duration: 2.4,
                    delay: 0.8,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 rounded-3xl border-2 border-slate-300"
                />
              </>
            )}
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-black flex flex-col items-center justify-center text-white shadow-[0_20px_50px_-15px_rgba(15,23,42,0.45)]">
              <BrandMark size={64} rounded="rounded-2xl" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-white/90 border border-slate-200/60 text-[9px] font-bold tracking-[0.15em] uppercase text-slate-500 shadow-[0_1px_3px_-2px_rgba(15,23,42,0.06)] whitespace-nowrap">
                Zenith Core
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Outputs */}
        <div className="relative z-10 grid grid-cols-1 gap-2.5">
          {[
            {
              label: "GitHub Repos",
              value: `${
                Object.values(countsByCategory).reduce((a, b) => a + b, 0) || 9
              }+ Public`,
              icon: <Github size={14} />,
              accent: "slate"
            },
            {
              label: "Live Demos",
              value: "Sentinel · ZeroGapVote",
              icon: <Eye size={14} />,
              accent: "emerald"
            },
            {
              label: "Community",
              value: "Stars · Forks · PRs",
              icon: <Users size={14} />,
              accent: "amber"
            }
          ].map((o, i) => (
            <motion.div
              key={o.label}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08, ...spring }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-200/60 bg-white/80 shadow-[0_1px_4px_-2px_rgba(15,23,42,0.06)] hover:shadow-[0_4px_12px_-6px_rgba(15,23,42,0.1)] hover:bg-white transition-all duration-200"
            >
              <span
                className={`p-1.5 rounded-lg bg-${o.accent}-50/80 border border-${o.accent}-200/60 text-${o.accent}-600`}
              >
                {o.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold tracking-[0.15em] text-slate-800 truncate">
                  {o.label}
                </div>
                <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-400 truncate">
                  {o.value}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="relative mt-8 pt-6 border-t border-slate-200/40 flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
        <span className="flex items-center gap-1.5">
          <Filter size={10} /> Tap a category to filter the grid below
        </span>
        <span>{active === "all" ? "Showing all projects" : `Filtering: ${CATEGORIES.find((c) => c.id === active)?.label}`}</span>
      </div>
    </div>
  );
}

/* =========================================================================
   5d. LIFECYCLE LOOP — circular orbital diagram for the Mission section
   ========================================================================= */
function LifecycleLoop() {
  const reduce = useReducedMotion();
  const stages = [
    { label: "Build", angle: -90, accent: "amber" },
    { label: "Ship", angle: 0, accent: "emerald" },
    { label: "Open", angle: 90, accent: "sky" },
    { label: "Iterate", angle: 180, accent: "rose" }
  ];

  const polar = (angle: number, r: number) => ({
    x: 50 + r * Math.cos((angle * Math.PI) / 180),
    y: 50 + r * Math.sin((angle * Math.PI) / 180)
  });

  return (
    <div className="relative aspect-square w-full max-w-[420px] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="loopGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(255,255,255)" />
            <stop offset="100%" stopColor="rgb(248,250,252)" />
          </radialGradient>
        </defs>

        {/* Outer halo */}
        <circle cx="50" cy="50" r="42" fill="url(#loopGlow)" />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="rgb(15,23,42)"
          strokeOpacity="0.08"
          strokeWidth="0.4"
        />

        {/* Dashed orbital path */}
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="none"
          stroke="rgb(15,23,42)"
          strokeOpacity="0.18"
          strokeWidth="0.4"
          strokeDasharray="0.7 1.2"
        />

        {/* Inner ring */}
        <circle
          cx="50"
          cy="50"
          r="14"
          fill="white"
          stroke="rgb(15,23,42)"
          strokeOpacity="0.1"
          strokeWidth="0.3"
        />

        {/* Orbiting dot */}
        {!reduce && (
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}
          >
            <circle cx="50" cy="14" r="1.4" fill="rgb(245,158,11)" />
            <circle cx="50" cy="14" r="2.6" fill="rgb(245,158,11)" fillOpacity="0.25" />
          </motion.g>
        )}

        {/* Stage nodes */}
        {stages.map((s, i) => {
          const p = polar(s.angle, 36);
          return (
            <g key={s.label}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="white"
                stroke="rgb(15,23,42)"
                strokeOpacity="0.25"
                strokeWidth="0.4"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, ...spring }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              />
              {!reduce && (
                <motion.circle
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="none"
                  stroke="rgb(15,23,42)"
                  strokeOpacity="0.4"
                  strokeWidth="0.3"
                  animate={{ r: [3.5, 6, 3.5], opacity: [0.4, 0, 0.4] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeOut"
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Stage labels (HTML, absolutely positioned) */}
      {stages.map((s) => {
        const p = polar(s.angle, 50);
        return (
          <div
            key={`label-${s.label}`}
            className="absolute"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: "translate(-50%, -50%)"
            }}
          >
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 border border-${s.accent}-200/60 text-${s.accent}-700 text-[10px] font-bold tracking-[0.15em] uppercase shadow-[0_1px_3px_-2px_rgba(15,23,42,0.06)] whitespace-nowrap`}
            >
              <span className={`w-1 h-1 rounded-full bg-${s.accent}-500/80`} />
              {s.label}
            </span>
          </div>
        );
      })}

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-[8px] font-bold tracking-[0.3em] uppercase text-slate-400">
          Open Source
        </div>
        <div className="text-sm font-bold tracking-tight text-slate-800">
          Lifecycle
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   5e. COMMIT HEATMAP — GitHub-style activity grid for the Founder section
   ========================================================================= */
function CommitHeatmap() {
  // Deterministic pseudo-random levels (0-4) — seeded so SSR matches
  const seed = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;
  const cols = 26;
  const rows = 7;
  const cells: { level: number }[] = Array.from({ length: cols * rows }, (_, i) => {
    const r = seed(i);
    // bias toward more activity in the right half (recent)
    const recencyBoost = (i % cols) / cols;
    const v = r * 0.65 + recencyBoost * 0.35;
    let level = 0;
    if (v > 0.85) level = 4;
    else if (v > 0.7) level = 3;
    else if (v > 0.5) level = 2;
    else if (v > 0.3) level = 1;
    return { level };
  });

  const levelClass = [
    "bg-slate-100",
    "bg-emerald-200",
    "bg-emerald-300",
    "bg-emerald-400",
    "bg-emerald-600"
  ];

  return (
    <div className="grain relative overflow-hidden rounded-2xl border border-white/70 ring-1 ring-slate-200/40 bg-white/60 backdrop-blur-xl backdrop-saturate-150 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/60 text-emerald-500">
            <Zap size={11} />
          </span>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-500">
            Commit Cadence · Last 26 weeks
          </span>
        </div>
        <span className="text-[9px] font-bold tracking-[0.1em] uppercase text-slate-400">
          Less <span className="inline-flex gap-0.5 mx-1.5 align-middle">
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} className={`w-1.5 h-1.5 rounded-[2px] ${levelClass[l]}`} />
            ))}
          </span> More
        </span>
      </div>

      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridAutoFlow: "column",
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
        }}
      >
        {cells.map((c, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.25,
              delay: (i / cells.length) * 0.6
            }}
            className={`aspect-square rounded-[3px] ${levelClass[c.level]}`}
          />
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   5f. BHARAT WAVE — flowing tricolor curves with code particles
   ========================================================================= */
function BharatWave() {
  const reduce = useReducedMotion();
  return (
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-28 md:h-36"
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="saffronWave" x1="0" x2="1">
            <stop offset="0%" stopColor="rgb(251,146,60)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(251,146,60)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(251,146,60)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="emeraldWave" x1="0" x2="1">
            <stop offset="0%" stopColor="rgb(16,185,129)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(16,185,129)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(16,185,129)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Saffron wave */}
        <motion.path
          d="M -10 30 Q 25 10 50 30 T 110 30 T 170 30 T 230 30"
          fill="none"
          stroke="url(#saffronWave)"
          strokeWidth="1"
          strokeLinecap="round"
          animate={reduce ? {} : { x: [0, -60, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />
        {/* Emerald wave */}
        <motion.path
          d="M -10 38 Q 25 58 50 38 T 110 38 T 170 38 T 230 38"
          fill="none"
          stroke="url(#emeraldWave)"
          strokeWidth="1"
          strokeLinecap="round"
          animate={reduce ? {} : { x: [0, 60, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />

      {/* Floating code particles */}
      {!reduce &&
        [
          { x: 20, d: 0 }, { x: 55, d: 1.5 }, { x: 90, d: 3 },
          { x: 120, d: 0.8 }, { x: 155, d: 2.4 }, { x: 180, d: 4 }
        ].map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            r="0.6"
            fill={i % 2 === 0 ? "rgb(251,146,60)" : "rgb(16,185,129)"}
            animate={{ cy: [50, 12, 50], opacity: [0, 0.8, 0] }}
            transition={{
              duration: 6,
              delay: p.d,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
    </svg>
  );
}

/* =========================================================================
   6. REPO CARD
   ========================================================================= */
function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const [hover, setHover] = useState(false);
  const categoryIcon: Record<string, React.ReactNode> = {
    civic: <Flag size={18} />,
    ai: <Sparkles size={18} />,
    bots: <Bot size={18} />,
    linux: <Terminal size={18} />,
    systems: <Cpu size={18} />,
    tools: <Workflow size={18} />
  };
  const icon = categoryIcon[repo.category] ?? <FolderGit2 size={18} />;

  return (
    <motion.a
      href={repo.link}
      target="_blank"
      rel="noreferrer"
      variants={fadeUp}
      transition={{ ...spring, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group block h-full"
    >
      <div className="grain relative h-full bg-white/60 hover:bg-white/80 backdrop-blur-xl backdrop-saturate-150 border border-white/70 ring-1 ring-slate-200/40 hover:ring-slate-300/60 rounded-3xl overflow-hidden transition-all duration-200 shadow-[0_4px_16px_-10px_rgba(15,23,42,0.1)] hover:shadow-[0_12px_32px_-16px_rgba(15,23,42,0.18)]">
        {/* Glow */}
        <div
          className={`pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-${repo.accent}-200/30 via-transparent to-transparent`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 to-transparent" />

        {/* Header strip */}
        <div className="relative px-5 py-3 border-b border-slate-200/50 flex items-center justify-between">
          <TrafficLights />
          <span className="text-[9px] font-bold text-slate-400 tracking-[0.15em] uppercase truncate ml-3">
            {repo.name}.sh
          </span>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
            {typeof repo.stars === "number" && (
              <>
                <Star size={10} className="fill-amber-400/80 text-amber-400/80" />
                {repo.stars}
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="relative p-5 flex flex-col h-[calc(100%-45px)]">
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`shrink-0 p-2.5 rounded-xl border border-${repo.accent}-200/60 bg-${repo.accent}-50/80 text-${repo.accent}-500 shadow-[0_1px_3px_-2px_rgba(15,23,42,0.06)] transition-transform duration-200 group-hover:scale-105`}
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-black tracking-tight text-slate-900 leading-tight">
                {repo.displayName}
              </h3>
              <div className="mt-0.5 text-[9px] font-bold tracking-[0.15em] uppercase text-slate-400">
                Open Source · MIT
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-500 mb-5 flex-1">
            {repo.desc}
          </p>

          <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-slate-200/50">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-${repo.accent}-500`}
            >
              <span className={`w-1 h-1 rounded-full bg-${repo.accent}-400`} />
              {repo.lang}
            </span>
            <motion.div
              animate={{ x: hover ? 4 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 group-hover:text-slate-800 transition-colors duration-200"
            >
              View repo <ArrowUpRight size={13} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

/* =========================================================================
   7. FEATURED PROJECT
   ========================================================================= */
function FeaturedProject({ repo }: { repo: Repo }) {
  return (
    <motion.div variants={fadeUp} transition={spring} className="relative">
      <div className="grain relative overflow-hidden rounded-[2rem] border border-white/70 ring-1 ring-slate-200/40 bg-gradient-to-br from-amber-50/80 via-white/60 to-emerald-50/80 backdrop-blur-xl backdrop-saturate-150 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.15)]">
        {/* India accent strip */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-orange-400/80 via-slate-300/60 to-emerald-500/80" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-200/40 blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-emerald-200/40 blur-[100px]" />

        <div className="relative grid md:grid-cols-[1.2fr_1fr] gap-8 p-8 md:p-12">
          {/* LEFT: Copy */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Pill>
                <Sparkles size={10} /> Featured · Latest
              </Pill>
              <Pill>
                <Flag size={10} /> Made for Bharat
              </Pill>
            </div>

            <h3 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[0.95]">
              {repo.displayName}
            </h3>
            <div className="mt-3 text-sm font-bold tracking-[0.15em] uppercase text-slate-400">
              AI · News Intelligence · {repo.lang}
            </div>

            <p className="mt-6 text-base md:text-lg text-slate-500 leading-relaxed max-w-xl">
              {repo.desc}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {repo.homepage && (
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-900/20 focus-visible:outline-2 focus-visible:outline-orange-400 focus-visible:outline-offset-2"
                >
                  <Eye size={16} /> Live Demo
                  <ArrowUpRight
                    size={16}
                    className="group-hover:rotate-45 transition-transform duration-200"
                  />
                </a>
              )}
              <a
                href={repo.link}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/90 border border-slate-200/60 text-slate-700 font-bold text-sm hover:bg-white hover:border-slate-300/60 transition-all duration-200 shadow-[0_2px_8px_-4px_rgba(15,23,42,0.08)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2"
              >
                <Github size={16} /> Source Code
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </div>

          {/* RIGHT: Terminal mock */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-900/80 bg-slate-950 overflow-hidden shadow-[0_16px_48px_-24px_rgba(15,23,42,0.4)]">
              <div className="px-4 py-2.5 border-b border-white/[0.07] flex items-center justify-between bg-slate-900/60">
                <TrafficLights />
                <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/40">
                  sentinel ~ live
                </span>
                <div className="w-10" />
              </div>
              <div className="p-5 font-mono text-[11px] md:text-xs space-y-2 text-white/80">
                <div>
                  <span className="text-amber-300">$</span> sentinel --pull --india
                </div>
                <div className="text-white/50">
                  → resolving sources... <span className="text-emerald-300">200 OK</span>
                </div>
                <div className="text-white/50">
                  → classifying headlines (AI) ✓
                </div>
                <div className="text-white/50">
                  → cross-verifying with mirror feeds ✓
                </div>
                <div className="text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={12} /> 142 verified stories published
                </div>
                <div className="pt-3 grid grid-cols-3 gap-2">
                  {["AI", "TS", "Next", "Edge", "RSS", "NLP"].map((t) => (
                    <span
                      key={t}
                      className="text-center px-2 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 text-white/70 text-[10px] font-bold tracking-[0.15em] hover:bg-white/[0.12] transition-colors duration-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
              <Shield size={12} /> MIT Licensed · Built in India · Public good
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
   8. STRUCTURED DATA
   ========================================================================= */
function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Zenith Open Source Projects",
    description:
      "An open source collective by Roshan Kr Singh (@roshhellwett) building tools, bots, and civic-tech for India and the world.",
    url: SITE_URL,
    creator: {
      "@type": "Person",
      name: "Roshan Kr Singh",
      alternateName: "roshhellwett",
      email: "mailto:roshhellwett@icloud.com",
      sameAs: [
        "https://github.com/roshhellwett",
        "https://g.dev/roshhellwett",
        "https://www.linkedin.com/in/roshhellwett",
        "https://stackoverflow.com/users/17301307/roshhellwett",
        "https://sourceforge.net/u/roshhellwett/profile",
        "https://gitlab.com/roshhellwett",
        "https://twitter.com/roshhellwett"
      ]
    }
  };

  return (
    <Script
      id="zenith-structured-data"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/* =========================================================================
   9. MAIN PAGE
   ========================================================================= */
export default function Page() {
  const [featured, setFeatured] = useState<Repo>(FEATURED_FALLBACK);
  const [repos, setRepos] = useState<Repo[]>(FALLBACK_REPOS);
  const [stats, setStats] = useState({ repos: 0, stars: 0, langs: 0 });
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");

  const { scrollYProgress } = useScroll();
  const progressX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/roshhellwett/repos?per_page=100"
        );
        if (!response.ok) throw new Error("rate limited");
        const data: any[] = await response.json();

        // Update featured
        const sentinel = data.find((r) => r.name === FEATURED_FALLBACK.name);
        if (sentinel) {
          setFeatured((f) => ({
            ...f,
            link: sentinel.html_url,
            homepage: sentinel.homepage || f.homepage,
            stars: sentinel.stargazers_count,
            lang: sentinel.language || f.lang
          }));
        }

        // Update grid
        const liveRepos = FALLBACK_REPOS.map((fb) => {
          const live = data.find((r) => r.name === fb.name);
          if (!live) return fb;
          return {
            ...fb,
            link: live.html_url,
            lang: live.language || fb.lang,
            stars: live.stargazers_count,
            homepage: live.homepage || fb.homepage
          };
        });
        setRepos(liveRepos);

        // Stats (public, non-fork)
        const own = data.filter((r) => !r.fork);
        const totalStars = own.reduce(
          (s, r) => s + (r.stargazers_count || 0),
          0
        );
        const langs = new Set(
          own.map((r) => r.language).filter((l) => Boolean(l))
        );
        setStats({ repos: own.length, stars: totalStars, langs: langs.size });
      } catch (e) {
        console.warn("Using fallback repo data");
      }
    };
    fetchGithubData();
  }, []);

  const countsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    [featured, ...repos].forEach((r) => {
      map[r.category] = (map[r.category] || 0) + 1;
    });
    return map;
  }, [featured, repos]);

  const filteredRepos = useMemo(() => {
    if (activeCategory === "all") return repos;
    return repos.filter((r) => r.category === activeCategory);
  }, [repos, activeCategory]);

  const ORG_STATS = useMemo(
    () => [
      {
        label: "Public Repos",
        value: stats.repos || 18,
        icon: <FolderGit2 size={16} />
      },
      {
        label: "Community Stars",
        value: stats.stars || 38,
        icon: <Star size={16} />
      },
      {
        label: "Languages",
        value: stats.langs || 8,
        icon: <Code2 size={16} />
      },
      { label: "Mission", value: "Bharat", icon: <Flag size={16} /> }
    ],
    [stats]
  );

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-slate-900 selection:text-white relative flex flex-col">
      {/* a11y — keyboard users can jump directly to content */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <StructuredData />
      <Background />
      <DashField />

      {/* Scroll progress bar — tricolor reveal */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] bg-gradient-to-r from-orange-500 via-slate-300 to-emerald-600 shadow-[0_0_12px_rgba(234,88,12,0.35)]"
      />

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl backdrop-saturate-150 bg-white/65 border-b border-slate-200/50 shadow-[0_0.5px_0_0_rgba(15,23,42,0.04)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3 group">
            <BrandMark size={38} rounded="rounded-xl" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm md:text-[15px] font-black tracking-tight text-slate-900">
                ZENITH
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-500">
                Open Source Projects
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 text-xs font-bold tracking-wide text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100/60 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="https://github.com/roshhellwett?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all duration-200 shadow-[0_1px_3px_-2px_rgba(15,23,42,0.1)] focus-visible:outline-2 focus-visible:outline-orange-400 focus-visible:outline-offset-2"
          >
            <Github size={14} />
            <span className="hidden sm:inline">All Repos</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </header>

      <main
        id="main"
        className="relative z-10 w-full flex-grow"
      >
        <span id="top" />
        {/* =========================================================
            HERO
            ========================================================= */}
        <section className="relative max-w-7xl mx-auto px-6 md:px-6 pt-20 md:pt-32 pb-20 md:pb-28">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-5 mb-8">
              <Pill>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                Open source · Building from India
              </Pill>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.03em] leading-[0.88] text-slate-900"
            >
              Zenith
              <span className="block text-slate-400/80 mt-1 font-black">
                Open Source.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 md:mt-10 text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto"
            >
              A collective of premium, transparent open source projects —
              Telegram bots, civic-tech, Linux audio, OS utilities, and AI
              tooling — engineered to give back to developers, students, and
              the nation.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 md:mt-10 flex flex-wrap justify-center gap-3"
            >
              <a
                href="#featured"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all duration-200 shadow-[0_4px_12px_-4px_rgba(15,23,42,0.3)] focus-visible:outline-2 focus-visible:outline-orange-400 focus-visible:outline-offset-2"
            >
              <Sparkles size={16} /> Featured Project
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </a>
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/90 border border-slate-200/60 text-slate-700 font-bold text-sm hover:bg-white hover:border-slate-300/60 transition-all duration-200 shadow-[0_2px_8px_-4px_rgba(15,23,42,0.08)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2"
            >
              <FolderGit2 size={16} /> Explore Projects
            </a>
            <a
              href="https://github.com/roshhellwett?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/90 border border-slate-200/60 text-slate-700 font-bold text-sm hover:bg-white hover:border-slate-300/60 transition-all duration-200 shadow-[0_2px_8px_-4px_rgba(15,23,42,0.08)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2"
              >
                <Github size={16} /> GitHub
                <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </motion.div>

          {/* STATS STRIP */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          >
            {ORG_STATS.map((s, i) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                transition={{ ...spring, delay: i * 0.05 }}
                className="grain relative rounded-2xl bg-white/60 backdrop-blur-xl backdrop-saturate-150 border border-white/70 ring-1 ring-slate-200/40 p-5 md:p-6 overflow-hidden shadow-[0_4px_16px_-8px_rgba(15,23,42,0.1)]"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 to-transparent" />
                <div className="relative flex items-center gap-2 text-slate-400 text-[10px] font-bold tracking-[0.15em] uppercase">
                  {s.icon} {s.label}
                </div>
                <div className="relative mt-2.5 text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                  {s.value}
                  {typeof s.value === "number" && (
                    <span className="text-slate-400 text-xl ml-0.5">+</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <Divider />

        {/* =========================================================
            MISSION
            ========================================================= */}
        <section
          id="mission"
          className="max-w-7xl mx-auto px-6 md:px-6 py-20 md:py-28"
        >
          <SectionHeading
            eyebrow="Our Mission"
            title="Open source, by India — for the world."
            subtitle="Every project under Zenith is built with one rule: be useful, be transparent, be free. We focus on civic-tech, automation, and developer tooling that compounds in value the longer it stays open."
            icon={<Globe size={14} />}
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center"
          >
            {/* LEFT: Lifecycle Loop diagram */}
            <motion.div
              variants={fadeUp}
              className="grain relative rounded-3xl border border-white/70 ring-1 ring-slate-200/40 bg-white/60 backdrop-blur-xl backdrop-saturate-150 p-6 md:p-10 overflow-hidden shadow-[0_8px_30px_-16px_rgba(15,23,42,0.12)]"
            >
              <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-100/30 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-emerald-100/30 blur-[80px]" />
              <div className="relative flex items-center gap-2 mb-4">
                <span className="p-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-slate-500 shadow-[0_1px_3px_-2px_rgba(15,23,42,0.06)]">
                  <Workflow size={14} />
                </span>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400">
                  How we operate
                </span>
              </div>
              <LifecycleLoop />
              <p className="relative mt-4 text-center text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
                Build · Ship · Open · Iterate — forever
              </p>
            </motion.div>

            {/* RIGHT: Tenet cards */}
            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: <Eye size={18} />,
                  title: "Transparent by default",
                  desc: "MIT licensed, public history, public issues. No black boxes.",
                  accent: "emerald"
                },
                {
                  icon: <Rocket size={18} />,
                  title: "Built for scale",
                  desc: "From single-file scripts to multi-tenant SaaS — production-minded.",
                  accent: "amber"
                },
                {
                  icon: <Heart size={18} />,
                  title: "Civic-first",
                  desc: "Projects that lift students, voters, listeners, and developers.",
                  accent: "rose"
                },
                {
                  icon: <Zap size={18} />,
                  title: "Continuously shipped",
                  desc: "Weekly commits, live demos, and real users — not vanity repos.",
                  accent: "sky"
                }
              ].map((c) => (
                <div
                  key={c.title}
                  className="grain relative rounded-2xl border border-white/70 ring-1 ring-slate-200/40 bg-white/60 backdrop-blur-xl backdrop-saturate-150 p-5 overflow-hidden group hover:bg-white/80 transition-all duration-200 shadow-[0_4px_12px_-8px_rgba(15,23,42,0.1)] hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.15)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 to-transparent" />
                  <div
                    className={`relative inline-flex p-2 rounded-xl bg-${c.accent}-50/80 text-${c.accent}-500 border border-${c.accent}-200/60 mb-4 transition-transform duration-200 group-hover:scale-105`}
                  >
                    {c.icon}
                  </div>
                  <h4 className="relative text-base font-bold text-slate-900 tracking-tight">
                    {c.title}
                  </h4>
                  <p className="relative mt-1.5 text-sm text-slate-500 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <Divider />

        {/* =========================================================
            FEATURED
            ========================================================= */}
        <section
          id="featured"
          className="max-w-7xl mx-auto px-6 md:px-6 py-20 md:py-28"
        >
          <SectionHeading
            eyebrow="Featured Initiative"
            title="Project Sentinel — AI-powered Indian newsroom."
            subtitle="Our latest flagship. A fully automated, source-verified news aggregator built for the Indian information ecosystem."
            icon={<Sparkles size={14} />}
          />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <FeaturedProject repo={featured} />
          </motion.div>
        </section>

        <Divider />

        {/* =========================================================
            PROJECTS GRID
            ========================================================= */}
        <section
          id="projects"
          className="max-w-7xl mx-auto px-6 md:px-6 py-20 md:py-28"
        >
          <SectionHeading
            eyebrow="The Archive"
            title="All Projects"
            subtitle="A living, animated map of every open source project under Zenith — categorized by purpose, filtered on demand."
            icon={<Terminal size={14} />}
          />

          {/* Ecosystem Diagram */}
          <EcosystemDiagram
            active={activeCategory}
            onSelect={setActiveCategory}
            countsByCategory={countsByCategory}
          />

          {/* Filter pills */}
          <div className="mt-10 mb-8 flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => {
              const isActive = activeCategory === c.id;
              const count =
                c.id === "all"
                  ? repos.length
                  : countsByCategory[c.id] || 0;
              if (c.id !== "all" && count === 0) return null;
              return (
                <motion.button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCategory(c.id)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-bold tracking-wide border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2 ${
                    isActive
                      ? `bg-slate-900 border-slate-900 text-white shadow-[0_2px_8px_-4px_rgba(15,23,42,0.3)]`
                      : "bg-white/80 border-slate-200/60 text-slate-500 hover:bg-slate-50/80"
                  }`}
                >
                  <span className={isActive ? "text-white" : `text-${c.accent}-500`}>
                    {c.icon}
                  </span>
                  <span>{c.label}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-slate-100/80 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Animated filtered grid */}
          <LayoutGroup>
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredRepos.map((r, i) => (
                  <motion.div
                    key={r.name}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ ...spring, delay: i * 0.04 }}
                  >
                    <RepoCard repo={r} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {/* Empty state */}
          {filteredRepos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 px-6 rounded-3xl border border-dashed border-slate-300/40 bg-white/60 backdrop-blur-sm"
            >
              <Boxes
                size={26}
                className="mx-auto text-slate-400 mb-3"
                strokeWidth={1.5}
              />
              <p className="text-sm font-bold text-slate-500">
                No projects in this category yet.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                More are shipping soon — switch back to{" "}
                <button
                  className="font-bold text-slate-900 underline underline-offset-4 transition-colors duration-200 hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2 rounded"
                  onClick={() => setActiveCategory("all")}
                >
                  All projects
                </button>
                .
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            <a
              href="https://github.com/roshhellwett?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all duration-200 shadow-[0_4px_12px_-4px_rgba(15,23,42,0.3)] focus-visible:outline-2 focus-visible:outline-orange-400 focus-visible:outline-offset-2"
            >
              <Github size={16} /> View all on GitHub
              <ArrowUpRight
                size={14}
                className="group-hover:rotate-45 transition-transform duration-200"
              />
            </a>
            <a
              href="https://roshhellwett.github.io/zenithpages/"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/90 border border-slate-200/60 text-slate-700 font-bold text-sm hover:bg-white hover:border-slate-300/60 transition-all duration-200 shadow-[0_2px_8px_-4px_rgba(15,23,42,0.08)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2"
            >
              <Layers size={16} /> Zenith Tools Registry
              <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </section>

        <Divider />

        {/* =========================================================
            STACK
            ========================================================= */}
        <section
          id="stack"
          className="max-w-7xl mx-auto px-6 md:px-6 py-20 md:py-28"
        >
          <SectionHeading
            eyebrow="Capability"
            title="Technology Spectrum"
            subtitle="What we build with, and how we think about it conceptually — not a buzzword cloud."
            icon={<Code2 size={14} />}
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid lg:grid-cols-3 gap-5"
          >
            {STACK.map((g, i) => (
              <motion.div
                key={g.category}
                variants={fadeUp}
                transition={{ ...spring, delay: i * 0.05 }}
                className="grain relative rounded-3xl border border-white/70 ring-1 ring-slate-200/40 bg-white/60 backdrop-blur-xl backdrop-saturate-150 p-6 md:p-7 overflow-hidden shadow-[0_4px_16px_-10px_rgba(15,23,42,0.1)]"
              >
                <div
                  className={`pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[60px] bg-${g.accent}-200/50`}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 to-transparent" />
                <div className="relative">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-${g.accent}-50/80 border border-${g.accent}-200/60 text-${g.accent}-600`}
                  >
                    {g.icon}
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase">
                      {g.category}
                    </span>
                  </div>
                  <p className="mt-5 text-sm text-slate-500 leading-relaxed">
                    {g.concept}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {g.items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-lg bg-slate-50/70 border border-slate-200/50 text-[10px] font-bold text-slate-500"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <Divider />

        {/* =========================================================
            FOUNDER (personal details — at the very end as requested)
            ========================================================= */}
        <section
          id="founder"
          className="max-w-7xl mx-auto px-6 md:px-6 py-20 md:py-28"
        >
          <SectionHeading
            eyebrow="Behind Zenith"
            title="The Founder"
            subtitle="Zenith is independently maintained. Here's the human behind the commits."
            icon={<Heart size={14} />}
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className=""
          >
            {/* Profile card — horizontal layout */}
            <motion.div variants={fadeUp}>
              <Panel className="p-6 md:p-10">
                {/* Commit cadence heatmap — full width, top */}
                <CommitHeatmap />

                <div className="mt-10 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-start">
                  {/* LEFT: Identity + bio + quote */}
                  <div className="flex flex-col">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                      Roshan Kr Singh
                    </h3>
                    <div className="mt-1 text-sm font-bold tracking-[0.2em] uppercase text-slate-500">
                      @roshhellwett · Founder
                    </div>

                    <p className="mt-6 text-sm md:text-base text-slate-500 leading-relaxed">
                      Independent developer, Google Dev member, and open source
                      maintainer based in India. I build systems I wish existed —
                      for students, for democracy, for the open web. Zenith is my
                      promise to keep them free.
                    </p>

                    <blockquote className="mt-6 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-slate-500 text-sm italic leading-relaxed">
                      &ldquo;Open Source is the first step of development.&rdquo;
                    </blockquote>
                  </div>

                  {/* RIGHT: Memberships + Vertices */}
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href="https://g.dev/roshhellwett"
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-3 p-3 rounded-2xl bg-white/80 border border-slate-200/60 hover:bg-slate-50/80 hover:border-slate-300/60 transition-all duration-200 shadow-[0_1px_4px_-2px_rgba(15,23,42,0.06)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2"
                      >
                        <span className="p-2 rounded-lg bg-blue-50/80 text-blue-500 border border-blue-200/60">
                          <Globe size={14} />
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                          Google Dev
                        </span>
                        <ArrowUpRight
                          size={14}
                          className="ml-auto text-slate-400 group-hover:text-slate-700 transition-colors duration-200"
                        />
                      </a>
                      <a
                        href="https://github.com/roshhellwett"
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-3 p-3 rounded-2xl bg-white/80 border border-slate-200/60 hover:bg-slate-50/80 hover:border-slate-300/60 transition-all duration-200 shadow-[0_1px_4px_-2px_rgba(15,23,42,0.06)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2"
                      >
                        <span className="p-2 rounded-lg bg-slate-900 text-white border border-slate-900">
                          <Github size={14} />
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                          GitHub
                        </span>
                        <ArrowUpRight
                          size={14}
                          className="ml-auto text-slate-400 group-hover:text-slate-700"
                        />
                      </a>
                    </div>

                    <div className="pt-6 border-t border-slate-200/40">
                      <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-4">
                        Vertices
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {SOCIALS.map((s) => (
                          <a
                            key={s.label}
                            href={s.link}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={s.label}
                            className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-slate-200/60 hover:bg-slate-50/80 hover:border-slate-300/60 transition-all duration-200 shadow-[0_1px_3px_-2px_rgba(15,23,42,0.04)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2"
                          >
                            <span className={`text-${s.accent}-500 group-hover:scale-110 transition-transform duration-200`}>{s.icon}</span>
                            <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 truncate transition-colors duration-200">
                              {s.label}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            </motion.div>
          </motion.div>
        </section>

        <Divider />

        {/* =========================================================
            NATION BAND — closing call (final section before footer)
            ========================================================= */}
        <section className="max-w-7xl mx-auto px-6 md:px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={spring}
            className="grain relative overflow-hidden rounded-[2rem] border border-white/70 ring-1 ring-slate-200/40 bg-gradient-to-br from-orange-50/80 via-white/60 to-emerald-50/80 backdrop-blur-xl backdrop-saturate-150 p-8 md:p-14 text-center shadow-[0_12px_40px_-24px_rgba(15,23,42,0.12)]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-orange-400/80 via-slate-300/60 to-emerald-500/80" />
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-amber-100/40 blur-[120px]" />

            {/* Animated tricolor wave + code particles */}
            <BharatWave />

            <div className="relative flex justify-center">
              <Pill>
                <Flag size={11} /> Bharat First
              </Pill>
            </div>
            <div className="relative flex items-center justify-center gap-3 mt-6 mb-4">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-slate-300/50" />
              <div className="w-1 h-1 rounded-full bg-slate-300/50" />
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-slate-300/50" />
            </div>
            <h3
              className="relative font-black tracking-tight text-slate-900 mx-auto leading-tight whitespace-nowrap"
              style={{ fontSize: "clamp(1rem, 4.2vw, 3rem)" }}
            >
              Code as contribution. Code as{" "}
              <span className="bg-gradient-to-r from-orange-500 via-slate-700 to-emerald-600 bg-clip-text text-transparent">
                citizenship.
              </span>
            </h3>
            <p className="relative mt-5 text-sm md:text-base text-slate-500/90 max-w-xl mx-auto leading-relaxed">
              Every commit pushed under Zenith is a small contribution toward a
              more transparent, self-reliant digital India — open standards,
              open code, open opportunity.
            </p>
          </motion.div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-200/40 mt-8 bg-white/50 backdrop-blur-xl backdrop-saturate-150">
        <div className="max-w-7xl mx-auto px-6 md:px-6 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <BrandMark size={34} rounded="rounded-xl" />
              <div>
                <div className="text-sm font-black tracking-tight text-slate-900">
                  Zenith Open Source Projects
                </div>
                <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-slate-400">
                  © {new Date().getFullYear()} · Roshan Kr Singh · MIT
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {SOCIALS.slice(0, 6).map((s) => (
                <a
                  key={s.label}
                  href={s.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className={`p-2 rounded-lg bg-white/80 border border-slate-200/50 hover:bg-slate-50/80 text-${s.accent}-500 transition-all duration-200 shadow-[0_1px_3px_-2px_rgba(15,23,42,0.06)] hover:shadow-[0_4px_8px_-4px_rgba(15,23,42,0.1)] hover:scale-110 focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-slate-400">
              Built with{" "}
              <span className="text-slate-500">Claude</span>{" "}
              <span className="text-slate-300">&amp;</span>{" "}
              <span className="text-slate-500">Gemini</span>
            </p>
            <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-slate-400">
              Design by{" "}
              <a
                href="https://github.com/roshhellwett"
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 hover:text-slate-900 transition-colors duration-200 underline decoration-slate-300/50 underline-offset-4 focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2 rounded"
              >
                Roshhellwett
              </a>
            </p>
            <p className="text-[9px] font-medium text-slate-400">
              Next.js · Tailwind · Framer Motion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
