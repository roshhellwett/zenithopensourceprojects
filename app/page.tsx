"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useInView,
  type Transition,
} from "framer-motion";

import {
  Github,
  FolderGit2,
  Star,
  Code2,
  Sparkles,
  Flag,
  ArrowUpRight,
  ArrowRight,
  Layers,
  Globe,
  Eye,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { BrandMark } from "@/components/BrandMark";
import { Background } from "@/components/Background";
import { DashField } from "@/components/DashField";
import { Pill } from "@/components/Pill";

import { SectionHeading } from "@/components/SectionHeading";
import { Panel } from "@/components/Panel";
import { LifecycleLoop } from "@/components/LifecycleLoop";
import { CommitHeatmap } from "@/components/CommitHeatmap";
import { BharatWave } from "@/components/BharatWave";
import { FeaturedProject } from "@/components/FeaturedProject";
import { StructuredData } from "@/components/StructuredData";
import { FEATURED_FALLBACK } from "@/data/repos";
import { STACK } from "@/data/stack";
import { SOCIALS } from "@/data/socials";
import { NAV_LINKS } from "@/data/nav";
import { spring, fadeUp, stagger, staggerSlow } from "@/lib/animations";
import type { Repo } from "@/types";

const springT: Transition = spring;

/* ── Animated Counter ── */
function AnimatedCounter({ target, isLoaded }: { target: number; isLoaded: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || !isLoaded || hasAnimated.current || target <= 0) return;
    hasAnimated.current = true;
    const duration = 1800;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, isLoaded, target]);

  return <span ref={ref}>{isLoaded ? count : 0}</span>;
}

/* ── Mobile Nav ── */
function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[70] bg-slate-900/20 mobile-nav-backdrop" onClick={onClose} />
          <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 34 }}
            className="fixed top-[53px] inset-x-0 z-[80] mx-3 rounded-xl bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-[0_16px_32px_-8px_rgba(15,23,42,0.12),inset_0_0.5px_0_rgba(255,255,255,0.8)] overflow-hidden"
            role="navigation" aria-label="Mobile navigation">
            <div className="p-1.5">
              {NAV_LINKS.map((l, i) => (
                <motion.a key={l.href} href={l.href} onClick={onClose}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, type: "spring", stiffness: 400, damping: 34 }}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-lg text-xs font-bold tracking-wide text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 transition-all duration-200">
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  {l.label}
                </motion.a>
              ))}
              <div className="mt-0.5 p-1.5 pt-2 border-t border-slate-200/50">
                <a href="https://github.com/roshhellwett?tab=repositories" target="_blank" rel="noreferrer" onClick={onClose}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all duration-200 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06)]">
                  <Github size={13} /> All Repos <ArrowUpRight size={11} />
                </a>
              </div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════
   ── MAIN PAGE ──
   ══════════════════════════════════════════ */
