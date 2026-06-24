"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, ExternalLink, Play } from "lucide-react";
import { FEATURED_FALLBACK, FALLBACK_REPOS } from "@/data/repos";
import { STACK } from "@/data/stack";
import { SOCIALS } from "@/data/socials";
import { useMouseSpotlight } from "@/lib/useMouseSpotlight";
import { motion, AnimatePresence } from "framer-motion";
import type { Repo } from "@/types";
import { playRetroSound } from "@/lib/audio";

const FEATURE_TABS = [
  {
    id: "explore",
    label: "Explore projects",
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
    label: "One project registry",
    color: "orange",
    borderColor: "border-tab-orange",
    title: "All projects, one dashboard",
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
    label: "Debug & audit",
    color: "salmon",
    borderColor: "border-tab-salmon",
    title: "Transparent, auditable code",
    desc: "Every project features MIT licensing, clean documentation, deterministic execution, and full source code transparency.",
    subDesc: "No hidden dependencies. No black boxes. Audit everything.",
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
    label: "Test & contribute",
    color: "purple",
    borderColor: "border-tab-purple",
    title: "Ship features safely & get feedback",
    desc: "All projects welcome contributions. Fork, test locally, and submit pull requests. Each repo includes setup instructions and contribution guidelines.",
    subDesc: "Built with modern tooling: TypeScript, React, Python, and C++ across the stack.",
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

interface WebsiteModeProps {
  onSwitchToDesktop: () => void;
}

// Sub-component for project cards using the useMouseSpotlight hook
function ProjectCard({ repo }: { repo: Repo }) {
  const { ref, x, y, bind } = useMouseSpotlight();

  return (
    <a
      ref={ref}
      {...bind}
      href={repo.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => playRetroSound("click")}
      className="group relative bg-dark-surface border border-dark-border rounded-lg p-5 transition-all overflow-hidden flex flex-col justify-between hover:border-dark-text-muted/30 hover:bg-dark-elevated"
    >
      {/* Spotlight overlay tracking the cursor */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
        style={{
          background: `radial-gradient(350px circle at ${x}px ${y}px, rgba(241, 168, 44, 0.07), transparent 75%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold bg-dark-elevated px-2 py-0.5 rounded text-dark-text-muted border border-dark-border-subtle">
            {repo.lang}
          </span>
          <ArrowUpRight className="w-4 h-4 text-dark-text-muted group-hover:text-amber-button transition-colors" />
        </div>
        <h3 className="font-extrabold text-base text-dark-text mb-1.5 group-hover:text-amber-button transition-colors">
          {repo.displayName}
        </h3>
        <p className="text-xs text-dark-text-muted leading-relaxed line-clamp-2">
          {repo.desc}
        </p>
      </div>

      <div className="relative z-10 mt-3 flex items-center justify-between">
        {repo.homepage ? (
          <div className="flex items-center gap-1 text-accent-teal text-xs font-semibold">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Demo</span>
          </div>
        ) : (
          <div />
        )}
      </div>
    </a>
  );
}

export default function WebsiteMode({ onSwitchToDesktop }: WebsiteModeProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [autoCycle, setAutoCycle] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const allRepos = [FEATURED_FALLBACK, ...FALLBACK_REPOS];

  // Auto-cycle feature tabs
  useEffect(() => {
    if (!autoCycle) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % FEATURE_TABS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [autoCycle]);

  // Handle scroll events (back to top)
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener("scroll", handleScroll);
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
    if (!localStorage.getItem("zenith_cookie_consent")) {
      const timer = setTimeout(() => setShowConsent(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Subtle hero card parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) * 0.012,
        y: (e.clientY - window.innerHeight / 2) * 0.012,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const currentTab = FEATURE_TABS[activeTab];

  const handleScrollToTop = () => {
    playRetroSound("minimize");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAcceptConsent = () => {
    playRetroSound("success");
    localStorage.setItem("zenith_cookie_consent", "true");
    setShowConsent(false);
  };

  return (
    <div className="min-h-screen text-dark-text relative z-10 selection:bg-amber-button/30 select-none md:select-text">
      
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
      <motion.section
        id="hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 md:py-16"
      >
        <div
          style={{
            transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
            transition: "transform 0.1s ease-out",
          }}
          className="bg-dark-surface/90 rounded-2xl p-6 sm:p-10 border border-dark-border/50 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6 select-none">
            <svg className="w-9 h-9 animate-pulse" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="6" width="28" height="20" rx="3" fill="#1d1f27" stroke="#F1A82C" strokeWidth="2"/>
              <path d="M6 10h4v2H6zM12 10h4v2h-4zM20 10h6v2h-6z" fill="#F1A82C" opacity="0.8"/>
              <path d="M6 15h20v1H6z" fill="#65675e"/>
              <path d="M6 18h14v1H6z" fill="#65675e"/>
            </svg>
            <span className="font-extrabold text-2xl tracking-tight">Zenith</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            The open source way to<br />build civic tech
          </h1>

          <p className="text-base sm:text-lg text-dark-text-muted leading-relaxed max-w-[660px] mb-3">
            Building software used to mean relying on proprietary tools, closed-source dependencies, and opaque architectures.
          </p>
          <p className="text-base sm:text-lg text-dark-text-muted leading-relaxed max-w-[660px] mb-8">
            Zenith is the only project registry that acts as a blueprint for you to build civic-tech, systems utilities, and dev tools — <em className="text-dark-text">transparently.</em>
          </p>

          {/* CTA Buttons - Responsive Stacked layout */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 select-none">
            <a
              href="https://github.com/roshhellwett/zenithopensourceprojects"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-button hover:bg-saffron-deep text-black px-6 py-2.5 rounded-md text-sm font-bold transition-all active:scale-95 border border-amber-shadow text-center"
            >
              Get started - free
            </a>
            <a
              href="https://github.com/roshhellwett"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-dark-border hover:border-dark-text-muted text-dark-text px-6 py-2.5 rounded-md text-sm font-bold transition-all hover:bg-dark-surface text-center"
            >
              View Source
            </a>
          </div>

          {/* Sub-links */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-dark-text-muted select-none">
            <a href="https://github.com/roshhellwett" target="_blank" rel="noopener noreferrer" className="posthog-link flex items-center gap-1 hover:text-amber-button">
              <span className="text-accent-teal">◆</span> GitHub
            </a>
            <span className="text-dark-border">•</span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-amber-button transition-colors" onClick={onSwitchToDesktop}>
              <Play className="w-3 h-3 text-amber-button" /> Desktop OS mode
            </span>
            <span className="text-dark-border">•</span>
            <a href="https://www.linkedin.com/in/roshhellwett" target="_blank" rel="noopener noreferrer" className="posthog-link flex items-center gap-1 hover:text-amber-button">
              💬 Talk to founder
            </a>
          </div>
        </div>
      </motion.section>

      {/* ── FEATURE TABS ── */}
      <motion.section
        id="tabs"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 md:py-12"
      >
        <div className="bg-dark-surface/90 rounded-2xl p-4 sm:p-8 border border-dark-border/50 shadow-xl overflow-hidden">
          
          {/* Scrollable Tabs Wrapper with gradient fade */}
          <div className="relative mb-2 select-none">
            <div className="flex overflow-x-auto gap-0 border-b border-dark-border-subtle scrollbar-none pr-12">
              {FEATURE_TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    playRetroSound("click");
                    setActiveTab(i);
                    setAutoCycle(false);
                  }}
                  className={`relative px-5 py-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    i === activeTab
                      ? "text-dark-text font-black"
                      : "text-dark-text-muted hover:text-dark-text"
                  }`}
                >
                  {tab.label}
                  {i === activeTab && (
                    <motion.div
                      layoutId="activeTabBorder"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${
                        tab.color === "teal"
                          ? "accent-teal"
                          : tab.color === "orange"
                          ? "amber-button"
                          : tab.color === "salmon"
                          ? "accent-salmon"
                          : "accent-purple"
                      }`}
                    >
                      {autoCycle && <div className="h-full bg-dark-text/30 tab-progress-bar" />}
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
            {/* Right gradient fade indicator */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-dark-surface to-transparent pointer-events-none" />
          </div>

          {/* Animate tab content change with crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className={`border-2 rounded-b-xl p-5 sm:p-8 transition-all duration-300 ${
                currentTab.color === "teal"
                  ? "border-accent-teal glow-teal"
                  : currentTab.color === "orange"
                  ? "border-amber-button glow-orange"
                  : currentTab.color === "salmon"
                  ? "border-accent-salmon glow-salmon"
                  : "border-accent-purple glow-purple"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{currentTab.title}</h2>
                <button
                  onClick={() => {
                    playRetroSound("toggle");
                    setAutoCycle(!autoCycle);
                  }}
                  className="p-1.5 text-dark-text-muted hover:text-dark-text border border-dark-border rounded transition-colors cursor-pointer shrink-0"
                  title={autoCycle ? "Pause auto-cycle" : "Resume auto-cycle"}
                  aria-label={autoCycle ? "Pause cycle" : "Resume cycle"}
                >
                  {autoCycle ? (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" rx="1"/>
                      <rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                </button>
              </div>

              <p className="text-sm sm:text-base text-dark-text-muted leading-relaxed mb-2 max-w-[640px]">
                {currentTab.desc}
              </p>
              <p className="text-sm text-dark-text-muted leading-relaxed mb-6 max-w-[640px]">
                {currentTab.subDesc}
              </p>

              {/* Categories grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentTab.categories.map((cat) => (
                  <div key={cat.name}>
                    <div className="text-[10px] font-bold text-dark-text-muted uppercase tracking-widest mb-3 pb-2 border-b border-dark-border-subtle">
                      {cat.name}
                    </div>
                    <div className="space-y-2">
                      {cat.items.map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          <span className="text-sm select-none">{item.icon}</span>
                          {item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs sm:text-sm font-bold text-dark-text hover:text-amber-button posthog-link transition-colors"
                            >
                              {item.label}
                            </a>
                          ) : (
                            <span className="text-xs sm:text-sm text-dark-text-muted">{item.label}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      {/* ── WHO'S USING ZENITH (PROJECTS GRID) ── */}
      <motion.section
        id="projects"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 md:py-12"
      >
        <div className="bg-dark-surface/90 rounded-2xl p-6 sm:p-8 border border-dark-border/50 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            Featured Projects
          </h2>
          <p className="text-sm sm:text-base text-dark-text-muted mb-8 max-w-[660px]">
            Here are the open source projects in the Zenith registry. Each one is built for real-world use, fully auditable, and MIT-licensed.
          </p>

          {/* Grid layout with single column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            {allRepos.slice(0, 6).map((repo) => (
              <ProjectCard key={repo.name} repo={repo} />
            ))}
          </div>

          <a
            href="https://github.com/roshhellwett?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-amber-button hover:text-saffron-deep text-xs sm:text-sm font-bold posthog-link transition-colors"
          >
            View all projects on GitHub <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.section>

      {/* ── DATA STACK ── */}
      <motion.section
        id="stack"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 md:py-12"
      >
        <div className="bg-dark-surface/90 rounded-2xl p-6 sm:p-8 border border-dark-border/50 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            Zenith tech stack, built for developers
          </h2>
          <p className="text-sm sm:text-base text-dark-text-muted mb-8 max-w-[660px]">
            When you&apos;re building open source tools, you should be working with the best technologies. Zenith projects span multiple languages and paradigms.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
            <div className="space-y-4">
              {STACK.map((group) => (
                <div key={group.category} className="bg-dark-surface border border-dark-border rounded-lg p-4">
                  <div className="font-bold text-sm text-dark-text mb-1">{group.category}</div>
                  <div className="text-xs text-dark-text-muted mb-2">{group.concept}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span key={item} className="text-[10px] bg-dark-elevated border border-dark-border-subtle rounded px-2 py-0.5 text-dark-text-muted font-mono select-text">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-dark-surface border border-dark-border rounded-lg p-5 flex flex-col justify-center">
              <div className="font-bold text-xs sm:text-sm text-amber-button mb-3">Zenith ships with:</div>
              <ul className="space-y-2 text-xs sm:text-sm text-dark-text-muted">
                <li className="flex items-center gap-2"><span className="text-dark-text-faint select-none">◦</span> MIT License (always free)</li>
                <li className="flex items-center gap-2"><span className="text-dark-text-faint select-none">◦</span> 8+ active repositories</li>
                <li className="flex items-center gap-2"><span className="text-dark-text-faint select-none">◦</span> Full documentation</li>
                <li className="flex items-center gap-2"><span className="text-dark-text-faint select-none">◦</span> Reproducible builds</li>
                <li className="flex items-center gap-2"><span className="text-dark-text-faint select-none">◦</span> CI/CD workflows</li>
                <li className="flex items-center gap-2"><span className="text-dark-text-faint select-none">◦</span> Contribution guidelines</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── REGISTRY TABLE ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 md:py-12"
      >
        <div className="bg-dark-surface/90 rounded-2xl p-4 sm:p-8 border border-dark-border/50 shadow-xl overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            Registry Index
          </h2>
          <p className="text-sm sm:text-base text-dark-text-muted mb-6">
            Complete structural list of core verified repositories inside the Zenith environment.
          </p>

          <div className="border border-dark-border rounded-lg overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-dark-surface border-b border-dark-border select-none">
                  <th className="text-left py-3 px-4 font-bold text-dark-text-muted w-12">#</th>
                  <th className="text-left py-3 px-4 font-bold text-dark-text-muted">Project</th>
                  <th className="text-left py-3 px-4 font-bold text-dark-text-muted">Language</th>
                  <th className="text-left py-3 px-4 font-bold text-dark-text-muted">Category</th>
                </tr>
              </thead>
              <tbody className="select-text">
                {allRepos.slice(0, 5).map((repo, i) => (
                  <tr key={repo.name} className="border-t border-dark-border-subtle hover:bg-dark-surface/50 transition-colors">
                    <td className="py-3 px-4 text-dark-text-muted">{i + 1}</td>
                    <td className="py-3 px-4">
                      <a href={repo.link} target="_blank" rel="noopener noreferrer" className="font-bold text-dark-text hover:text-amber-button posthog-link">
                        {repo.displayName}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-dark-text-muted font-mono text-xs">{repo.lang}</td>
                    <td className="py-3 px-4 text-dark-text-muted capitalize">{repo.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* ── WHY ZENITH & FOUNDER CARD ── */}
      <motion.section
        id="founder"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 md:py-12"
      >
        <div className="bg-dark-surface/90 rounded-2xl p-6 sm:p-8 border border-dark-border/50 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-6">
            Why Zenith?
          </h2>
          <p className="text-sm sm:text-base text-dark-text-muted mb-6">
            We&apos;re different from most portfolios for a bunch of reasons:
          </p>
          <ul className="space-y-3 text-sm sm:text-base text-dark-text-muted mb-8 max-w-[660px]">
            <li className="flex items-start gap-2">
              <span className="text-dark-text mt-0.5 select-none">•</span>
              <span>
                <strong className="text-dark-text">Transparency.</strong> Every line of code is public. Read the{" "}
                <a href="https://github.com/roshhellwett" target="_blank" rel="noopener noreferrer" className="posthog-link font-bold text-dark-text hover:text-amber-button">source code</a>,
                the documentation, and the commit history.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-dark-text mt-0.5 select-none">•</span>
              <span>
                <strong className="text-dark-text">We ship fast.</strong> See the{" "}
                <a href="https://github.com/roshhellwett/zenithopensourceprojects/commits/main" target="_blank" rel="noopener noreferrer" className="posthog-link font-bold text-dark-text hover:text-amber-button">changelog</a>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-dark-text mt-0.5 select-none">•</span>
              <span>
                <strong className="text-dark-text"><em>Actually</em>-technical founder.</strong> The person building these tools has an engineering background and ships real code.
              </span>
            </li>
          </ul>

          {/* Footer Shameless CTA + Founder Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-6 border-t border-dark-border-subtle">
            {/* CTA Box */}
            <div className="bg-dark-surface border border-dark-border rounded-lg p-5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-accent-teal">🌿 Open Source</div>
                <h3 className="text-2xl font-extrabold">Zenith Registry</h3>
                <p className="text-xs text-dark-text-muted leading-relaxed">All repositories in the environment are forever free and auditable.</p>
              </div>

              <div className="my-4">
                <span className="text-dark-text-muted line-through mr-2 text-xs">$99/mo</span>
                <span className="text-xl font-black text-accent-teal">FREE</span>
                <span className="text-dark-text-muted text-[10px] ml-1 uppercase font-bold">forever</span>
              </div>

              <a
                href="https://github.com/roshhellwett/zenithopensourceprojects"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-amber-button hover:bg-saffron-deep text-black px-6 py-2.5 rounded-md font-bold text-sm transition-all active:scale-95 border border-amber-shadow shadow"
              >
                Get started
              </a>
            </div>

            {/* Founder Card with gradient animated border on hover */}
            <div className="relative group/founder overflow-hidden rounded-lg p-[1px] transition-all duration-300">
              {/* Gradient border glowing on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-button via-accent-salmon to-accent-purple opacity-0 group-hover/founder:opacity-100 transition-opacity duration-500 animate-pulse pointer-events-none" />
              
              {/* Card content */}
              <div className="relative bg-dark-surface border border-dark-border rounded-lg p-5 z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-button to-accent-salmon flex items-center justify-center border-2 border-dark-border text-white text-xl font-bold select-none shadow">
                      RK
                    </div>
                    <div>
                      <div className="font-extrabold text-lg text-dark-text">Roshan Kr Singh</div>
                      <div className="text-[10px] text-dark-text-muted font-mono font-bold">@roshhellwett · Founder</div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-dark-text-muted leading-relaxed mb-4">
                    Independent developer, systems engineer, and Google Dev member based in India. Building micro-utilities and civic project concepts for the developer community.
                  </p>
                </div>
                <blockquote className="border-l-2 border-amber-button pl-3 text-xs italic text-dark-text-muted select-none">
                  &ldquo;Open Source is the first step of development. Build public tools and transparent frameworks.&rdquo;
                </blockquote>
                <div className="flex flex-wrap gap-1.5 mt-4 select-none">
                  {SOCIALS.slice(0, 4).map((s) => (
                    <a
                      key={s.label}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 bg-dark-elevated border border-dark-border-subtle rounded text-[10px] text-dark-text-muted hover:text-dark-text transition-colors"
                    >
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Decorative Wave Divider */}
      <div className="w-full overflow-hidden leading-[0] fill-dark-surface/90 mt-12 select-none" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10 transform rotate-180">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V30.28C1122.56,66,1061.08,92.83,985.66,92.83Z" fill="var(--color-dark-surface)"></path>
        </svg>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-dark-border bg-dark-surface/90 backdrop-blur-sm select-none">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-dark-text-muted font-semibold">
              <span>© {new Date().getFullYear()} Zenith Open Source</span>
              <span className="flex items-center gap-1.5 text-accent-teal">
                <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
                All modules active
              </span>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-dark-text-faint font-medium">
              <a href="https://github.com/roshhellwett/zenithopensourceprojects/blob/main/license" target="_blank" rel="noopener noreferrer" className="hover:text-dark-text transition-colors">MIT License</a>
              <a href="https://github.com/roshhellwett" target="_blank" rel="noopener noreferrer" className="hover:text-dark-text transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/roshhellwett" target="_blank" rel="noopener noreferrer" className="hover:text-dark-text transition-colors">LinkedIn</a>
            </div>
          </div>
          <div className="text-center text-[10px] text-dark-text-faint border-t border-dark-border-subtle pt-3 font-semibold leading-relaxed">
            Design inspired by{' '}
            <a href="https://posthog.com" target="_blank" rel="noopener noreferrer" className="text-amber-button hover:text-saffron-deep posthog-link">PostHog</a>
            {' '}· Built with Next.js & Tailwind CSS · Powered by{' '}
            <a href="https://groq.com" target="_blank" rel="noopener noreferrer" className="text-accent-teal hover:text-fern posthog-link">Groq AI</a>
          </div>
        </div>
      </footer>

      {/* ── BACK TO TOP FLOATING BUTTON ── */}
      <button
        onClick={handleScrollToTop}
        className={`fixed bottom-6 right-6 z-[60] p-3 rounded-full bg-amber-button text-black shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
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
      <AnimatePresence>
        {showConsent && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-sm bg-dark-surface border border-dark-border rounded-xl shadow-2xl p-4.5 z-[70] flex flex-col gap-3.5 backdrop-blur-md"
          >
            <div className="text-xs text-dark-text leading-relaxed font-medium">
              🍪 <strong>Cookie & Privacy Policy:</strong> Zenith does not use tracking cookies. All user configuration settings (OS mode preferences, sound toggle, search logs) are stored directly on your machine.
            </div>
            <button
              onClick={handleAcceptConsent}
              className="bg-amber-button hover:bg-saffron-deep text-black px-4.5 py-1.5 rounded-md text-xs font-bold transition-all active:scale-95 border border-amber-shadow self-end cursor-pointer"
            >
              Accept
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
