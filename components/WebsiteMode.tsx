"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, ExternalLink, Shuffle, Play } from "lucide-react";
import { FEATURED_FALLBACK, FALLBACK_REPOS } from "@/data/repos";
import { STACK } from "@/data/stack";
import { SOCIALS } from "@/data/socials";

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

export default function WebsiteMode({ onSwitchToDesktop }: WebsiteModeProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [autoCycle, setAutoCycle] = useState(true);
  const allRepos = [FEATURED_FALLBACK, ...FALLBACK_REPOS];

  // Auto-cycle tabs
  useEffect(() => {
    if (!autoCycle) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % FEATURE_TABS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [autoCycle]);

  const currentTab = FEATURE_TABS[activeTab];

  return (
    <div className="min-h-screen text-dark-text relative z-10">
      {/* ── HERO SECTION ── */}
      <section className="max-w-[900px] mx-auto px-6 pt-16 pb-8">
        <div className="bg-dark-surface/90 rounded-2xl p-8 md:p-10 border border-dark-border/50">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-9 h-9" viewBox="0 0 32 32" fill="none">
            <rect x="2" y="6" width="28" height="20" rx="3" fill="#1d1f27" stroke="#F1A82C" strokeWidth="2"/>
            <path d="M6 10h4v2H6zM12 10h4v2h-4zM20 10h6v2h-6z" fill="#F1A82C" opacity="0.8"/>
            <path d="M6 15h20v1H6z" fill="#65675e"/>
            <path d="M6 18h14v1H6z" fill="#65675e"/>
          </svg>
          <span className="font-extrabold text-2xl tracking-tight">Zenith</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
          The open source way to<br />build civic tech
        </h1>

        <p className="text-lg text-dark-text-muted leading-relaxed max-w-[660px] mb-2">
          Building software used to mean relying on proprietary tools, closed-source dependencies, and opaque architectures.
        </p>
        <p className="text-lg text-dark-text-muted leading-relaxed max-w-[660px] mb-8">
          Zenith is the only project registry that acts as a blueprint for you to build civic-tech, systems utilities, and dev tools — <em className="text-dark-text">transparently.</em>
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <a
            href="https://github.com/roshhellwett/zenithopensourceprojects"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-button hover:bg-saffron-deep text-black px-5 py-2.5 rounded-md text-sm font-bold transition-all active:scale-95 border border-amber-shadow"
          >
            Get started - free
          </a>
          <a
            href="https://github.com/roshhellwett"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-dark-border hover:border-dark-text-muted text-dark-text px-5 py-2.5 rounded-md text-sm font-bold transition-all hover:bg-dark-surface"
          >
            View Source
          </a>
        </div>

        {/* Sub-links */}
        <div className="flex items-center gap-4 text-sm text-dark-text-muted">
          <a href="https://github.com/roshhellwett" target="_blank" rel="noopener noreferrer" className="posthog-link flex items-center gap-1">
            <span className="text-accent-teal">◆</span> GitHub
          </a>
          <span className="text-dark-border">•</span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-dark-text transition-colors" onClick={onSwitchToDesktop}>
            <Play className="w-3 h-3" /> Desktop mode
          </span>
          <span className="text-dark-border">•</span>
          <a href="https://www.linkedin.com/in/roshhellwett" target="_blank" rel="noopener noreferrer" className="posthog-link flex items-center gap-1">
            💬 Talk to founder
          </a>
        </div>
        </div>
      </section>

      {/* ── FEATURE TABS ── */}
      <section className="max-w-[900px] mx-auto px-6 py-12">
        <div className="bg-dark-surface/85 rounded-2xl p-6 md:p-8 border border-dark-border/50">
        {/* Tab buttons */}
        <div className="flex overflow-x-auto gap-0 border-b border-dark-border-subtle mb-0">
          {FEATURE_TABS.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(i);
                setAutoCycle(false);
              }}
              className={`relative px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                i === activeTab
                  ? "text-dark-text"
                  : "text-dark-text-muted hover:text-dark-text"
              }`}
            >
              {tab.label}
              {i === activeTab && (
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${tab.color === "teal" ? "accent-teal" : tab.color === "orange" ? "amber-button" : tab.color === "salmon" ? "accent-salmon" : "accent-purple"}`}>
                  {autoCycle && (
                    <div className="h-full bg-dark-text/30 tab-progress-bar" />
                  )}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          className={`border-2 rounded-b-xl p-8 transition-all ${
            currentTab.color === "teal"
              ? "border-accent-teal glow-teal"
              : currentTab.color === "orange"
              ? "border-amber-button glow-orange"
              : currentTab.color === "salmon"
              ? "border-accent-salmon glow-salmon"
              : "border-accent-purple glow-purple"
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-extrabold tracking-tight">{currentTab.title}</h2>
            <button
              onClick={() => setAutoCycle(!autoCycle)}
              className="p-1.5 text-dark-text-muted hover:text-dark-text border border-dark-border rounded transition-colors"
              title={autoCycle ? "Pause auto-cycle" : "Resume auto-cycle"}
            >
              {autoCycle ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
          </div>

          <p className="text-dark-text-muted leading-relaxed mb-2 max-w-[640px]">
            {currentTab.desc}
          </p>
          <p className="text-dark-text-muted leading-relaxed mb-6 max-w-[640px]">
            {currentTab.subDesc}
          </p>

          {/* Categories grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentTab.categories.map((cat) => (
              <div key={cat.name}>
                <div className="text-xs font-medium text-dark-text-muted uppercase tracking-wider mb-3 pb-2 border-b border-dark-border-subtle">
                  {cat.name}
                </div>
                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-dark-text hover:text-amber-button posthog-link transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span className="text-sm text-dark-text-muted">{item.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* ── WHO'S USING ZENITH ── */}
      <section className="max-w-[900px] mx-auto px-6 py-12">
        <div className="bg-dark-surface/85 rounded-2xl p-6 md:p-8 border border-dark-border/50">
        <h2 className="text-3xl font-extrabold tracking-tight mb-4">
          Featured Projects
        </h2>
        <p className="text-dark-text-muted mb-8 max-w-[660px]">
          Here are the open source projects in the Zenith registry. Each one is built for real-world use, fully auditable, and MIT-licensed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {allRepos.slice(0, 6).map((repo) => (
            <a
              key={repo.name}
              href={repo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-dark-surface border border-dark-border rounded-lg p-5 hover:border-dark-text-muted/30 transition-all hover:bg-dark-elevated"
            >
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
              {repo.homepage && (
                <div className="mt-3 flex items-center gap-1 text-accent-teal text-xs font-semibold">
                  <ExternalLink className="w-3 h-3" />
                  <span>Live Demo</span>
                </div>
              )}
            </a>
          ))}
        </div>

        <a
          href="https://github.com/roshhellwett?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-amber-button hover:text-saffron-deep text-sm font-bold posthog-link transition-colors"
        >
          View all projects on GitHub <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
        </div>
      </section>

      {/* ── DATA STACK ── */}
      <section className="max-w-[900px] mx-auto px-6 py-12">
        <div className="bg-dark-surface/85 rounded-2xl p-6 md:p-8 border border-dark-border/50">
        <h2 className="text-3xl font-extrabold tracking-tight mb-4">
          Zenith tech stack, built for developers
        </h2>
        <p className="text-dark-text-muted mb-8 max-w-[660px]">
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
                    <span key={item} className="text-xs bg-dark-elevated border border-dark-border-subtle rounded px-2 py-0.5 text-dark-text-muted font-mono">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-lg p-5">
            <div className="font-bold text-sm text-amber-button mb-3">Built-in, Zenith ships with:</div>
            <ul className="space-y-2 text-sm text-dark-text-muted">
              <li className="flex items-center gap-2"><span className="text-dark-text-faint">◦</span> MIT License (always free)</li>
              <li className="flex items-center gap-2"><span className="text-dark-text-faint">◦</span> 8+ active repositories</li>
              <li className="flex items-center gap-2"><span className="text-dark-text-faint">◦</span> Full documentation</li>
              <li className="flex items-center gap-2"><span className="text-dark-text-faint">◦</span> Reproducible builds</li>
              <li className="flex items-center gap-2"><span className="text-dark-text-faint">◦</span> CI/CD workflows</li>
              <li className="flex items-center gap-2"><span className="text-dark-text-faint">◦</span> Contribution guidelines</li>
            </ul>
          </div>
        </div>
        </div>
      </section>

      {/* ── PRICING / STATS ── */}
      <section className="max-w-[900px] mx-auto px-6 py-12">
        <div className="bg-dark-surface/85 rounded-2xl p-6 md:p-8 border border-dark-border/50">
        <h2 className="text-3xl font-extrabold tracking-tight mb-4">
          Open source by design
        </h2>
        <p className="text-dark-text-muted mb-8 max-w-[660px]">
          Our whole philosophy is that software should be free, transparent, and auditable. 100% of Zenith projects are open source.
        </p>

        <div className="border border-dark-border rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-dark-surface">
                <th className="text-left py-3 px-4 font-semibold text-dark-text-muted">#</th>
                <th className="text-left py-3 px-4 font-semibold text-dark-text-muted">Project</th>
                <th className="text-left py-3 px-4 font-semibold text-dark-text-muted">Language</th>
                <th className="text-left py-3 px-4 font-semibold text-dark-text-muted">Category</th>
              </tr>
            </thead>
            <tbody>
              {allRepos.slice(0, 5).map((repo, i) => (
                <tr key={repo.name} className="border-t border-dark-border-subtle hover:bg-dark-surface/50 transition-colors">
                  <td className="py-3 px-4 text-dark-text-muted">{i + 1}</td>
                  <td className="py-3 px-4">
                    <a href={repo.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-dark-text posthog-link">
                      {repo.displayName}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-dark-text-muted">{repo.lang}</td>
                  <td className="py-3 px-4 text-dark-text-muted capitalize">{repo.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </section>

      {/* ── WHY ZENITH ── */}
      <section className="max-w-[900px] mx-auto px-6 py-12">
        <div className="bg-dark-surface/85 rounded-2xl p-6 md:p-8 border border-dark-border/50">
        <h2 className="text-3xl font-extrabold tracking-tight mb-6">
          Why Zenith?
        </h2>
        <p className="text-dark-text-muted mb-6">
          We&apos;re different from most portfolios for a bunch of reasons:
        </p>
        <ul className="space-y-3 text-dark-text-muted mb-8 max-w-[660px]">
          <li className="flex items-start gap-2">
            <span className="text-dark-text mt-0.5">•</span>
            <span>
              <strong className="text-dark-text">Transparency.</strong> Every line of code is public. Read the{" "}
              <a href="https://github.com/roshhellwett" target="_blank" rel="noopener noreferrer" className="posthog-link font-semibold">source code</a>,
              the documentation, and the commit history.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-dark-text mt-0.5">•</span>
            <span>
              <strong className="text-dark-text">We ship fast.</strong> See the{" "}
              <a href="https://github.com/roshhellwett/zenithopensourceprojects/commits/main" target="_blank" rel="noopener noreferrer" className="posthog-link font-semibold">changelog</a>.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-dark-text mt-0.5">•</span>
            <span>
              <strong className="text-dark-text"><em>Actually</em>-technical founder.</strong> The person building these tools has an engineering background and ships real code.
            </span>
          </li>
        </ul>

        <h3 className="text-xl font-bold mb-4">Resources</h3>
        <ul className="space-y-2 text-dark-text-muted mb-8">
          <li className="flex items-center gap-2">
            <span>•</span>
            <a href="https://github.com/roshhellwett/zenithopensourceprojects#readme" target="_blank" rel="noopener noreferrer" className="posthog-link font-semibold">Technical docs</a>
          </li>
          <li className="flex items-center gap-2">
            <span>•</span>
            <a href="https://github.com/roshhellwett" target="_blank" rel="noopener noreferrer" className="posthog-link font-semibold">GitHub Profile</a>
          </li>
          <li className="flex items-center gap-2">
            <span>•</span>
            <a href="https://www.linkedin.com/in/roshhellwett" target="_blank" rel="noopener noreferrer" className="posthog-link font-semibold">Connect on LinkedIn</a>
          </li>
        </ul>
        </div>
      </section>

      {/* ── SHAMELESS CTA ── */}
      <section className="max-w-[900px] mx-auto px-6 py-12">
        <div className="bg-dark-surface/85 rounded-2xl p-6 md:p-8 border border-dark-border/50">
        <h2 className="text-3xl font-extrabold tracking-tight mb-4">
          Ready to explore?
        </h2>
        <p className="text-dark-text-muted mb-8">
          If nothing else has convinced you, maybe the fact that it&apos;s completely free will.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: feature list */}
          <div className="space-y-4">
            <div className="bg-dark-surface border border-dark-border rounded-lg p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-accent-teal">🌿 Open Source</div>
              <h3 className="text-2xl font-extrabold">Zenith Registry</h3>
              <p className="text-sm text-dark-text-muted">All projects • Forever free</p>

              <div className="pt-3 border-t border-dark-border-subtle space-y-2">
                <div className="text-sm">
                  <span className="text-dark-text-muted line-through mr-2">$99/mo</span>
                  <span className="text-xl font-extrabold text-accent-teal">FREE</span>
                  <span className="text-dark-text-muted text-xs ml-1">forever</span>
                </div>
              </div>

              <a
                href="https://github.com/roshhellwett/zenithopensourceprojects"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-amber-button hover:bg-saffron-deep text-black px-6 py-3 rounded-md font-bold text-base transition-all active:scale-95 border border-amber-shadow"
              >
                Get started
              </a>

              <p className="text-xs text-dark-text-faint text-center">
                ⚡ Hurry: <strong className="text-dark-text-muted">Open source means infinite seats.</strong> No FOMO needed.
              </p>
            </div>
          </div>

          {/* Right: founder card */}
          <div className="bg-dark-surface border border-dark-border rounded-lg p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-button to-ember flex items-center justify-center border-2 border-dark-border text-white text-xl font-bold">
                RK
              </div>
              <div>
                <div className="font-extrabold text-lg text-dark-text">Roshan Kr Singh</div>
                <div className="text-xs text-dark-text-muted font-mono">@roshhellwett · Founder & Maintainer</div>
              </div>
            </div>
            <p className="text-sm text-dark-text-muted leading-relaxed mb-4">
              Independent developer, systems engineer, and Google Dev member based in India. Building micro-utilities and civic project concepts for the developer community.
            </p>
            <blockquote className="border-l-2 border-amber-button pl-3 text-sm italic text-dark-text-muted">
              &ldquo;Open Source is the first step of development. Build public tools and transparent frameworks.&rdquo;
            </blockquote>
            <div className="flex flex-wrap gap-2 mt-4">
              {SOCIALS.slice(0, 4).map((s) => (
                <a
                  key={s.label}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-dark-elevated border border-dark-border-subtle rounded text-xs text-dark-text-muted hover:text-dark-text hover:border-dark-text-muted/30 transition-colors"
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-dark-border mt-16 bg-dark-surface/90 backdrop-blur-sm">
        <div className="max-w-[900px] mx-auto px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-dark-text-muted">
              <span>© 2026 Zenith Open Source</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
                All systems operational
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-dark-text-faint">
              <a href="https://github.com/roshhellwett/zenithopensourceprojects/blob/main/license" target="_blank" rel="noopener noreferrer" className="hover:text-dark-text-muted transition-colors">MIT License</a>
              <a href="https://github.com/roshhellwett" target="_blank" rel="noopener noreferrer" className="hover:text-dark-text-muted transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/roshhellwett" target="_blank" rel="noopener noreferrer" className="hover:text-dark-text-muted transition-colors">LinkedIn</a>
            </div>
          </div>
          <div className="text-center text-[11px] text-dark-text-faint border-t border-dark-border-subtle pt-3">
            Design inspired by{' '}
            <a href="https://posthog.com" target="_blank" rel="noopener noreferrer" className="text-amber-button hover:text-saffron-deep font-semibold posthog-link">PostHog</a>
            {' '}· Built with Next.js & Tailwind CSS · Powered by{' '}
            <a href="https://groq.com" target="_blank" rel="noopener noreferrer" className="text-accent-teal hover:text-fern font-semibold posthog-link">Groq AI</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
