"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, ExternalLink, Play, Activity, Code2, GitBranch, Sparkles, Star, Copy, Check, ShieldCheck, Lock, CheckCircle2, Heart, Coffee } from "lucide-react";
import { FEATURED_FALLBACK, FALLBACK_REPOS } from "@/data/repos";
import { STACK } from "@/data/stack";
import { SOCIALS } from "@/data/socials";
import { useMouseSpotlight } from "@/lib/useMouseSpotlight";
import { STORE_URL } from "@/lib/site";
import { ZenithLogo } from "@/components/ZenithLogo";
import type { Repo } from "@/types";
import { playRetroSound } from "@/lib/audio";
import { unlockBodyScroll } from "@/lib/scroll-lock";
import Link from "next/link";
import FounderAvatar from "@/components/FounderAvatar";

const ALL_REPOS = [FEATURED_FALLBACK, ...FALLBACK_REPOS];

const FEATURE_TABS = [
  {
    id: "explore",
    label: "Civic Intelligence",
    color: "teal",
    borderColor: "border-tab-teal",
    title: "Discover civic-tech & open source tools",
    desc: "Browse through a curated registry of projects built for public good — from AI-powered news aggregation to transparent voting blueprints.",
    subDesc: "Every project is open source, auditable, and built by Roshan Kr Singh in India.",
    categories: [
      {
        name: "AI & Intelligence",
        items: [
          { label: "Project Sentinel", icon: "📰", link: "https://github.com/roshhellwett/projectsentinel" },
          { label: "News Classification", icon: "🤖" },
        ],
      },
      {
        name: "Civic Technology",
        items: [
          { label: "Project ZeroGapVote", icon: "🗳️", link: "https://github.com/roshhellwett/projectzerogapvote" },
          { label: "Voting Blueprint", icon: "🔐" },
        ],
      },
      {
        name: "Developer Tools",
        items: [
          { label: "README Generator", icon: "📄", link: "https://github.com/roshhellwett/projectreadmegen" },
          { label: "Project Monolith", icon: "🤖", link: "https://github.com/roshhellwett/projectmonolith" },
        ],
      },
    ],
  },
  {
    id: "data",
    label: "Systems & Engines",
    color: "orange",
    borderColor: "border-tab-orange",
    title: "All projects, one unified dashboard",
    desc: "Zenith is a unified registry for all open source projects — from Telegram bots to Linux audio presets, Windows utilities, and C++ engines.",
    subDesc: "Track project status, languages, categories, and live deployment links all in one place.",
    categories: [
      {
        name: "Systems & C/C++",
        items: [
          { label: "Project PayNix", icon: "💰", link: "https://github.com/roshhellwett/projectpaynix" },
          { label: "Project LogicHands", icon: "🎮", link: "https://github.com/roshhellwett/projectlogichands" },
        ],
      },
      {
        name: "Linux & Audio",
        items: [
          { label: "Project PulseWire", icon: "🎧", link: "https://github.com/roshhellwett/projectpulsewire" },
          { label: "Project GRUB", icon: "🖥️", link: "https://github.com/roshhellwett/projectgrub" },
        ],
      },
      {
        name: "Automation",
        items: [
          { label: "Project WinActivation", icon: "🪟", link: "https://github.com/roshhellwett/projectwinactivation" },
        ],
      },
    ],
  },
  {
    id: "debug",
    label: "Cryptographic Audit",
    color: "salmon",
    borderColor: "border-tab-salmon",
    title: "Transparent, auditable code & ZKP",
    desc: "Every project features MIT licensing, clean documentation, deterministic execution, and full source code transparency.",
    subDesc: "No hidden dependencies. No black boxes. Audit everything from Zero-Knowledge proofs to low-level pipelines.",
    categories: [
      {
        name: "Audit tools",
        items: [
          { label: "MIT Licensed", icon: "📜" },
          { label: "Full Source Code", icon: "💻" },
        ],
      },
      {
        name: "Documentation",
        items: [
          { label: "README files", icon: "📄" },
          { label: "Inline Comments", icon: "💬" },
        ],
      },
      {
        name: "Verification",
        items: [
          { label: "Reproducible Builds", icon: "⚙️" },
          { label: "Clean Git History", icon: "📊" },
        ],
      },
    ],
  },
  {
    id: "ship",
    label: "Ecosystem & Devs",
    color: "purple",
    borderColor: "border-tab-purple",
    title: "Ship features safely & get feedback",
    desc: "All projects welcome contributions. Fork, test locally, and submit pull requests. Each repo includes setup instructions and contribution guidelines.",
    subDesc: "Built with modern tooling: TypeScript, React 19, Next.js 16, Python, and C++ across the stack.",
    categories: [
      {
        name: "Getting started",
        items: [
          { label: "Fork on GitHub", icon: "🍴", link: "https://github.com/roshhellwett" },
          { label: "Read the Docs", icon: "📖" },
        ],
      },
      {
        name: "Tech Stack",
        items: [
          { label: "TypeScript/React", icon: "⚛️" },
          { label: "Python/C++", icon: "🐍" },
        ],
      },
      {
        name: "Community",
        items: [
          { label: "Issues & PRs", icon: "🔀" },
          { label: "Discussions", icon: "💭" },
        ],
      },
    ],
  },
];