export default function Page() {
  const [featured, setFeatured] = useState<Repo>(FEATURED_FALLBACK);
  const [stats, setStats] = useState({ repos: 0, stars: 0, langs: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const h = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 768) setMobileNavOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && mobileNavOpen) setMobileNavOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [mobileNavOpen]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://api.github.com/users/roshhellwett/repos?per_page=100");
        if (!res.ok) throw new Error("rate limited");
        const data: { name: string; html_url: string; homepage: string | null; stargazers_count: number; language: string | null; fork: boolean }[] = await res.json();
        const sentinel = data.find((r) => r.name === FEATURED_FALLBACK.name);
        if (sentinel) setFeatured((f) => ({ ...f, link: sentinel.html_url, homepage: sentinel.homepage || f.homepage, stars: sentinel.stargazers_count, lang: sentinel.language || f.lang }));
        const own = data.filter((r) => !r.fork);
        setStats({ repos: own.length, stars: own.reduce((s, r) => s + (r.stargazers_count || 0), 0), langs: new Set(own.map((r) => r.language).filter(Boolean)).size });
      } catch { setStats({ repos: 18, stars: 38, langs: 8 }); } finally { setIsLoaded(true); }
    })();
  }, []);

  const ORG_STATS = useMemo(() => [
    { label: "Repos", value: stats.repos || 18, icon: <FolderGit2 size={12} /> },
    { label: "Stars", value: stats.stars || 38, icon: <Star size={12} /> },
    { label: "Languages", value: stats.langs || 8, icon: <Code2 size={12} /> },
    { label: "Mission", value: "Bharat", icon: <Flag size={12} />, isText: true },
  ], [stats]);

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-slate-900 selection:text-white relative flex flex-col">
      <a href="#main" className="skip-link">Skip to content</a>
      <StructuredData />
      <Background />
      <div className="hidden sm:block"><DashField /></div>

      {/* Progress bar */}
      <motion.div style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[1.5px] origin-left z-[49] bg-gradient-to-r from-orange-500 via-slate-300 to-emerald-600 will-change-transform" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-lg backdrop-saturate-150 bg-white/65 border-b border-slate-200/30 shadow-[inset_0_-0.5px_0_rgba(15,23,42,0.03)]">
        <div className="mobile-container py-2 flex items-center justify-between gap-2">
          <a href="#top" className="flex min-w-0 items-center gap-2 group">
            <BrandMark size={30} rounded="rounded-lg" />
            <div className="flex min-w-0 flex-col leading-none">
              <span className="text-xs font-black tracking-tight text-slate-900">ZENITH</span>
              <span className="truncate text-[7px] font-bold tracking-[0.18em] uppercase text-slate-400">Open Source Projects</span>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}
                className="px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-500 hover:text-slate-900 rounded-md transition-all duration-200 hover:bg-slate-50/60">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <a href="https://github.com/roshhellwett?tab=repositories" target="_blank" rel="noreferrer"
              className="touch-target shrink-0 hidden sm:inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold hover:bg-slate-800 transition-all duration-200 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06)]">
              <Github size={11} /><span className="hidden sm:inline">Repos</span><ArrowUpRight size={10} />
            </a>
            <button type="button" onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden touch-target inline-flex items-center justify-center p-1.5 rounded-lg bg-white/80 border border-slate-200/50 text-slate-600 hover:bg-slate-50 transition-all duration-200 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8)]"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"} aria-expanded={mobileNavOpen}>
              <AnimatePresence mode="wait" initial={false}>
                {mobileNavOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }}><X size={15} /></motion.span>
                ) : (
                  <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.12 }}><Menu size={15} /></motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <main id="main" className="relative z-10 w-full flex-grow">
        <span id="top" />

        {/* ═══ HERO ═══ */}
        <section className="relative mobile-container pt-10 sm:pt-14 md:pt-20 pb-8 sm:pb-10 md:pb-14">
          <motion.div variants={stagger} initial="hidden" animate="show" className="relative text-center max-w-3xl mx-auto">
            <motion.div variants={fadeUp} className="flex justify-center mb-4">
              <Pill>
                <span className="relative flex h-1 w-1">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 live-dot-pulse" />
                  <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500" />
                </span>
                Open source · Building from India
              </Pill>
            </motion.div>

            <motion.h1 variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[0.88] text-slate-900">
              Zenith
              <span className="block shimmer-text mt-1 tracking-[-0.03em]">Open Source.</span>
            </motion.h1>

            <motion.p variants={fadeUp}
              className="mt-4 md:mt-6 text-sm md:text-[15px] text-slate-500 leading-relaxed max-w-lg mx-auto">
              Premium, transparent open source projects —
              Telegram bots, civic-tech, Linux audio, OS utilities, and AI
              tooling — for developers, students, and the nation.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-5 md:mt-6 flex flex-wrap justify-center gap-2">
              <a href="#featured"
                className="touch-target inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06),0_2px_8px_-3px_rgba(15,23,42,0.2)]">
                <Sparkles size={12} /> Featured Project <ArrowRight size={11} />
              </a>
              <a href="https://roshhellwett.github.io/zenithpages/" target="_blank" rel="noreferrer"
                className="touch-target inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/90 border border-slate-200/50 text-slate-700 font-bold text-xs hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_2px_-1px_rgba(15,23,42,0.06)]">
                <Layers size={12} /> Zenith Registry <ArrowUpRight size={11} />
              </a>
              <a href="https://github.com/roshhellwett?tab=repositories" target="_blank" rel="noreferrer"
                className="touch-target inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/90 border border-slate-200/50 text-slate-700 font-bold text-xs hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_2px_-1px_rgba(15,23,42,0.06)]">
                <Github size={12} /> GitHub <ArrowUpRight size={11} />
              </a>
            </motion.div>
          </motion.div>

          {/* Stat cards */}
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            className="mt-8 md:mt-10 grid grid-cols-4 gap-2 md:gap-3 max-w-2xl mx-auto">
            {ORG_STATS.map((s, i) => (
              <motion.div key={s.label} variants={fadeUp} transition={{ ...springT, delay: i * 0.05 }}
                className="grain relative rounded-xl bg-white/70 border border-slate-200/50 ring-1 ring-slate-100/80 p-2.5 md:p-3 overflow-hidden shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_3px_-1px_rgba(15,23,42,0.04)] hover:shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_4px_12px_-6px_rgba(15,23,42,0.06)] transition-shadow duration-400 text-center">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 to-transparent" />
                <div className="relative flex justify-center text-slate-400 mb-1">{s.icon}</div>
                <div className="relative text-xl md:text-2xl font-black tracking-tight text-slate-900 leading-none">
                  {s.isText ? s.value : (
                    <><AnimatedCounter target={s.value as number} isLoaded={isLoaded} /><span className="text-slate-300 text-xs ml-0.5">+</span></>
                  )}
                </div>
                <div className="relative text-[7px] font-bold tracking-[0.12em] uppercase text-slate-400 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }}
            className="hidden md:flex flex-col items-center gap-1 mt-8">
            <span className="text-[7px] font-bold tracking-[0.3em] uppercase text-slate-400/60">Scroll</span>
            <div className="scroll-indicator text-slate-300"><ChevronDown size={12} /></div>
          </motion.div>
        </section>



        {/* ═══ MISSION ═══ */}
        <section id="mission" className="mobile-container py-8 sm:py-10 md:py-14">
          <SectionHeading
            eyebrow="Our Mission"
            title="Open source, by India — for the world."
            subtitle="Every project under Zenith is built with one rule: be useful, be transparent, be free."
          />

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
            className="grid lg:grid-cols-[0.9fr_1fr] gap-5 lg:gap-8 items-start">
            {/* Lifecycle */}
            <motion.div variants={fadeUp}
              className="grain relative rounded-2xl border border-slate-200/50 ring-1 ring-slate-100/80 bg-white/70 backdrop-blur-lg backdrop-saturate-150 p-3 sm:p-4 overflow-hidden shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_3px_-1px_rgba(15,23,42,0.04)]">
              <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-100/25 blur-[60px]" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-emerald-100/25 blur-[60px]" />
              <div className="relative flex items-center gap-1.5 mb-2">
                <span className="p-1 rounded-md bg-white/80 border border-slate-200/50 text-slate-400 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8)]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                </span>
                <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-slate-400">How we operate</span>
              </div>
              <LifecycleLoop />
              <p className="relative mt-2 text-center text-[8px] font-bold tracking-[0.12em] uppercase text-slate-400">
                Build · Ship · Open · Iterate — forever
              </p>
            </motion.div>

            {/* Value cards */}
            <motion.div variants={staggerSlow} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid sm:grid-cols-2 gap-2.5">
              {[
                { icon: <Eye size={14} />, title: "Transparent by default", desc: "MIT licensed, public history, public issues. No black boxes." },
                { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>, title: "Built for scale", desc: "From single-file scripts to multi-tenant SaaS — production-minded." },
                { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>, title: "Civic-first", desc: "Projects for students, voters, listeners, and developers." },
                { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title: "Continuously shipped", desc: "Weekly commits, live demos, real users — not vanity repos." },
              ].map((c) => (
                <motion.div key={c.title} variants={fadeUp}
                  className="grain relative rounded-xl border border-slate-200/50 ring-1 ring-slate-100/80 bg-white/70 backdrop-blur-lg p-3.5 overflow-hidden group hover:bg-white/85 transition-all duration-300 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_3px_-1px_rgba(15,23,42,0.04)] hover:shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_4px_12px_-6px_rgba(15,23,42,0.06)] hover:-translate-y-px">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
                  <div className="relative inline-flex p-2 rounded-lg bg-white/80 text-slate-500 border border-slate-200/50 mb-2.5 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:scale-105">
                    {c.icon}
                  </div>
                  <h4 className="relative text-xs font-bold text-slate-900 tracking-tight">{c.title}</h4>
                  <p className="relative mt-1 text-[11px] text-slate-500 leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>



        {/* ═══ FEATURED ═══ */}
        <section id="featured" className="mobile-container py-8 sm:py-10 md:py-14">
          <SectionHeading
            eyebrow="Featured Initiative"
            title="Project Sentinel"
            subtitle="AI-powered, source-verified news aggregator — built for India, built in the open."
          />
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
            <FeaturedProject repo={featured} />
          </motion.div>
        </section>



        {/* ═══ STACK ═══ */}
        <section id="stack" className="mobile-container py-8 sm:py-10 md:py-14">
          <SectionHeading
            eyebrow="Capability"
            title="Technology Spectrum"
            subtitle="What we build with — not a buzzword cloud."
          />
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {STACK.map((g, i) => (
              <motion.div key={g.category} variants={fadeUp} transition={{ ...springT, delay: i * 0.05 }}
                className="grain relative rounded-xl border border-slate-200/50 ring-1 ring-slate-100/80 bg-white/70 backdrop-blur-lg p-4 overflow-hidden shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_3px_-1px_rgba(15,23,42,0.04)] hover:shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_4px_12px_-6px_rgba(15,23,42,0.06)] hover:-translate-y-px transition-all duration-300">
                <div className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[40px] bg-slate-200/40" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/50 to-transparent" />
                <div className="relative flex flex-col h-full">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/80 border border-slate-200/50 text-slate-600 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8)] w-fit">
                    {g.icon}
                    <span className="text-[8px] font-bold tracking-[0.15em] uppercase">{g.category}</span>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">{g.concept}</p>
                  <div className="mt-auto pt-3 flex flex-wrap gap-1">
                    {g.items.map((item) => (
                      <span key={item}
                        className="px-2 py-0.5 rounded-md bg-white/80 border border-slate-200/40 text-[8px] font-bold text-slate-500 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8)] hover:bg-white transition-colors duration-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>



        {/* ═══ FOUNDER ═══ */}
        <section id="founder" className="mobile-container py-8 sm:py-10 md:py-14">
          <SectionHeading
            eyebrow="Behind Zenith"
            title="The Founder"
            subtitle="Independently maintained. Here's the human behind the commits."
          />
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <Panel className="p-3 sm:p-4 md:p-6 rounded-2xl">
                <CommitHeatmap />
                <div className="mt-5 grid lg:grid-cols-[1.1fr_1fr] gap-5 lg:gap-8 items-start">
                  <div className="flex flex-col">
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Roshan Kr Singh</h3>
                    <div className="mt-1 text-[9px] font-bold tracking-[0.18em] uppercase text-slate-400">@roshhellwett · Founder</div>
                    <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                      Independent developer, Google Dev member, and open source maintainer based in India.
                      I build systems I wish existed — for students, for democracy, for the open web.
                    </p>
                    <blockquote className="mt-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/40 text-slate-500 text-xs italic leading-relaxed shadow-[inset_0_0.5px_0_rgba(255,255,255,0.6)]">
                      &ldquo;Open Source is the first step of development.&rdquo;
                    </blockquote>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <a href="https://g.dev/roshhellwett" target="_blank" rel="noreferrer"
                        className="group flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-slate-200/50 hover:bg-slate-50/80 hover:-translate-y-px transition-all duration-300 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_3px_-1px_rgba(15,23,42,0.04)] hover:shadow-[0_3px_10px_-4px_rgba(15,23,42,0.08)]">
                        <span className="p-1.5 rounded-md bg-white/80 text-slate-500 border border-slate-200/50"><Globe size={11} /></span>
                        <span className="text-[10px] font-bold text-slate-700">Google Dev</span>
                        <ArrowUpRight size={10} className="ml-auto text-slate-400 group-hover:text-slate-700 transition-colors" />
                      </a>
                      <a href="https://github.com/roshhellwett" target="_blank" rel="noreferrer"
                        className="group flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-slate-200/50 hover:bg-slate-50/80 hover:-translate-y-px transition-all duration-300 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_3px_-1px_rgba(15,23,42,0.04)] hover:shadow-[0_3px_10px_-4px_rgba(15,23,42,0.08)]">
                        <span className="p-1.5 rounded-md bg-slate-900 text-white border border-slate-800"><Github size={11} /></span>
                        <span className="text-[10px] font-bold text-slate-700">GitHub</span>
                        <ArrowUpRight size={10} className="ml-auto text-slate-400 group-hover:text-slate-700 transition-colors" />
                      </a>
                    </div>

                    <div className="pt-3 border-t border-slate-200/30">
                      <div className="text-[8px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-2">Vertices</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {SOCIALS.map((s) => (
                          <a key={s.label} href={s.link} target="_blank" rel="noreferrer" aria-label={s.label}
                            className="group flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/80 border border-slate-200/40 hover:bg-slate-50/80 hover:-translate-y-px transition-all duration-300 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8)]">
                            <span className="text-slate-400">{s.icon}</span>
                            <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-900 truncate transition-colors duration-200">{s.label}</span>
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



        {/* ═══ BHARAT CTA ═══ */}
        <section className="mobile-container py-8 sm:py-10 md:py-14">
          <motion.div initial={{ opacity: 0, y: 20, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.3 }} transition={springT}
            className="grain relative overflow-hidden rounded-2xl border border-slate-200/50 ring-1 ring-slate-100/80 bg-gradient-to-br from-orange-50/60 via-white/70 to-emerald-50/60 backdrop-blur-lg p-5 sm:p-7 md:p-10 text-center shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8),0_1px_3px_-1px_rgba(15,23,42,0.04)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/40 to-transparent" />
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-amber-100/30 blur-[80px]" />
            <BharatWave />
            <div className="relative flex justify-center mb-4">
              <Pill><Flag size={8} /> Bharat First</Pill>
            </div>
            <h3 className="relative font-black tracking-tight text-slate-900 mx-auto leading-tight"
              style={{ fontSize: "clamp(1rem, 3.5vw, 2.5rem)" }}>
              Code as contribution. Code as{" "}
              <span className="bg-gradient-to-r from-orange-500 via-slate-700 to-emerald-600 bg-clip-text text-transparent">citizenship.</span>
            </h3>
            <p className="relative mt-3 text-xs md:text-sm text-slate-500/90 max-w-md mx-auto leading-relaxed">
              Every commit under Zenith is a contribution toward a
              transparent, self-reliant digital India — open standards, open code, open opportunity.
            </p>
            <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, ...springT }}
              className="relative mt-5 flex flex-wrap justify-center gap-2">
              <a href="https://roshhellwett.github.io/zenithpages/" target="_blank" rel="noreferrer"
                className="touch-target inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06),0_2px_8px_-3px_rgba(15,23,42,0.2)]">
                <Layers size={12} /> Explore All Tools <ArrowUpRight size={11} />
              </a>
              <a href="https://github.com/roshhellwett?tab=repositories" target="_blank" rel="noreferrer"
                className="touch-target inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/90 border border-slate-200/50 text-slate-700 font-bold text-xs hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8)]">
                <Github size={12} /> View on GitHub <ArrowUpRight size={11} />
              </a>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-200/30 mt-4 bg-white/50 backdrop-blur-lg">
        <div className="mobile-container py-6 sm:py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-6 md:gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <BrandMark size={28} rounded="rounded-lg" />
                <div>
                  <div className="text-[10px] font-black tracking-tight text-slate-900">Zenith Open Source</div>
                  <div className="text-[7px] font-bold tracking-[0.15em] uppercase text-slate-400">by Roshan Kr Singh</div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs">
                Premium, transparent open source — for developers, students, and the nation.
              </p>
            </div>
            <div>
              <div className="text-[7px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">Navigate</div>
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <a key={l.href} href={l.href} className="text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors duration-200 py-0.5 w-fit">{l.label}</a>
                ))}
                <a href="https://roshhellwett.github.io/zenithpages/" target="_blank" rel="noreferrer"
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors duration-200 py-0.5 w-fit flex items-center gap-0.5">
                  Tools Registry <ArrowUpRight size={8} />
                </a>
              </div>
            </div>
            <div>
              <div className="text-[7px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">Community</div>
              <div className="flex flex-col gap-1">
                {SOCIALS.slice(0, 4).map((s) => (
                  <a key={s.label} href={s.link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors py-0.5 w-fit">{s.label}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[7px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">More</div>
              <div className="flex flex-col gap-1">
                {SOCIALS.slice(4).map((s) => (
                  <a key={s.label} href={s.link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors py-0.5 w-fit">{s.label}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200/30 flex flex-wrap items-center gap-1">
            {SOCIALS.slice(0, 6).map((s) => (
              <a key={s.label} href={s.link} target="_blank" rel="noreferrer" aria-label={s.label}
                className="p-2 rounded-md bg-white/80 border border-slate-200/40 hover:bg-slate-50/80 text-slate-400 hover:-translate-y-px transition-all duration-200 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.8)]">
                {s.icon}
              </a>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200/30 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[7px] font-bold tracking-[0.12em] uppercase text-slate-400">&copy; {new Date().getFullYear()} Zenith Open Source · MIT</p>
            <p className="text-[7px] font-bold tracking-[0.12em] uppercase text-slate-400">Built with <span className="text-slate-500">Claude</span> & <span className="text-slate-500">Gemini</span></p>
            <p className="text-[7px] font-medium text-slate-400">Next.js · Tailwind · Framer Motion</p>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={scrollToTop} type="button" aria-label="Back to top"
            className="fixed bottom-4 right-4 z-50 p-2 rounded-xl bg-slate-900 text-white shadow-[0_4px_16px_-4px_rgba(15,23,42,0.25),inset_0_0.5px_0_rgba(255,255,255,0.06)] hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200">
            <ChevronUp size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
