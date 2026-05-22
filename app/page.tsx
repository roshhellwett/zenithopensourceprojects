"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useScroll,
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
  Boxes,
  Layers,
  Globe,
  Eye,
} from "lucide-react";

import { BrandMark } from "@/components/BrandMark";
import { Background } from "@/components/Background";
import { DashField } from "@/components/DashField";
import { Pill } from "@/components/Pill";
import { Divider } from "@/components/Divider";
import { SectionHeading } from "@/components/SectionHeading";
import { Panel } from "@/components/Panel";
import { EcosystemDiagram } from "@/components/EcosystemDiagram";
import { LifecycleLoop } from "@/components/LifecycleLoop";
import { CommitHeatmap } from "@/components/CommitHeatmap";
import { BharatWave } from "@/components/BharatWave";
import { RepoCard } from "@/components/RepoCard";
import { FeaturedProject } from "@/components/FeaturedProject";
import { StructuredData } from "@/components/StructuredData";

import { FEATURED_FALLBACK, FALLBACK_REPOS } from "@/data/repos";
import { CATEGORIES } from "@/data/categories";
import { STACK } from "@/data/stack";
import { SOCIALS } from "@/data/socials";
import { NAV_LINKS } from "@/data/nav";
import { spring, fadeUp, stagger } from "@/lib/animations";
import type { Repo, CategoryId } from "@/types";

const springT: Transition = spring;

