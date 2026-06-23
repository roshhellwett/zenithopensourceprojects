"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { 
  Github, 
  FolderGit2, 
  Star, 
  Code2, 
  Globe, 
  Layers, 
  ArrowUpRight, 
  Zap, 
  ChevronUp, 
  Flag, 
  Boxes,
  Menu,
  X
} from "lucide-react";

import { BrandMark } from "@/components/BrandMark";
import { Background } from "@/components/Background";
import { CommitHeatmap } from "@/components/CommitHeatmap";
import { FeaturedProject } from "@/components/FeaturedProject";
import { SectionHeading } from "@/components/SectionHeading";
import { Divider } from "@/components/Divider";
import { BharatWave } from "@/components/BharatWave";
import { Pill } from "@/components/Pill";
import { Panel } from "@/components/Panel";
import { RepoCard } from "@/components/RepoCard";

import { STACK } from "@/data/stack";
import { SOCIALS } from "@/data/socials";
import { FALLBACK_REPOS, FEATURED_FALLBACK } from "@/data/repos";
import { CATEGORIES } from "@/data/categories";
import { useMouseSpotlight } from "@/lib/useMouseSpotlight";
import type { Repo } from "@/types";

function AnimatedCounter({ target, isLoaded }: { target: number; isLoaded: boolean }) {
  const [display, setDisplay] = useState(target);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
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
      const next = Math.round(eased * target);
      setDisplay(next);
      if (!startedRef.current && next > 0) {
        startedRef.current = true;
        setStarted(true);
      }
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, isLoaded, target]);

  return <span ref={ref}>{started ? display : target}</span>;
}

function AnimatedBentoTile({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, x, y, isHovered, bind } = useMouseSpotlight();
  return (
    <motion.div
      ref={ref}
      {...bind}
      initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 90, damping: 22, delay, mass: 0.8 }}
      className={`group relative overflow-hidden rounded-[2rem] liquid-glass p-8 shadow-2xl ${className}`}
    >
      <div className="liquid-glass-shine" />
      <div className="liquid-glass-sheen" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent-1/5 via-transparent to-accent-3/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      {isHovered && (
        <>
          <div 
            className="pointer-events-none absolute inset-0 transition-opacity duration-500 opacity-100"
            style={{
              background: `radial-gradient(280px circle at ${x}px ${y}px, rgba(56,189,248,0.06), transparent 85%)`,
            }}
          />
          <div 
            className="absolute inset-0 pointer-events-none z-10 border border-transparent rounded-[2rem] transition-all duration-350"
            style={{
              borderColor: "transparent",
              backgroundImage: `radial-gradient(240px circle at ${x}px ${y}px, rgba(56,189,248,0.22), transparent 70%)`,
              WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              maskComposite: "exclude",
            }}
          />
        </>
      )}
      <div className="relative z-20">{children}</div>
    </motion.div>
  );
}

function CategoryTab({ cat, isActive, onClick }: { cat: any; isActive: boolean; onClick: () => void }) {
  const { ref, x, y, isHovered, bind } = useMouseSpotlight();
  return (
    <button
      ref={ref}
      onClick={onClick}
      {...bind}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 select-none whitespace-nowrap cursor-pointer ${
        isActive 
          ? "text-slate-950 font-bold" 
          : "text-white/40 hover:text-white/80 bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1]"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeCategoryBackground"
          className="absolute inset-0 bg-white rounded-full z-0"
          transition={{ type: "spring", stiffness: 380, damping: 35 }}
        />
      )}
      {!isActive && isHovered && (
        <div className="absolute inset-0 rounded-full pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(80px circle at ${x}px ${y}px, rgba(255,255,255,0.08), transparent 80%)`,
            }}
          />
        </div>
      )}
      <span className={`relative z-10 ${isActive ? "text-slate-950" : "text-white/50"}`}>{cat.icon}</span>
      <span className="relative z-10">{cat.label}</span>
    </button>
  );
}