function ScrollReveal({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
  const [revealed, setRevealed] = React.useState(true);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.02, rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} className={`${revealed ? 'animate-reveal' : ''} ${className || ''}`}>
      {children}
    </section>
  );
}

interface WebsiteModeProps {
  onSwitchToDesktop: () => void;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  Python: "#3572A5",
  "C++": "#f34b7d",
  Shell: "#89e051",
  Rust: "#dea584",
  JavaScript: "#f7df1e",
};

// Sub-component for project cards using the useMouseSpotlight hook
const ProjectCard = React.memo(function ProjectCard({
  repo,
  index,
  onCopyClone,
  isCopied,
}: {
  repo: Repo;
  index: number;
  onCopyClone: (link: string, name: string) => void;
  isCopied: boolean;
}) {
  const { ref, x, y, bind } = useMouseSpotlight<HTMLDivElement>();
  const langColor = LANG_COLORS[repo.lang] || "#8a8c80";

  return (
    <div
      ref={ref}
      {...bind}
      className="project-card holo-card group relative bg-dark-surface/90 border border-dark-border/80 rounded-xl p-4 sm:p-5 transition-all overflow-hidden flex flex-col justify-between hover:bg-dark-elevated shadow-sm"
    >
      {/* Spotlight overlay tracking the cursor */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: `radial-gradient(350px circle at ${x}px ${y}px, rgba(241, 168, 44, 0.08), transparent 75%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] font-bold text-dark-text-faint tracking-widest">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-1.5">
            {repo.stars !== undefined && (
              <span className="text-[10px] font-mono text-amber-button bg-amber-button/10 px-1.5 py-0.5 rounded font-bold border border-amber-button/20 flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-button text-amber-button" /> {repo.stars}
              </span>
            )}
            <span className="text-[11px] font-mono font-bold bg-dark-elevated px-2 py-0.5 rounded text-dark-text-muted border border-dark-border-subtle flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor }} />
              {repo.lang}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          <a
            href={repo.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playRetroSound("click")}
            className="font-extrabold text-base text-dark-text group-hover:text-amber-button transition-colors flex items-center gap-1"
          >
            <span>{repo.displayName}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-dark-text-muted group-hover:text-amber-button transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          {repo.homepage && (
            <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-accent-teal bg-accent-teal/10 px-1.5 py-0.5 rounded border border-accent-teal/20">
              <Activity className="w-2.5 h-2.5" /> live
            </span>
          )}
        </div>

        <p className="text-xs text-dark-text-muted leading-relaxed line-clamp-2">
          {repo.desc}
        </p>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between border-t border-dark-border-subtle/80 pt-3">
        <span className="text-[10px] uppercase tracking-wider text-dark-text-faint font-mono font-bold">
          {repo.category}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onCopyClone(repo.link, repo.name);
            }}
            className="text-[10px] font-mono font-bold text-dark-text-muted hover:text-amber-button flex items-center gap-1 px-2 py-1 rounded bg-dark-bg/60 hover:bg-dark-bg border border-dark-border-subtle transition-colors cursor-pointer"
            title="Copy git clone command"
          >
            {isCopied ? (
              <span className="text-accent-teal flex items-center gap-0.5 font-bold">
                <Check className="w-3 h-3" /> Copied
              </span>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Clone
              </>
            )}
          </button>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playRetroSound("click")}
              className="flex items-center gap-1 text-accent-teal text-xs font-bold hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

export default function WebsiteMode({ onSwitchToDesktop }: WebsiteModeProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [projectFilter, setProjectFilter] = useState<"all" | Repo["category"]>("all");
  const [copiedRepo, setCopiedRepo] = useState<string | null>(null);

  // Interactive Playground states for feature tabs
  const [selectedHeadline, setSelectedHeadline] = useState(0);
  const [zkpBallotChoice, setZkpBallotChoice] = useState("Candidate A - Transparent Civic Blueprint");
  const [zkpProofHash, setZkpProofHash] = useState("0x9c3f82a1...7e4b9d02");
  const [zkpVerified, setZkpVerified] = useState(true);
  const [coffeeGiven, setCoffeeGiven] = useState(false);

  // Ensure any scroll locks from previous mode or modals are cleared
  useEffect(() => {
    unlockBodyScroll(true);
    document.body.style.overflow = "";
    document.body.classList.remove("scroll-locked");
  }, []);

  // Keyboard shortcut Alt+O to switch to OS mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        onSwitchToDesktop();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSwitchToDesktop]);

  // Handle scroll events (back to top)
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Section Observer for scroll spy dots
  useEffect(() => {
    const sections = ["hero", "tabs", "projects", "stack", "founder"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  // Cookie/Privacy Consent Banner
  useEffect(() => {
    let hasConsent = false;
    try { hasConsent = !!localStorage.getItem("zenith_cookie_consent"); } catch {}
    if (!hasConsent) {
      const timer = setTimeout(() => setShowConsent(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Subtle hero card parallax
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePos({
          x: (e.clientX - window.innerWidth / 2) * 0.008,
          y: (e.clientY - window.innerHeight / 2) * 0.008,
        });
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const currentTab = FEATURE_TABS[activeTab];
  const categories = ["all", ...Array.from(new Set(ALL_REPOS.map((repo) => repo.category)))] as Array<"all" | Repo["category"]>;
  const visibleRepos = projectFilter === "all" ? ALL_REPOS.slice(0, 8) : ALL_REPOS.filter((repo) => repo.category === projectFilter);

  const handleScrollToTop = () => {
    playRetroSound("minimize");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAcceptConsent = () => {
    playRetroSound("success");
    try { localStorage.setItem("zenith_cookie_consent", "true"); } catch {}
    setShowConsent(false);
  };

  const handleCopyClone = (link: string, name: string) => {
    playRetroSound("success");
    navigator.clipboard?.writeText(`git clone ${link}.git`);
    setCopiedRepo(name);
    setTimeout(() => setCopiedRepo(null), 2500);
  };

  const handleGenerateZkp = () => {
    playRetroSound("chime");
    const sampleHashes = [
      "0x8e1a7b42d...45f9a0c1",
      "0x3f90b1c78...12e84d79",
      "0xa5c20e98f...77d13b64",
    ];
    setZkpProofHash(sampleHashes[Math.floor(Math.random() * sampleHashes.length)]);
    setZkpVerified(true);
  };

  const sampleHeadlines = [
    { title: "National Open Digital Public Infrastructure Blueprint Published", bias: "1.2%", score: 98, tag: "CIVIC_TECH_GOVERNANCE" },
    { title: "You Won't Believe What Tech Executives Secretly Do Every Night!", bias: "98.7%", score: 2, tag: "CLICKBAIT_REJECTED" },
    { title: "Zero Knowledge Proof Ballots Audited with Zero Data Leaks", bias: "0.8%", score: 99, tag: "VERIFIED_INFRASTRUCTURE" },
  ];

  return (
    <div className="min-h-screen text-dark-text relative z-10 selection:bg-amber-button/30">
      
      {/* ── SIDE DOTS NAVIGATION ── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3 z-50 select-none">
        {[
          { id: "hero", label: "Home" },
          { id: "tabs", label: "Features" },
          { id: "projects", label: "Projects" },
          { id: "stack", label: "Stack" },
          { id: "founder", label: "Founder" },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => {
              playRetroSound("click");
              document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeSection === sec.id
                ? "bg-amber-button scale-125 ring-2 ring-amber-button/30 ring-offset-2"
                : "bg-dark-text-faint/30 hover:bg-dark-text-muted"
            }`}
            title={sec.label}
            aria-label={`Scroll to ${sec.label}`}
          />
        ))}
      </div>

      {/* ── HERO SECTION ── */}
      <section
        id="hero"
        className="animate-reveal max-w-[940px] mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10 md:py-16"
      >
        <div
          className="hero-editorial relative bg-dark-surface/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-dark-border/60 shadow-2xl overflow-hidden backdrop-blur-xl"
          aria-labelledby="hero-heading"
        >
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />

          <div
            style={{
              transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
              transition: "transform 0.1s ease-out",
            }}
            className="relative z-10"
          >
            {/* Top Badge Bar */}
            <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 select-none">
              <div className="flex items-center gap-2 sm:gap-3">
                <ZenithLogo className="w-8 h-8 sm:w-10 sm:h-10" />
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-dark-text">Zenith</span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-accent-teal bg-accent-teal/10 px-3 py-1 rounded-full border border-accent-teal/25">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED BHARAT TECH
              </span>
            </div>

            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-elevated border border-dark-border-subtle text-[11px] font-mono font-bold text-dark-text-muted mb-4 sm:mb-5">
              <span className="w-2 h-2 rounded-full bg-amber-button animate-pulse" />
              <span>A living registry for public-interest software</span>
            </div>

            {/* Shimmering Headline */}
            <h1
              id="hero-heading"
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-4 sm:mb-6 max-w-[760px]"
            >
              The open source way to <br className="hidden sm:block" />
              <span className="shimmer-text">build civic tech</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-dark-text-muted leading-relaxed max-w-[680px] mb-3">
              Building software used to mean relying on proprietary tools, closed-source dependencies, and opaque architectures.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-dark-text-muted leading-relaxed max-w-[680px] mb-6 sm:mb-8">
              <strong className="text-dark-text">Zenith Open Source Projects</strong> by Roshan Kr Singh is an independent software collective and open-source registry acting as a blueprint for you to build civic-tech, systems utilities, and dev tools — <em className="text-dark-text font-bold">transparently.</em>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 mb-5 sm:mb-7 select-none">
              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playRetroSound("click")}
                className="bg-amber-button hover:bg-saffron-deep text-black px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 border border-amber-shadow text-center shadow-md flex items-center justify-center gap-2"
              >
                <span>Get started - free</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              {/* Prominent Mode Switcher Button */}
              <button
                type="button"
                onClick={() => {
                  playRetroSound("toggle");
                  onSwitchToDesktop();
                }}
                className="group flex items-center justify-center gap-2 bg-dark-elevated hover:bg-dark-surface border border-dark-border hover:border-accent-teal/50 text-dark-text px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
                title="Launch Retro Desktop OS Mode (Alt+O)"
              >
                <Play className="w-3.5 h-3.5 text-accent-teal group-hover:scale-110 transition-transform" />
                <span>Launch Desktop OS</span>
                <kbd className="hidden md:inline-block text-[9px] font-mono text-dark-text-faint bg-dark-bg px-1.5 py-0.5 rounded border border-dark-border-subtle">
                  Alt+O
                </kbd>
              </button>

              <a
                href="https://github.com/roshhellwett"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playRetroSound("click")}
                className="border border-dark-border hover:border-dark-text-muted text-dark-text px-5 py-3 rounded-xl text-sm font-bold transition-all hover:bg-dark-surface text-center flex items-center justify-center"
              >
                View Source
              </a>
            </div>

            {/* Sub-links */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm text-dark-text-muted select-none">
              <a href="https://github.com/roshhellwett" target="_blank" rel="noopener noreferrer" className="posthog-link flex items-center gap-1 hover:text-amber-button font-bold">
                <span className="text-accent-teal">◆</span> GitHub
              </a>
              <span className="text-dark-border hidden sm:inline">•</span>
              <a href="https://www.linkedin.com/in/roshhellwett" target="_blank" rel="noopener noreferrer" className="posthog-link flex items-center gap-1 hover:text-amber-button font-bold">
                💬 Talk to founder
              </a>
              <span className="text-dark-border hidden sm:inline">•</span>
              <span className="text-dark-text-faint text-xs">Based in India · Open to World</span>
            </div>

            {/* Metrics Ribbon */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-dark-border-subtle pt-5">
              <div className="bg-dark-elevated/60 p-3 rounded-xl border border-dark-border/40">
                <div className="text-xl sm:text-2xl font-black text-dark-text">{ALL_REPOS.length}+</div>
                <div className="text-[9px] uppercase tracking-wider text-dark-text-faint font-bold mt-0.5">Projects Indexed</div>
              </div>
              <div className="bg-dark-elevated/60 p-3 rounded-xl border border-dark-border/40">
                <div className="text-xl sm:text-2xl font-black text-accent-teal">100%</div>
                <div className="text-[9px] uppercase tracking-wider text-dark-text-faint font-bold mt-0.5">Open Source</div>
              </div>
              <div className="bg-dark-elevated/60 p-3 rounded-xl border border-dark-border/40">
                <div className="text-xl sm:text-2xl font-black text-amber-button">0</div>
                <div className="text-[9px] uppercase tracking-wider text-dark-text-faint font-bold mt-0.5">Telemetry Trackers</div>
              </div>
              <div className="bg-dark-elevated/60 p-3 rounded-xl border border-dark-border/40">
                <div className="text-xl sm:text-2xl font-black text-dark-text">MIT</div>
                <div className="text-[9px] uppercase tracking-wider text-dark-text-faint font-bold mt-0.5">Licensed Always</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE TABS WITH INTERACTIVE PLAYGROUND ── */}
      <ScrollReveal
        id="tabs"
        className="max-w-[940px] mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10 md:py-12"
      >
        <div className="bg-dark-surface/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-dark-border/60 shadow-2xl overflow-hidden backdrop-blur-xl">
          
          {/* Scrollable Tabs Wrapper */}
          <div className="relative mb-2 select-none">
            <div className="flex overflow-x-auto gap-1 border-b border-dark-border-subtle scrollbar-none snap-x-mandatory -mx-1 px-1">
              {FEATURE_TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    playRetroSound("click");
                    setActiveTab(i);
                  }}
                  className={`relative px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer snap-start min-h-[44px] shrink-0 rounded-t-xl ${
                    i === activeTab
                      ? "text-dark-text font-black bg-dark-elevated/70 border-t border-x border-dark-border"
                      : "text-dark-text-muted hover:text-dark-text hover:bg-dark-surface/40"
                  }`}
                >
                  {tab.label}
                  {i === activeTab && (
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        tab.color === "teal"
                          ? "bg-accent-teal"
                          : tab.color === "orange"
                          ? "bg-amber-button"
                          : tab.color === "salmon"
                          ? "bg-accent-salmon"
                          : "bg-accent-purple"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Animate tab content change with crossfade */}
          <div
            key={activeTab}
            className={`animate-tab-enter border rounded-2xl p-4 sm:p-7 md:p-8 mt-4 ${
              currentTab.color === "teal"
                ? "border-accent-teal/40 bg-accent-teal/5"
                : currentTab.color === "orange"
                ? "border-amber-button/40 bg-amber-button/5"
                : currentTab.color === "salmon"
                ? "border-accent-salmon/40 bg-accent-salmon/5"
                : "border-accent-purple/40 bg-accent-purple/5"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight leading-tight">{currentTab.title}</h2>
              <span className="text-[10px] font-mono text-dark-text-faint uppercase bg-dark-surface px-2 py-1 rounded border border-dark-border-subtle shrink-0">
                MODULE 0{activeTab + 1}
              </span>
            </div>

            <p className="text-sm sm:text-base text-dark-text-muted leading-relaxed mb-2 max-w-[660px]">
              {currentTab.desc}
            </p>
            <p className="text-xs sm:text-sm text-dark-text-muted leading-relaxed mb-5 max-w-[660px]">
              {currentTab.subDesc}
            </p>

            {/* TAB SPECIFIC INTERACTIVE PLAYGROUNDS */}
            {activeTab === 0 && (
              <div className="mb-6 bg-dark-surface/90 border border-dark-border rounded-xl p-3.5 sm:p-4 space-y-3 font-mono text-xs shadow-sm">
                <div className="flex items-center justify-between text-[11px] text-dark-text-faint border-b pb-2 border-dark-border-subtle">
                  <span className="text-accent-teal font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Project Sentinel: Live NLP Headline Classifier
                  </span>
                  <span>Click sample to analyze</span>
                </div>
                <div className="space-y-2">
                  {sampleHeadlines.map((h, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        playRetroSound("pop");
                        setSelectedHeadline(idx);
                      }}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                        selectedHeadline === idx
                          ? "bg-dark-elevated border-accent-teal shadow-sm"
                          : "bg-dark-bg/60 border-dark-border-subtle hover:bg-dark-elevated/50"
                      }`}
                    >
                      <span className="font-sans text-xs text-dark-text font-semibold">{h.title}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          h.score > 80 ? "bg-accent-teal/15 text-accent-teal border border-accent-teal/30" : "bg-accent-salmon/15 text-accent-salmon border border-accent-salmon/30"
                        }`}>
                          {h.tag}
                        </span>
                        <span className="text-[10px] text-dark-text-faint">{h.score}% Valid</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="mb-6 bg-dark-surface/90 border border-dark-border rounded-xl p-3.5 sm:p-4 space-y-3 font-mono text-xs shadow-sm">
                <div className="flex items-center justify-between text-[11px] text-dark-text-faint border-b pb-2 border-dark-border-subtle">
                  <span className="text-accent-salmon font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> ZeroGapVote: Cryptographic ZKP Verification Sandbox
                  </span>
                  <span className="text-accent-teal font-bold">100% Deterministic</span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    value={zkpBallotChoice}
                    onChange={(e) => setZkpBallotChoice(e.target.value)}
                    className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-xs font-sans text-dark-text focus:outline-none focus:border-accent-salmon"
                    placeholder="Candidate or ballot proposition..."
                  />
                  <button
                    onClick={handleGenerateZkp}
                    className="bg-accent-salmon hover:bg-[#e0452d] text-white px-4 py-2 rounded-lg font-bold text-xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    Generate ZKP Proof
                  </button>
                </div>
                <div className="bg-[#1c1d18] text-[#c9bfa8] p-3 rounded-lg border border-[#35372d] text-[11px] space-y-1">
                  <div>&gt; Nullifier Hash: <span className="text-amber-button font-bold">{zkpProofHash}</span></div>
                  <div>&gt; Proof Verification: <span className="text-accent-teal font-bold">{zkpVerified ? "zk-SNARK PROOF VALIDATED (Zero Data Leaked)" : "COMPUTING ZERO-KNOWLEDGE PROOF..."}</span></div>
                </div>
              </div>
            )}

            {/* Categories grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 pt-2">
              {currentTab.categories.map((cat) => (
                <div key={cat.name} className="bg-dark-surface/80 p-3 sm:p-4 rounded-xl border border-dark-border/60">
                  <div className="text-[10px] font-bold text-dark-text-muted uppercase tracking-widest mb-2 pb-1.5 border-b border-dark-border-subtle">
                    {cat.name}
                  </div>
                  <div className="space-y-2">
                    {cat.items.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span className="text-sm select-none shrink-0">{item.icon}</span>
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playRetroSound("click")}
                            className="text-xs sm:text-sm font-bold text-dark-text hover:text-amber-button posthog-link transition-colors truncate"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <span className="text-xs sm:text-sm text-dark-text-muted truncate">{item.label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ── PROJECTS GALLERY WITH HOLOGRAPHIC CARDS ── */}
      <ScrollReveal
        id="projects"
        className="max-w-[940px] mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10 md:py-12"
      >
        <div className="bg-dark-surface/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-dark-border/60 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3 sm:mb-4">
            <div>
              <div className="section-eyebrow flex items-center gap-1.5 text-xs font-mono font-bold text-amber-button">
                <Sparkles className="w-3.5 h-3.5" /> LATEST FROM THE REGISTRY
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-1 text-dark-text">
                Featured Projects
              </h2>
            </div>
            <span className="text-xs font-mono text-dark-text-faint">
              {visibleRepos.length} / {ALL_REPOS.length} active repositories
            </span>
          </div>

          <p className="text-sm sm:text-base text-dark-text-muted mb-6 sm:mb-8 max-w-[680px]">
            Here are the open source projects in the Zenith registry. Each one is built for real-world civic impact, fully auditable, and MIT-licensed.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter projects by category">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  playRetroSound("click");
                  setProjectFilter(category);
                }}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold capitalize transition-all cursor-pointer min-h-[34px] ${
                  projectFilter === category
                    ? "bg-dark-text text-dark-surface border-dark-text shadow-sm scale-105"
                    : "border-dark-border-subtle bg-dark-surface/80 text-dark-text-muted hover:border-amber-button hover:text-dark-text"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-8">
            {visibleRepos.map((repo, index) => (
              <ProjectCard
                key={repo.name}
                repo={repo}
                index={index}
                onCopyClone={handleCopyClone}
                isCopied={copiedRepo === repo.name}
              />
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <a
              href="https://github.com/roshhellwett?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playRetroSound("click")}
              className="inline-flex items-center gap-2 bg-amber-button hover:bg-saffron-deep text-black px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 border border-amber-shadow shadow-md"
            >
              <GitBranch className="w-4 h-4" />
              <span>Explore All Repositories on GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* ── TECH STACK & MACHINERY ── */}
      <ScrollReveal
        id="stack"
        className="max-w-[940px] mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10 md:py-12"
      >
        <div className="bg-dark-surface/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-dark-border/60 shadow-2xl backdrop-blur-xl">
          <div className="section-eyebrow mb-2 flex items-center gap-1.5 text-xs font-mono font-bold text-cobalt">
            <Code2 className="w-3.5 h-3.5" /> THE UNDERLYING MACHINERY
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-dark-text">
            Zenith tech stack, built for performance
          </h2>
          <p className="text-sm sm:text-base text-dark-text-muted mb-6 sm:mb-8 max-w-[680px]">
            When you&apos;re building civic open source tools, you should be working with deterministic, world-class technologies. Zenith projects span multiple languages and low-latency architectures.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_290px] gap-5 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              {STACK.map((group) => (
                <div key={group.category} className="bg-dark-surface/90 border border-dark-border/80 rounded-xl p-4 holo-card">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-sm text-dark-text">{group.category}</div>
                    <span className="text-[9px] font-mono text-accent-teal bg-accent-teal/10 px-1.5 py-0.5 rounded border border-accent-teal/20 font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <div className="text-xs text-dark-text-muted mb-2.5">{group.concept}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span key={item} className="text-[10px] bg-dark-elevated border border-dark-border-subtle rounded-lg px-2 py-0.5 text-dark-text font-mono font-semibold select-text">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-dark-surface/90 border border-dark-border/80 rounded-xl p-5 flex flex-col justify-between shadow-sm">
              <div>
                <div className="font-extrabold text-sm text-amber-button mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Zenith Architectural Guarantees:
                </div>
                <ul className="space-y-2.5 text-xs text-dark-text-muted">
                  <li className="flex items-center gap-2"><span className="text-accent-teal font-bold">✓</span> MIT License (always free forever)</li>
                  <li className="flex items-center gap-2"><span className="text-accent-teal font-bold">✓</span> 10+ public active repositories</li>
                  <li className="flex items-center gap-2"><span className="text-accent-teal font-bold">✓</span> Zero third-party telemetry tracking</li>
                  <li className="flex items-center gap-2"><span className="text-accent-teal font-bold">✓</span> Reproducible, deterministic builds</li>
                  <li className="flex items-center gap-2"><span className="text-accent-teal font-bold">✓</span> Automated CI/CD security workflows</li>
                  <li className="flex items-center gap-2"><span className="text-accent-teal font-bold">✓</span> Designed & maintainer verified in India</li>
                </ul>
              </div>

              <div className="mt-5 p-3 rounded-lg bg-dark-elevated border border-dark-border-subtle font-mono text-[10px] text-dark-text-faint">
                ⚡ Avg. Pipeline Latency: &lt; 42ms
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ── WHY ZENITH & FOUNDER SECTION ── */}
      <ScrollReveal
        id="founder"
        className="max-w-[940px] mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10 md:py-12"
      >
        <div className="bg-dark-surface/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-dark-border/60 shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-dark-text">
            Why Zenith?
          </h2>
          <p className="text-sm sm:text-base text-dark-text-muted mb-6 max-w-[680px]">
            We&apos;re different from traditional proprietary suites for a bunch of core reasons:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-8">
            <div className="p-4 rounded-xl bg-dark-surface border border-dark-border/70 holo-card">
              <div className="w-8 h-8 rounded-lg bg-accent-teal/15 text-accent-teal flex items-center justify-center font-bold mb-2.5">
                01
              </div>
              <h3 className="font-extrabold text-sm text-dark-text mb-1">Total Transparency</h3>
              <p className="text-xs text-dark-text-muted leading-relaxed">
                Every single line of code is auditable in public repositories. No hidden algorithms, no opaque trackers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-dark-surface border border-dark-border/70 holo-card">
              <div className="w-8 h-8 rounded-lg bg-amber-button/15 text-amber-button flex items-center justify-center font-bold mb-2.5">
                02
              </div>
              <h3 className="font-extrabold text-sm text-dark-text mb-1">Fast Shipping Cadence</h3>
              <p className="text-xs text-dark-text-muted leading-relaxed">
                Check our commit cadence and changelog. We iterate rapidly on real civic problems and developer tooling.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-dark-surface border border-dark-border/70 holo-card">
              <div className="w-8 h-8 rounded-lg bg-cobalt/15 text-cobalt flex items-center justify-center font-bold mb-2.5">
                03
              </div>
              <h3 className="font-extrabold text-sm text-dark-text mb-1">Independent & Sovereign</h3>
              <p className="text-xs text-dark-text-muted leading-relaxed">
                Engineered in India with zero corporate vendor lock-in. Built for community resilience and global reach.
              </p>
            </div>
          </div>

          {/* Founder Dossier Card */}
          <div className="bg-dark-elevated/90 border border-dark-border/80 rounded-2xl p-5 sm:p-7 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-dark-border-subtle mb-4">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <FounderAvatar size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-xl font-extrabold text-dark-text leading-tight truncate">Roshan Kr Singh</h3>
                    <span className="text-[9px] font-mono font-bold text-accent-teal bg-accent-teal/10 px-2 py-0.5 rounded border border-accent-teal/20">
                      🇮🇳 FOUNDER
                    </span>
                  </div>
                  <span className="text-xs text-dark-text-muted font-mono font-bold block mt-0.5">
                    @roshhellwett · Systems Engineer & Open Source Maintainer
                  </span>
                </div>
              </div>

              {/* Virtual Coffee Button */}
              <button
                onClick={() => {
                  playRetroSound("success");
                  setCoffeeGiven(true);
                  setTimeout(() => setCoffeeGiven(false), 3000);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  coffeeGiven
                    ? "bg-accent-teal text-white border-accent-teal shadow-md"
                    : "bg-amber-button/10 text-amber-button border-amber-button/40 hover:bg-amber-button/20"
                }`}
              >
                {coffeeGiven ? (
                  <>
                    <Heart className="w-3.5 h-3.5 fill-white text-white animate-bounce" />
                    <span>Appreciated!</span>
                  </>
                ) : (
                  <>
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Send Virtual Coffee</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-dark-text-muted leading-relaxed mb-4">
              Independent developer, systems engineer, and Google Dev member based in India. Roshan builds micro-utilities, civic project concepts, and lightweight automation bots aimed at optimizing developer workspaces and administrative loops.
            </p>

            <blockquote className="border-l-4 border-amber-button pl-3.5 py-1 text-xs sm:text-sm italic text-dark-text bg-dark-surface/60 rounded-r-lg mb-5">
              &ldquo;Open Source is the first step of genuine development. Build public tools, verified lines, and transparent frameworks to empower the next generation.&rdquo;
            </blockquote>

            <div className="flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playRetroSound("click")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-dark-text-muted hover:text-dark-text hover:bg-dark-elevated holo-card transition-all font-semibold"
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ── FOOTER ── */}
      <footer className="border-t border-dark-border bg-dark-surface/90 backdrop-blur-sm select-none overflow-x-hidden">
        <div className="max-w-[940px] mx-auto px-3 sm:px-4 md:px-6 py-6 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5 text-xs sm:text-sm text-dark-text-muted font-semibold">
              <span>© {new Date().getFullYear()} Zenith Open Source</span>
              <span className="flex items-center gap-1.5 text-accent-teal">
                <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse shrink-0" />
                <span>All systems operational</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-dark-text-faint font-medium">
              <Link href="/privacy" className="hover:text-dark-text transition-colors">Privacy</Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-dark-text transition-colors">Terms</Link>
              <span>·</span>
              <Link href="/cookies" className="hover:text-dark-text transition-colors">Cookies</Link>
              <span>·</span>
              <Link href="/open-source" className="hover:text-dark-text transition-colors">Open Source</Link>
              <span>·</span>
              <Link href="/security" className="hover:text-dark-text transition-colors">Security</Link>
              <span>·</span>
              <a href="https://github.com/roshhellwett" target="_blank" rel="noopener noreferrer" className="hover:text-dark-text transition-colors">GitHub</a>
              <span>·</span>
              <a href="https://www.linkedin.com/in/roshhellwett" target="_blank" rel="noopener noreferrer" className="hover:text-dark-text transition-colors">LinkedIn</a>
            </div>
          </div>
          <div className="text-center text-[10px] text-dark-text-faint border-t border-dark-border-subtle pt-3 font-semibold leading-relaxed">
            Designed with PostHog aesthetics · Built with Next.js 16, React 19 & Tailwind CSS v4 · Powered by{' '}
            <a href="https://groq.com" target="_blank" rel="noopener noreferrer" className="text-accent-teal hover:text-fern posthog-link font-bold">Groq AI</a>
          </div>
        </div>
      </footer>

      {/* ── BACK TO TOP FLOATING BUTTON ── */}
      <button
        onClick={handleScrollToTop}
        className={`fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-[60] p-3 sm:p-3 rounded-full bg-amber-button text-black shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        title="Back to top"
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {/* ── COOKIE CONSENT / PRIVACY BANNER ── */}
      {showConsent && (
        <div className="animate-cookie-enter fixed bottom-0 sm:bottom-6 left-0 sm:left-auto right-0 sm:right-6 sm:max-w-sm bg-dark-surface border border-dark-border sm:rounded-2xl shadow-2xl p-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] sm:pb-4 z-[70] flex flex-col gap-2 sm:gap-3 backdrop-blur-xl">
          <div className="text-[11px] sm:text-xs text-dark-text leading-relaxed font-medium">
            🍪 <strong>Privacy Guarantee:</strong> Zenith does not use tracking cookies. All user preferences (OS mode, audio settings) remain local to your browser.
          </div>
          <button
            onClick={handleAcceptConsent}
            className="bg-amber-button hover:bg-saffron-deep text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 border border-amber-shadow self-end cursor-pointer shadow-sm"
          >
            Accept
          </button>
        </div>
      )}

    </div>
  );
}