export default function Page() {
  const [featured, setFeatured] = useState<Repo>(FEATURED_FALLBACK);
  const [repos, setRepos] = useState<Repo[]>(FALLBACK_REPOS);
  const [stats, setStats] = useState({ repos: 0, stars: 0, langs: 0 });
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const response = await fetch("https://api.github.com/users/roshhellwett/repos?per_page=100");
        if (!response.ok) throw new Error("rate limited");
        const data: { name: string; html_url: string; homepage: string | null; stargazers_count: number; language: string | null; fork: boolean }[] = await response.json();

        const sentinel = data.find((r) => r.name === FEATURED_FALLBACK.name);
        if (sentinel) {
          setFeatured((f) => ({
            ...f,
            link: sentinel.html_url,
            homepage: sentinel.homepage || f.homepage,
            stars: sentinel.stargazers_count,
            lang: sentinel.language || f.lang,
          }));
        }

        const liveRepos = FALLBACK_REPOS.map((fb) => {
          const live = data.find((r) => r.name === fb.name);
          if (!live) return fb;
          return { ...fb, link: live.html_url, lang: live.language || fb.lang, stars: live.stargazers_count, homepage: live.homepage || fb.homepage };
        });
        setRepos(liveRepos);

        const own = data.filter((r) => !r.fork);
        const totalStars = own.reduce((s, r) => s + (r.stargazers_count || 0), 0);
        const langs = new Set(own.map((r) => r.language).filter((l) => Boolean(l)));
        setStats({ repos: own.length, stars: totalStars, langs: langs.size });
      } catch {
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
      { label: "Public Repos", value: stats.repos || 18, icon: <FolderGit2 size={16} /> },
      { label: "Community Stars", value: stats.stars || 38, icon: <Star size={16} /> },
      { label: "Languages", value: stats.langs || 8, icon: <Code2 size={16} /> },
      { label: "Mission", value: "Bharat", icon: <Flag size={16} /> },
    ],
    [stats]
  );

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-slate-900 selection:text-white relative flex flex-col">
      <a href="#main" className="skip-link">Skip to content</a>
      <StructuredData />
      <Background />
      <div className="hidden sm:block">
        <DashField />
      </div>

      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] bg-gradient-to-r from-orange-500 via-slate-300 to-emerald-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
      />

      <header className="sticky top-0 z-50 backdrop-blur-lg backdrop-saturate-150 bg-white/65 border-b border-slate-200/40 shadow-[inset_0_-0.5px_0_rgba(15,23,42,0.04)]">
        <div className="mobile-container py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <a href="#top" className="flex min-w-0 items-center gap-2.5 sm:gap-3 group">
            <BrandMark size={36} rounded="rounded-xl" />
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="text-sm md:text-[15px] font-black tracking-tight text-slate-900">ZENITH</span>
              <span className="truncate text-[8px] sm:text-[9px] font-bold tracking-[0.16em] sm:tracking-[0.2em] uppercase text-slate-500">Open Source Projects</span>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}
                className="px-3 py-1.5 text-xs font-bold tracking-wide text-slate-500 hover:text-slate-900 rounded-lg transition-all duration-200 hover:shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2">
                {l.label}
              </a>
            ))}
          </nav>
          <a href="https://github.com/roshhellwett?tab=repositories" target="_blank" rel="noreferrer"
            className="touch-target shrink-0 inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-orange-400 focus-visible:outline-offset-2">
            <Github size={14} />
            <span className="hidden sm:inline">All Repos</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </header>

      <main id="main" className="relative z-10 w-full flex-grow">
        <span id="top" />

        <section className="relative mobile-container pt-14 sm:pt-20 md:pt-28 pb-12 sm:pb-16 md:pb-24">
          <motion.div variants={stagger} initial="hidden" animate="show" className="relative text-center max-w-4xl mx-auto">
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-4 mb-6">
              <Pill>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]" />
                </span>
                Open source · Building from India
              </Pill>
            </motion.div>

            <motion.h1 variants={fadeUp}
              className="text-[2.7rem] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight sm:tracking-[-0.04em] leading-[0.9] sm:leading-[0.85] text-slate-900">
              Zenith
              <span className="block text-slate-400/80 mt-1 font-black tracking-[-0.02em]">Open Source.</span>
            </motion.h1>

            <motion.p variants={fadeUp}
              className="mt-5 md:mt-8 text-[15px] md:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
              A collective of premium, transparent open source projects —
              Telegram bots, civic-tech, Linux audio, OS utilities, and AI
              tooling — engineered to give back to developers, students, and the nation.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-6 md:mt-8 grid w-full grid-cols-1 sm:flex sm:flex-wrap justify-center gap-3">
              <a href="#featured"
                className="touch-target inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-orange-400 focus-visible:outline-offset-2">
                <Sparkles size={16} /> Featured Project <ArrowRight size={14} />
              </a>
              <a href="#projects"
                className="touch-target inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/90 border border-slate-200/50 text-slate-700 font-bold text-sm hover:bg-white transition-all duration-200 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2">
                <FolderGit2 size={16} /> Explore Projects
              </a>
              <a href="https://github.com/roshhellwett?tab=repositories" target="_blank" rel="noreferrer"
                className="touch-target inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/90 border border-slate-200/50 text-slate-700 font-bold text-sm hover:bg-white transition-all duration-200 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2">
                <Github size={16} /> GitHub <ArrowUpRight size={14} />
              </a>
            </motion.div>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            className="mt-10 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {ORG_STATS.map((s, i) => (
              <motion.div key={s.label} variants={fadeUp} transition={{ ...springT, delay: i * 0.05 }}
                className="grain relative rounded-2xl bg-white/65 backdrop-blur-lg backdrop-saturate-150 border border-white/50 ring-1 ring-slate-200/30 p-3.5 md:p-5 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 to-transparent" />
                <div className="relative flex items-center gap-2 text-slate-400 text-[9px] font-bold tracking-[0.15em] uppercase">
                  {s.icon} {s.label}
                </div>
                <div className="relative mt-2 text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                  {s.value}
                  {typeof s.value === "number" && (
                    <span className="text-slate-400 text-lg ml-0.5 align-super text-[0.5em]">+</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <Divider />

        <section id="mission" className="mobile-container py-12 sm:py-16 md:py-24">
          <SectionHeading
            eyebrow="Our Mission"
            title="Open source, by India — for the world."
            subtitle="Every project under Zenith is built with one rule: be useful, be transparent, be free."
          />

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-center">
            <motion.div variants={fadeUp}
              className="grain relative rounded-2xl sm:rounded-3xl border border-white/50 ring-1 ring-slate-200/30 bg-white/65 backdrop-blur-lg backdrop-saturate-150 p-4 sm:p-6 md:p-8 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
              <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-100/30 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-emerald-100/30 blur-[80px]" />
              <div className="relative flex items-center gap-2 mb-4">
                <span className="p-1.5 rounded-lg bg-white/80 border border-slate-200/60 text-slate-500 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                </span>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400">How we operate</span>
              </div>
              <LifecycleLoop />
              <p className="relative mt-4 text-center text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
                Build · Ship · Open · Iterate — forever
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <Eye size={18} />, title: "Transparent by default", desc: "MIT licensed, public history, public issues. No black boxes." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>, title: "Built for scale", desc: "From single-file scripts to multi-tenant SaaS — production-minded." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>, title: "Civic-first", desc: "Projects that lift students, voters, listeners, and developers." },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title: "Continuously shipped", desc: "Weekly commits, live demos, and real users — not vanity repos." },
              ].map((c) => (
                <div key={c.title}
                  className="grain relative rounded-2xl border border-white/50 ring-1 ring-slate-200/30 bg-white/65 backdrop-blur-lg backdrop-saturate-150 p-4 overflow-hidden group hover:bg-white/80 transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(15,23,42,0.08)]">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
                  <div className="relative inline-flex p-2 rounded-xl bg-white/80 text-slate-500 border border-slate-200/60 mb-3 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] transition-all duration-200 group-hover:shadow-[inset_0_2px_4px_-1px_rgba(15,23,42,0.08)]">
                    {c.icon}
                  </div>
                  <h4 className="relative text-sm font-bold text-slate-900 tracking-tight">{c.title}</h4>
                  <p className="relative mt-1.5 text-sm text-slate-500 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <Divider />

        <section id="featured" className="mobile-container py-12 sm:py-16 md:py-24">
          <SectionHeading
            eyebrow="Featured Initiative"
            title="Project Sentinel — AI-powered Indian newsroom."
            subtitle="Project Sentinel — a fully automated, source-verified news aggregator for India."
          />
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <FeaturedProject repo={featured} />
          </motion.div>
        </section>

        <Divider />

        <section id="projects" className="mobile-container py-12 sm:py-16 md:py-24">
          <SectionHeading
            eyebrow="The Archive"
            title="All Projects"
            subtitle="Every open source project under Zenith — categorized by purpose, filtered on demand."
          />

          <EcosystemDiagram active={activeCategory} onSelect={setActiveCategory} countsByCategory={countsByCategory} />

          <div className="mt-6 sm:mt-8 mb-6 flex flex-nowrap sm:flex-wrap items-center gap-2 overflow-x-auto pb-2 sm:overflow-visible sm:pb-0 [-webkit-overflow-scrolling:touch]">
            {CATEGORIES.map((c) => {
              const isActive = activeCategory === c.id;
              const count = c.id === "all" ? repos.length : countsByCategory[c.id] || 0;
              if (c.id !== "all" && count === 0) return null;
              return (
                <motion.button key={c.id} type="button" onClick={() => setActiveCategory(c.id)} whileTap={{ scale: 0.97 }}
                  className={`touch-target group shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-bold tracking-wide border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2 ${
                    isActive
                      ? "bg-slate-900 border-slate-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.2)]"
                      : "bg-white/80 border-slate-200/60 text-slate-500 hover:bg-slate-50/80 hover:shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)]"
                  }`}>
                  <span className={isActive ? "text-white" : "text-slate-500"}>{c.icon}</span>
                  <span>{c.label}</span>
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                    isActive ? "bg-white/15 text-white" : "bg-white/80 text-slate-500 shadow-[inset_0_1px_1px_-1px_rgba(15,23,42,0.04)]"
                  }`}>{count}</span>
                </motion.button>
              );
            })}
          </div>

          <LayoutGroup>
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredRepos.map((r, i) => (
                  <motion.div key={r.name} layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ ...springT, delay: i * 0.04 }}>
                    <RepoCard repo={r} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {filteredRepos.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grain text-center py-16 px-6 rounded-3xl border border-white/50 ring-1 ring-slate-200/30 bg-white/65 backdrop-blur-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
              <Boxes size={26} className="mx-auto text-slate-400 mb-3" strokeWidth={1.5} />
              <p className="text-sm font-bold text-slate-500">No projects in this category yet.</p>
              <p className="mt-1 text-xs text-slate-400">
                More are shipping soon — switch back to{" "}
                <button className="font-bold text-slate-900 underline underline-offset-4 transition-colors duration-200 hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2 rounded"
                  onClick={() => setActiveCategory("all")}>All projects</button>.
              </p>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-8 grid grid-cols-1 sm:flex sm:flex-wrap justify-center gap-3">
            <a href="https://github.com/roshhellwett?tab=repositories" target="_blank" rel="noreferrer"
              className="touch-target inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-orange-400 focus-visible:outline-offset-2">
              <Github size={16} /> View all on GitHub <ArrowUpRight size={14} />
            </a>
            <a href="https://roshhellwett.github.io/zenithpages/" target="_blank" rel="noreferrer"
              className="touch-target inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/90 border border-slate-200/60 text-slate-700 font-bold text-sm hover:bg-white transition-all duration-200 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2">
              <Layers size={16} /> Zenith Tools Registry <ArrowUpRight size={14} />
            </a>
          </motion.div>
        </section>

        <Divider />

        <section id="stack" className="mobile-container py-12 sm:py-16 md:py-24">
          <SectionHeading
            eyebrow="Capability"
            title="Technology Spectrum"
            subtitle="What we build with, and how we think about it conceptually — not a buzzword cloud."
          />

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}
            className="grid lg:grid-cols-3 gap-5">
            {STACK.map((g, i) => (
              <motion.div key={g.category} variants={fadeUp} transition={{ ...springT, delay: i * 0.05 }}
                className="grain relative rounded-2xl sm:rounded-3xl border border-white/50 ring-1 ring-slate-200/30 bg-white/65 backdrop-blur-lg backdrop-saturate-150 p-5 sm:p-6 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[60px] bg-slate-200/50" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 to-transparent" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200/60 text-slate-700 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)]">
                    {g.icon}
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase">{g.category}</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-500 leading-relaxed">{g.concept}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {g.items.map((item) => (
                      <span key={item}
                        className="px-2.5 py-1 rounded-lg bg-white/80 border border-slate-200/50 text-[10px] font-bold text-slate-500 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)]">
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

        <section id="founder" className="mobile-container py-12 sm:py-16 md:py-24">
          <SectionHeading
            eyebrow="Behind Zenith"
            title="The Founder"
            subtitle="Zenith is independently maintained. Here's the human behind the commits."
          />

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <Panel className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl">
                <CommitHeatmap />

                <div className="mt-8 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 items-start">
                  <div className="flex flex-col">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Roshan Kr Singh</h3>
                    <div className="mt-1 text-sm font-bold tracking-[0.2em] uppercase text-slate-500">@roshhellwett · Founder</div>

                    <p className="mt-5 text-sm md:text-base text-slate-500 leading-relaxed">
                      Independent developer, Google Dev member, and open source maintainer based in India.
                      I build systems I wish existed — for students, for democracy, for the open web.
                      Zenith is my promise to keep them free.
                    </p>

                    <blockquote className="mt-5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-slate-500 text-sm italic leading-relaxed">
                      &ldquo;Open Source is the first step of development.&rdquo;
                    </blockquote>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a href="https://g.dev/roshhellwett" target="_blank" rel="noreferrer"
                        className="group flex items-center gap-3 p-3 rounded-2xl bg-white/80 border border-slate-200/60 hover:bg-slate-50/80 hover:border-slate-300/60 transition-all duration-200 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2">
                        <span className="p-2 rounded-lg bg-white/80 text-slate-500 border border-slate-200/60"><Globe size={14} /></span>
                        <span className="text-sm font-bold text-slate-700">Google Dev</span>
                        <ArrowUpRight size={14} className="ml-auto text-slate-400 group-hover:text-slate-700 transition-colors duration-200" />
                      </a>
                      <a href="https://github.com/roshhellwett" target="_blank" rel="noreferrer"
                        className="group flex items-center gap-3 p-3 rounded-2xl bg-white/80 border border-slate-200/60 hover:bg-slate-50/80 hover:border-slate-300/60 transition-all duration-200 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2">
                        <span className="p-2 rounded-lg bg-slate-900 text-white border border-slate-900"><Github size={14} /></span>
                        <span className="text-sm font-bold text-slate-700">GitHub</span>
                        <ArrowUpRight size={14} className="ml-auto text-slate-400 group-hover:text-slate-700" />
                      </a>
                    </div>

                    <div className="pt-5 border-t border-slate-200/40">
                      <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mb-4">Vertices</div>
                      <div className="grid grid-cols-2 gap-2">
                        {SOCIALS.map((s) => (
                          <a key={s.label} href={s.link} target="_blank" rel="noreferrer" aria-label={s.label}
                            className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-slate-200/60 hover:bg-slate-50/80 hover:border-slate-300/60 transition-all duration-200 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2">
                            <span className="text-slate-500">{s.icon}</span>
                            <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 truncate transition-colors duration-200">{s.label}</span>
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

        <section className="mobile-container py-12 sm:py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={springT}
            className="grain relative overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/50 ring-1 ring-slate-200/30 bg-gradient-to-br from-orange-50/80 via-white/65 to-emerald-50/80 backdrop-blur-lg backdrop-saturate-150 p-5 sm:p-8 md:p-12 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <div className="absolute inset-x-0 top-0 h-px bg-slate-200/50" />
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-amber-100/40 blur-[120px]" />
            <BharatWave />
            <div className="relative flex justify-center">
              <Pill><Flag size={11} /> Bharat First</Pill>
            </div>
            <div className="h-px bg-slate-200/50" />
            <h3 className="relative font-black tracking-tight text-slate-900 mx-auto leading-tight"
              style={{ fontSize: "clamp(1rem, 4.2vw, 3rem)" }}>
              Code as contribution. Code as{" "}
              <span className="bg-gradient-to-r from-orange-500 via-slate-700 to-emerald-600 bg-clip-text text-transparent">citizenship.</span>
            </h3>
            <p className="relative mt-5 text-sm md:text-base text-slate-500/90 max-w-xl mx-auto leading-relaxed">
              Every commit pushed under Zenith is a small contribution toward a
              more transparent, self-reliant digital India — open standards, open code, open opportunity.
            </p>
          </motion.div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200/40 mt-6 bg-white/50 backdrop-blur-lg backdrop-saturate-150">
        <div className="mobile-container py-7 sm:py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <BrandMark size={34} rounded="rounded-xl" />
              <div>
                <div className="text-sm font-black tracking-tight text-slate-900">Zenith Open Source Projects</div>
                <div className="text-[9px] font-bold tracking-[0.15em] uppercase text-slate-400">
                  &copy; {new Date().getFullYear()} &middot; Roshan Kr Singh &middot; MIT
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {SOCIALS.slice(0, 6).map((s) => (
                <a key={s.label} href={s.link} target="_blank" rel="noreferrer" aria-label={s.label}
                  className="p-2 rounded-lg bg-white/80 border border-slate-200/50 hover:bg-slate-50/80 text-slate-500 transition-all duration-200 shadow-[inset_0_1px_2px_-1px_rgba(15,23,42,0.04)] hover:shadow-[inset_0_2px_3px_-1px_rgba(15,23,42,0.08)] focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-slate-200/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-slate-400">
              Built with <span className="text-slate-500">Claude</span> <span className="text-slate-300">&amp;</span> <span className="text-slate-500">Gemini</span>
            </p>
            <p className="text-[9px] font-bold tracking-[0.15em] uppercase text-slate-400">
              Design by{" "}
              <a href="https://github.com/roshhellwett" target="_blank" rel="noreferrer"
                className="text-slate-700 hover:text-slate-900 transition-colors duration-200 underline decoration-slate-300/50 underline-offset-4 focus-visible:outline-2 focus-visible:outline-orange-600 focus-visible:outline-offset-2 rounded">
                Roshhellwett
              </a>
            </p>
            <p className="text-[9px] font-medium text-slate-400">Next.js &middot; Tailwind &middot; Framer Motion</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