export default function Page() {
  const [stats, setStats] = useState({ repos: 0, stars: 0, langs: 0 });
  const [reposList, setReposList] = useState<Repo[]>(() => [FEATURED_FALLBACK, ...FALLBACK_REPOS]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const navSpotlight = useMouseSpotlight();

  const filteredRepos = useMemo(() => {
    const matched = activeCategory === "all"
      ? reposList
      : reposList.filter((repo) => repo.category === activeCategory);
    return matched.slice(0, 3);
  }, [reposList, activeCategory]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://api.github.com/users/roshhellwett/repos?per_page=100");
        if (!res.ok) throw new Error("rate limited");
        const data: { name: string; stargazers_count: number; language: string | null; fork: boolean }[] = await res.json();
        const own = data.filter((r) => !r.fork);
        
        const allLocal = [FEATURED_FALLBACK, ...FALLBACK_REPOS];
        const updatedRepos = allLocal.map((fallback) => {
          const apiMatch = own.find((r) => r.name.toLowerCase() === fallback.name.toLowerCase());
          return {
            ...fallback,
            stars: apiMatch ? apiMatch.stargazers_count : fallback.stars ?? 0,
          };
        });
        setReposList(updatedRepos);

        setStats({ 
          repos: own.length, 
          stars: own.reduce((s, r) => s + (r.stargazers_count || 0), 0), 
          langs: new Set(own.map((r) => r.language).filter(Boolean)).size 
        });
      } catch { 
        setStats({ repos: 22, stars: 45, langs: 4 }); 
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const scrollToTop = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  return (
    <div className="min-h-screen font-sans text-slate-100 selection:bg-accent-1 selection:text-slate-950 relative overflow-hidden" ref={containerRef}>
      <Background />
      
      <motion.nav 
        ref={navSpotlight.ref}
        {...navSpotlight.bind}
        layout
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col overflow-hidden liquid-glass shadow-[0_8px_32px_rgba(0,0,0,0.6)] ${
          isMobileMenuOpen 
            ? "w-[calc(100vw-2rem)] max-w-[360px] p-4 rounded-[2rem]" 
            : "w-[auto] p-1.5 rounded-full"
        }`}
      >
        <div className="liquid-glass-shine" />
        <div className="liquid-glass-sheen" />
        
        {navSpotlight.isHovered && (
          <>
            <div 
              className="pointer-events-none absolute inset-0 transition-opacity duration-500 opacity-100"
              style={{
                background: `radial-gradient(120px circle at ${navSpotlight.x}px ${navSpotlight.y}px, rgba(56,189,248,0.08), transparent 80%)`,
              }}
            />
            <div 
              className="absolute inset-0 pointer-events-none z-10 border border-transparent transition-all duration-350"
              style={{
                borderRadius: isMobileMenuOpen ? "2rem" : "9999px",
                borderColor: "transparent",
                backgroundImage: `radial-gradient(100px circle at ${navSpotlight.x}px ${navSpotlight.y}px, rgba(56,189,248,0.25), transparent 70%)`,
                WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                maskComposite: "exclude",
              }}
            />
          </>
        )}

        <div className="flex items-center justify-between w-full gap-2 relative z-20">
          <div className="flex items-center gap-1.5">
            <a href="#top" className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center border border-white/[0.08] hover:border-white/[0.15] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              <BrandMark size={16} rounded="rounded-full" />
            </a>
            {isMobileMenuOpen && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] font-black tracking-wider uppercase text-white/80 pl-1"
              >
                Zenith
              </motion.span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-0.5">
            <div className="h-4 w-[1px] bg-white/[0.08] mx-1" />
            <a href="#mission" className="px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/50 hover:text-white/90 transition-colors">Mission</a>
            <a href="#telemetry" className="px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/50 hover:text-white/90 transition-colors">Telemetry</a>
            <a href="#projects" className="px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/50 hover:text-white/90 transition-colors">Projects</a>
            <a href="#stack" className="px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/50 hover:text-white/90 transition-colors">Stack</a>
            <a href="#founder" className="px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/50 hover:text-white/90 transition-colors">Founder</a>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="hidden sm:flex items-center gap-1">
              <div className="h-4 w-[1px] bg-white/[0.08] mx-1" />
              <a href="https://github.com/roshhellwett" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold text-white/60 hover:text-white hover:bg-white/[0.06] transition-all">
                <Github size={12} /> <span>Profile</span>
              </a>
              <a href="https://roshhellwett.github.io/zenithpages/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-semibold bg-white text-slate-950 hover:bg-white/90 transition-all shadow-[0_0_24px_rgba(255,255,255,0.15)] ml-0.5">
                <Layers size={11} /> <span>Registry</span>
              </a>
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center border border-white/[0.08] hover:bg-white/[0.10] text-white/70 hover:text-white transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="sm:hidden flex flex-col gap-2 mt-4 pt-4 border-t border-white/[0.06] w-full relative z-20"
            >
              <a 
                href="#mission" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.04] text-xs font-semibold text-white/60 hover:text-white transition-all"
              >
                <span>Mission</span>
                <ArrowUpRight size={12} className="text-white/20" />
              </a>
              <a 
                href="#telemetry" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.04] text-xs font-semibold text-white/60 hover:text-white transition-all"
              >
                <span>Telemetry</span>
                <ArrowUpRight size={12} className="text-white/20" />
              </a>
              <a 
                href="#projects" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.04] text-xs font-semibold text-white/60 hover:text-white transition-all"
              >
                <span>Projects</span>
                <ArrowUpRight size={12} className="text-white/20" />
              </a>
              <a 
                href="#stack" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.04] text-xs font-semibold text-white/60 hover:text-white transition-all"
              >
                <span>Stack</span>
                <ArrowUpRight size={12} className="text-white/20" />
              </a>
              <a 
                href="#founder" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.04] text-xs font-semibold text-white/60 hover:text-white transition-all"
              >
                <span>Founder</span>
                <ArrowUpRight size={12} className="text-white/20" />
              </a>

              <div className="h-px bg-white/[0.06] my-2" />

              <div className="grid grid-cols-2 gap-2">
                <a href="https://github.com/roshhellwett" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-bold border border-white/[0.08] bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] transition-all">
                  <Github size={12} /> Profile
                </a>
                <a href="https://roshhellwett.github.io/zenithpages/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-bold bg-white text-slate-950 hover:bg-white/90 transition-all shadow-[0_0_24px_rgba(255,255,255,0.15)]">
                  <Layers size={11} /> Registry
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <motion.div 
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[1px] origin-left z-[49] bg-gradient-to-r from-accent-1 via-white/60 to-accent-3 will-change-transform" 
      />

      <main className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 pt-36 pb-24 lg:pt-48" id="top">
        
        <motion.div style={{ y: yParallax }} className="mb-20 lg:mb-32 flex flex-col items-center text-center">
          <h1 
            className="flex flex-col items-center text-center select-none mb-8"
            aria-label="Zenith open source"
          >
            <span className="flex justify-center">
              <span className="text-8xl sm:text-9xl md:text-[10rem] lg:text-[13rem] font-sacramento font-normal leading-[1.2] glass-tube-hero">
                Zenith
              </span>
            </span>
            <span className="flex justify-center -mt-3 lg:-mt-6">
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-dancing font-normal leading-[1.2] glass-tube-hero">
                open source
              </span>
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl font-dancing font-normal max-w-2xl leading-relaxed tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/75">
            A systems collective and project forge building open-specification developer utilities, automation pipelines, and civic diagnostics. Crafted in India, optimized for standard performance, and free forever.
          </p>
        </motion.div>

        <section id="mission" className="mb-20 scroll-mt-28">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
            
            <AnimatedBentoTile className="md:col-span-2 flex flex-col justify-center bg-gradient-to-br from-slate-950/80 to-slate-900/60 overflow-hidden" delay={0.05}>
              <div className="absolute -top-24 -right-24 text-slate-800/10 rotate-12 transition-transform duration-1000 group-hover:rotate-0 pointer-events-none">
                <Globe size={320} strokeWidth={0.5} />
              </div>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-center w-full">
                <div className="max-w-xl">
                  <div className="mb-3 text-[9px] font-semibold tracking-[0.25em] text-accent-1 uppercase">Core Thesis</div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-[-0.02em] leading-tight mb-4">
                    Code as <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-1 via-accent-2 to-accent-3">Citizenship.</span>
                  </h2>
                  <p className="text-sm sm:text-base text-white/50 leading-relaxed font-medium">
                    Every pipeline, tool, and utility built under Zenith is open‑source by design. We develop highly transparent architectures for public service, academic networks, and systems auditing.
                  </p>
                </div>
                <div className="w-full h-[200px] bg-[#02040a] rounded-xl border border-slate-900 overflow-hidden shadow-2xl">
                  <FeaturedProject />
                </div>
              </div>
            </AnimatedBentoTile>

            <AnimatedBentoTile className="md:col-span-1 flex flex-col justify-between p-8 bg-slate-950/40" delay={0.1}>
              <div className="text-[9px] font-semibold tracking-[0.22em] text-white/30 uppercase pb-4 border-b border-white/[0.06]">Telemetry Statistics</div>
              <div className="space-y-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-semibold tracking-wider text-white/40 uppercase flex items-center gap-2">
                    <FolderGit2 size={13} className="text-accent-1" /> Active Repos
                  </div>
                  <div className="text-4xl font-black text-white tracking-tight">
                    <AnimatedCounter target={stats.repos || 22} isLoaded={isLoaded} />
                    <span className="text-accent-1 text-base ml-1">+</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-semibold tracking-wider text-white/40 uppercase flex items-center gap-2">
                    <Star size={13} className="text-amber-400" /> Global Stars
                  </div>
                  <div className="text-4xl font-black text-white tracking-tight">
                    <AnimatedCounter target={stats.stars || 45} isLoaded={isLoaded} />
                    <span className="text-amber-400 text-base ml-1">+</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-semibold tracking-wider text-white/40 uppercase flex items-center gap-2">
                    <Code2 size={13} className="text-accent-3" /> Core Languages
                  </div>
                  <div className="text-4xl font-black text-white tracking-tight">
                    <AnimatedCounter target={stats.langs || 4} isLoaded={isLoaded} />
                  </div>
                </div>
              </div>
            </AnimatedBentoTile>

            <AnimatedBentoTile className="md:col-span-3 flex flex-col justify-end overflow-hidden p-8 bg-gradient-to-br from-slate-950/70 to-[#0c0d12]/90" delay={0.15}>
              <BharatWave />
              <div className="relative z-10">
                <div className="mb-4">
                  <Pill><Flag size={10} className="mr-1 text-orange-400" /> Bharat First</Pill>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-3">
                  Engineering self-reliance through open code.
                </h3>
                <p className="text-xs sm:text-sm text-white/45 leading-relaxed max-w-2xl">
                  Zenith stands for open specifications and verified digital infrastructure. By sharing code pipelines, systems scripts, and civic prototypes, we build blocks that empower Indian developers, students, and system administrators.
                </p>
              </div>
            </AnimatedBentoTile>

          </div>
        </section>

        <Divider />

        <section id="telemetry" className="py-12 scroll-mt-28">
          <SectionHeading 
            eyebrow="Telemetry Logs"
            title="Systems Telemetry & Build Cadence"
            subtitle="Visualizing our deployment pipeline activity logs and live compilation processes."
          />

          <div className="w-full">
            <AnimatedBentoTile className="w-full flex flex-col justify-between p-8" delay={0.05}>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-[-0.01em] flex items-center gap-2">
                    <Boxes size={16} className="text-accent-1" /> Engineering Cadence
                  </h3>
                  <p className="text-[10px] text-white/30 mt-0.5">Heatmap mapping commit distribution history</p>
                </div>
                <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-accent-1"><Zap size={14} /></div>
              </div>
              <div className="flex-grow flex flex-col justify-center">
                <CommitHeatmap />
              </div>
            </AnimatedBentoTile>
          </div>
        </section>

        <Divider />

        <section id="projects" className="py-12 scroll-mt-28">
          <SectionHeading 
            eyebrow="Open Source Registry"
            title="Featured Repositories"
            subtitle="A curated selection of our primary open-source systems, automation pipelines, and utilities."
          />

          <div className="space-y-8">
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none gap-2 justify-start md:justify-center items-center">
              {CATEGORIES.map((cat) => (
                <CategoryTab
                  key={cat.id}
                  cat={cat}
                  isActive={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                />
              ))}
            </div>

            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredRepos.map((repo, idx) => (
                  <motion.div
                    layout
                    key={repo.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <RepoCard repo={repo} index={idx} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <div className="flex justify-center mt-10">
              <a 
                href="https://roshhellwett.github.io/zenithpages/" 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-bold shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                Explore More Registry Projects
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </section>

        <Divider />

        <section id="stack" className="py-12 scroll-mt-28">
          <SectionHeading 
            eyebrow="Capability Hub"
            title="Technology Spectrum"
            subtitle="The core languages, runtimes, development frameworks, and database engines behind our builds."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STACK.map((group, idx) => (
              <AnimatedBentoTile key={group.category} className="flex flex-col justify-between p-6 bg-slate-950/60" delay={idx * 0.05}>
                <div className="relative flex flex-col h-full">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/60 w-fit mb-4">
                    <span className="text-accent-1">{group.icon}</span>
                    <span className="text-[9px] font-semibold tracking-[0.15em] uppercase">{group.category}</span>
                  </div>
                  
                  <p className="text-xs text-white/45 leading-relaxed mb-6 font-medium">
                    {group.concept}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-white/[0.05] flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span 
                        key={item}
                        className="px-2.5 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-[9px] font-semibold text-white/40 hover:text-white hover:border-white/[0.12] hover:bg-white/[0.06] transition-colors duration-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedBentoTile>
            ))}
          </div>
        </section>

        <Divider />

        <section id="founder" className="py-12 scroll-mt-28">
          <SectionHeading 
            eyebrow="Core Developer"
            title="Behind Zenith"
            subtitle="Designed, built, and maintained independently. Here is the human writing the commits."
          />

          <Panel className="p-6 sm:p-8 md:p-10 rounded-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
              
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-1 via-accent-2 to-accent-3 flex items-center justify-center border border-slate-700 shadow-inner">
                    <BrandMark size={32} rounded="rounded-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Roshan Kr Singh</h3>
                    <div className="mt-0.5 text-[9px] font-bold tracking-[0.2em] uppercase text-accent-1">@roshhellwett · Founder</div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-white/50 leading-relaxed font-medium mb-6">
                  Independent developer, systems engineer, and Google Dev member based in India. I develop micro-utilities, civic projects, and bot systems designed to optimize academic and local workloads in real time.
                </p>

                <blockquote className="p-4 rounded-2xl liquid-glass text-white/50 text-xs sm:text-sm italic leading-relaxed">
                  &ldquo;Open Source is the first step of development. Build public tools, verified lines, and transparent frameworks to empower the next generation.&rdquo;
                </blockquote>
              </div>

              <div className="flex flex-col gap-5 lg:pl-6 lg:border-l border-white/[0.06]">
                <div className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/30">Developer Vertices</div>
                
                <div className="grid grid-cols-2 gap-3">
                  <a href="https://g.dev/roshhellwett" target="_blank" rel="noreferrer"
                    className="group flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:-translate-y-0.5 hover:border-white/[0.12] transition-all duration-300">
                    <span className="p-1.5 rounded-lg bg-white/[0.04] text-white/40 group-hover:text-accent-1 border border-white/[0.06]"><Globe size={12} /></span>
                    <span className="text-[10px] font-semibold text-white/60 group-hover:text-white">Google Dev</span>
                    <ArrowUpRight size={10} className="ml-auto text-white/25 group-hover:text-white transition-colors" />
                  </a>
                  <a href="https://github.com/roshhellwett" target="_blank" rel="noreferrer"
                    className="group flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:-translate-y-0.5 hover:border-white/[0.12] transition-all duration-300">
                    <span className="p-1.5 rounded-lg bg-white/[0.04] text-white/40 group-hover:text-white border border-white/[0.06]"><Github size={12} /></span>
                    <span className="text-[10px] font-semibold text-white/60 group-hover:text-white">GitHub</span>
                    <ArrowUpRight size={10} className="ml-auto text-white/25 group-hover:text-white transition-colors" />
                  </a>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="text-[8px] font-semibold tracking-[0.2em] uppercase text-white/25 mb-3">Other Profiles</div>
                  <div className="grid grid-cols-2 gap-2">
                    {SOCIALS.slice(0, 6).map((s) => (
                      <a key={s.label} href={s.link} target="_blank" rel="noreferrer" aria-label={s.label}
                        className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.10] hover:-translate-y-px transition-all duration-300">
                        <span className="text-white/30 group-hover:text-white transition-colors">{s.icon}</span>
                        <span className="text-[10px] font-semibold text-white/40 group-hover:text-white/80 truncate transition-colors duration-200">{s.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </Panel>
        </section>

      </main>

      <footer className="relative z-10 border-t border-white/[0.06] bg-[#030712]/80 backdrop-blur-xl mt-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 md:gap-4">
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <BrandMark size={28} rounded="rounded-lg" />
                <div>
                  <div className="text-xs font-black tracking-tight text-white">Zenith Open Source</div>
                  <div className="text-[8px] font-semibold tracking-[0.2em] uppercase text-white/30">by Roshan Kr Singh</div>
                </div>
              </div>
              <p className="text-xs text-white/40 leading-relaxed max-w-xs">
                Designing transparent software, low‑level systems interfaces, and automation infrastructure. Designed in India.
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                {SOCIALS.slice(0, 6).map((s) => (
                  <a key={s.label} href={s.link} target="_blank" rel="noreferrer" aria-label={s.label}
                    className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] text-white/35 hover:text-white hover:-translate-y-px transition-all duration-200">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/25 mb-3.5">Navigation</div>
              <div className="flex flex-col gap-2">
                <a href="#mission" className="text-xs font-semibold text-white/40 hover:text-white transition-colors duration-200 w-fit">Mission</a>
                <a href="#telemetry" className="text-xs font-semibold text-white/40 hover:text-white transition-colors duration-200 w-fit">Telemetry</a>
                <a href="#projects" className="text-xs font-semibold text-white/40 hover:text-white transition-colors duration-200 w-fit">Projects</a>
                <a href="#stack" className="text-xs font-semibold text-white/40 hover:text-white transition-colors duration-200 w-fit">Tech Stack</a>
                <a href="#founder" className="text-xs font-semibold text-white/40 hover:text-white transition-colors duration-200 w-fit">Founder bio</a>
              </div>
            </div>

            <div>
              <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/25 mb-3.5">Community</div>
              <div className="flex flex-col gap-2">
                {SOCIALS.slice(0, 4).map((s) => (
                  <a key={s.label} href={s.link} target="_blank" rel="noreferrer" className="text-xs font-semibold text-white/40 hover:text-white transition-colors duration-200 w-fit">{s.label}</a>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/25 mb-3.5">Other Hubs</div>
              <div className="flex flex-col gap-2">
                {SOCIALS.slice(4).map((s) => (
                  <a key={s.label} href={s.link} target="_blank" rel="noreferrer" className="text-xs font-semibold text-white/40 hover:text-white transition-colors duration-200 w-fit">{s.label}</a>
                ))}
                <a href="https://roshhellwett.github.io/zenithpages/" target="_blank" rel="noreferrer"
                  className="text-xs font-semibold text-accent-1 hover:text-white transition-colors duration-200 w-fit flex items-center gap-0.5">
                  Registry Pages <ArrowUpRight size={10} />
                </a>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-white/25">&copy; {new Date().getFullYear()} Zenith Open Source · MIT License</p>
            <p className="text-[9px] font-medium text-white/30 flex items-center gap-1">
              Next.js · Tailwind · Framer Motion · Lucide
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={scrollToTop} 
            type="button" 
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-50 p-3 rounded-2xl bg-slate-900 text-white shadow-[0_4px_24px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] border border-slate-800 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <ChevronUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
