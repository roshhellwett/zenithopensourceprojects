"use client";

/* =========================================================================
   1. IMPORTS
   ========================================================================= */
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Transition,
  type Variants
} from "framer-motion";

import {
  Github, Twitter, Gitlab, Terminal, 
  FolderGit2, CheckCircle2, ArrowRight, 
  GraduationCap, Globe, ExternalLink,
  Linkedin, Layers, Box, Cpu, Database,
  LayoutTemplate, Code2
} from "lucide-react";


/* =========================================================================
   2. TYPES & INTERFACES
   ========================================================================= */
interface Repo {
  name: string;        
  displayName: string; 
  link: string;
  desc: string;
  lang: string;
  gradient: string;
  iconColor: string;
}

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

interface RepoCardProps {
  repo: Repo;
  index: number;
}


/* =========================================================================
   3. STATIC DATA CONFIGURATION
   ========================================================================= */
const TARGET_REPOS = [
  "ZenithSupremeEdition",
  "PayNix",
  "WinActivation",
  "Grub",
  "easyeffects-pulsewire-presets",
  "Logichands"
];

const FALLBACK_REPOS: Repo[] = [
  { name: "ZenithSupremeEdition", displayName: "Zenith Supreme Edition", link: "https://github.com/roshhellwett/ZenithSupremeEdition", desc: "Open Source Telegram Bots", lang: "Python", gradient: "from-indigo-100 to-blue-50", iconColor: "text-indigo-500" },
  { name: "PayNix", displayName: "Pay Nix", link: "https://github.com/roshhellwett/PayNix", desc: "Secure transaction processing module.", lang: "JavaScript", gradient: "from-orange-100 to-amber-50", iconColor: "text-orange-500" },
  { name: "WinActivation", displayName: "Win Activation", link: "https://github.com/roshhellwett/WinActivation", desc: "Windows OS Activation utility scripts.", lang: "Batchfile", gradient: "from-sky-100 to-blue-50", iconColor: "text-sky-500" },
  { name: "Grub", displayName: "Grub", link: "https://github.com/roshhellwett/Grub", desc: "Custom GRUB bootloader themes and configs.", lang: "Shell", gradient: "from-purple-100 to-pink-50", iconColor: "text-purple-500" },
  { name: "easyeffects-pulsewire-presets", displayName: "Pulsewire Presets", link: "https://github.com/roshhellwett/easyeffects-pulsewire-presets", desc: "Audio processing signal chains.", lang: "Shell", gradient: "from-emerald-100 to-teal-50", iconColor: "text-emerald-500" },
  { name: "Logichands", displayName: "Logic Hands", link: "https://github.com/roshhellwett/Logichands", desc: "Digital logic gate simulation kernel.", lang: "C", gradient: "from-rose-100 to-orange-50", iconColor: "text-rose-500" }
];

const STACK = [
  { 
    category: "Systems & Logic Core", 
    icon: <Cpu size={16} />,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-100",
    concept: "Low-level memory management, OOP principles, and algorithmic thinking across paradigms.",
    items: ["C", "C++", "Python", "Java"] 
  },
  { 
    category: "Web & Interface Ecosystem", 
    icon: <LayoutTemplate size={16} />,
    color: "text-sky-600",
    bgColor: "bg-sky-50 border-sky-100",
    concept: "Component-based architecture, asynchronous state management, and responsive design patterns.",
    items: ["HTML5", "CSS3", "JavaScript", "React"] 
  },
  { 
    category: "Data Infrastructure & Ops", 
    icon: <Database size={16} />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-100",
    concept: "Relational vs NoSQL modeling, distributed version control flows, and system administration.",
    items: ["MySQL", "MongoDB", "Linux", "Git"] 
  }
];

const SOCIALS = [
  { label: "LinkedIn", icon: <Linkedin size={18} />, link: "https://www.linkedin.com/in/roshhellwett", color: "text-blue-600" },
  { label: "ORCID", icon: <GraduationCap size={18} />, link: "https://orcid.org/0009-0008-7213-6376", color: "text-lime-600" },
  { label: "Stack Overflow", icon: <Layers size={18} />, link: "https://stackoverflow.com/users/17301307/roshhellwett", color: "text-amber-500" },
  { label: "SourceForge", icon: <Box size={18} />, link: "https://sourceforge.net/u/roshhellwett/profile", color: "text-orange-600" },
  { label: "GitLab", icon: <Gitlab size={18} />, link: "https://gitlab.com/roshhellwett", color: "text-orange-500" },
  { label: "Twitter", icon: <Twitter size={18} />, link: "https://twitter.com/roshhellwett", color: "text-sky-500" }
];


/* =========================================================================
   4. ANIMATION CONFIGURATION
   ========================================================================= */
const spring: Transition = { type: "spring", stiffness: 100, damping: 20 };
const fadeUp: Variants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };


/* =========================================================================
   5. REUSABLE COMPONENTS
   ========================================================================= */

function Background() {
  const reduce = useReducedMotion();
  if (reduce) return <div className="fixed inset-0 -z-10 bg-[#F4F5F7]" />;

  return (
    <div className="fixed inset-0 -z-10 bg-[#F4F5F7] overflow-hidden">
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] blur-[100px] rounded-full bg-gradient-to-br from-orange-200/40 to-amber-100/40 will-change-transform transform-gpu"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] blur-[120px] rounded-full bg-gradient-to-tl from-emerald-200/30 to-teal-100/30 will-change-transform transform-gpu"
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] blur-[90px] rounded-full bg-gradient-to-b from-blue-200/30 to-indigo-100/30 will-change-transform transform-gpu"
      />
    </div>
  );
}

function Panel({ children, className = "", delay = 0 }: PanelProps) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ ...spring, delay }}
      className={`bg-white/70 backdrop-blur-xl border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

const SoftTrafficLights = () => (
  <div className="flex gap-2">
    <div className="w-3 h-3 rounded-full bg-rose-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] border border-rose-500/10" />
    <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] border border-amber-500/10" />
    <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6)] border border-emerald-500/10" />
  </div>
);

const TerminalTyping = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;
    const startTyping = () => {
      timeout = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(timeout);
        }
      }, 30);
    };
    const initialDelay = setTimeout(startTyping, delay);
    return () => { clearTimeout(initialDelay); clearInterval(timeout); };
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

function RepoCard({ repo, index }: RepoCardProps) {
  const [hover, setHover] = useState(false);

  if (!repo) return null;

  return (
    <motion.a
      href={repo.link || "#"}
      target="_blank"
      rel="noreferrer"
      variants={fadeUp}
      transition={{ ...spring, delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="block cursor-pointer h-full outline-none group"
    >
      <div className="relative h-full bg-white/60 hover:bg-white/90 backdrop-blur-lg border border-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col overflow-hidden">
        
        <div className="px-5 py-4 bg-white/40 border-b border-white flex items-center justify-between z-20 relative">
          <SoftTrafficLights />
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase truncate ml-3">{repo.name || "repo"}.sh</span>
          <div className="w-10 shrink-0" />
        </div>

        <motion.div 
          animate={{ opacity: hover ? 0 : 1, scale: hover ? 0.95 : 1 }}
          transition={{ duration: 0.2 }}
          className="p-5 md:p-6 flex-1 flex flex-col relative z-10"
        >
          <div className="flex gap-4 items-center mb-5">
            <div className={`p-3 md:p-3.5 rounded-2xl bg-gradient-to-br ${repo.gradient || "from-slate-100 to-slate-50"} ${repo.iconColor || "text-slate-500"} shadow-sm border border-white shrink-0`}>
              <FolderGit2 size={22} className="md:w-6 md:h-6" />
            </div>
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-slate-800 leading-tight">{repo.displayName || "Unknown"}</h3>
          </div>

          <p className="text-slate-500 mb-6 flex-1 font-medium leading-relaxed text-sm md:text-base">
            {repo.desc || "No description provided."}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="inline-block text-[10px] md:text-[11px] font-bold px-3 py-1.5 md:px-4 rounded-full bg-slate-100/80 text-slate-600 shadow-sm border border-white">
              {repo.lang || "Code"}
            </span>
            <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">
              <ExternalLink size={16} strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 top-[52px] z-30 bg-white/95 backdrop-blur-xl p-6 md:p-8 flex flex-col justify-center font-mono text-xs md:text-sm rounded-b-[2rem]"
            >
              <div className="space-y-4">
                <div className="text-slate-800 font-semibold flex items-center h-6 overflow-hidden">
                  <span className="text-indigo-600 font-black mr-2 md:mr-3 shrink-0">{">"}</span> 
                  <span className="truncate"><TerminalTyping text={`git clone ${repo.link}.git`} delay={0} /></span>
                </div>
                <div className="text-slate-400 font-medium h-6">
                  <span className="text-indigo-600 font-black mr-2 md:mr-3">{">"}</span> 
                  <TerminalTyping text="resolving dependencies..." delay={600} />
                </div>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} 
                  className="text-emerald-600 font-bold flex items-center gap-2 mt-2"
                >
                  <CheckCircle2 size={16} className="md:w-[18px] md:h-[18px]" /> build success
                </motion.div>
                <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2.5 md:w-3 h-4 md:h-5 bg-indigo-500 mt-2 rounded-sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.a>
  );
}


/* =========================================================================
   6. MAIN PAGE LAYOUT
   ========================================================================= */

export default function Page() {
  const [repos, setRepos] = useState<Repo[]>(FALLBACK_REPOS);

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const response = await fetch("https://api.github.com/users/roshhellwett/repos?per_page=100");
        if (!response.ok) throw new Error("GitHub API rate limit or error");
        const data = await response.json();
        
        const liveRepos = FALLBACK_REPOS.map(fallbackData => {
          const liveData = data.find((r: any) => r.name === fallbackData.name);
          
          if (liveData) {
            return {
              ...fallbackData,
              link: liveData.html_url,
              desc: liveData.description || fallbackData.desc,
              lang: liveData.language || fallbackData.lang,
            };
          }
          return fallbackData; 
        });

        setRepos(liveRepos as Repo[]);
      } catch (error) {
        console.error("Using fallback repo data:", error);
      }
    };
    fetchGithubData();
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-800 pb-16 selection:bg-indigo-100 selection:text-indigo-900 relative flex flex-col">
      <Background />

      {/* --- SITE HEADER --- */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/40 border-b border-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center">
          <div className="font-bold text-slate-700 tracking-wide bg-white shadow-sm border border-slate-100 px-4 py-1.5 rounded-xl text-sm md:text-base">
            Zenith Projects
          </div>
        </div>
      </header>

      {/* --- MAIN LAYOUT GRID --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 relative z-10 flex-grow w-full">
        <motion.div 
          variants={stagger} 
          initial="hidden" 
          animate="show"
          className="grid lg:grid-cols-[340px_1fr] gap-6 lg:gap-10 items-start relative"
        >

          {/* ==============================================================
              COLUMN 1: SIDEBAR
              ============================================================== */}
          <div className="flex flex-col space-y-6 lg:space-y-8 lg:sticky lg:top-28 h-fit">
            
            {/* WIDGET 1: Professional Profile Panel */}
            <Panel className="p-6 lg:p-8 space-y-6 lg:space-y-8">
              <div className="text-center md:text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 lg:mb-4 block">
                  Developer Details
                </span>
                
                {/* Tagline */}
                <div className="bg-slate-50/80 rounded-2xl p-4 lg:p-5 border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] mb-6 lg:mb-8">
                  <p className="text-slate-600 font-semibold text-sm leading-relaxed italic text-center md:text-left">
                    "Open Source is The First Step of Development."
                  </p>
                </div>
              </div>

              {/* Developer Links */}
              <div className="space-y-3 lg:space-y-4 text-sm font-semibold text-slate-600">
                <div className="flex gap-3 items-center p-2 rounded-xl hover:bg-white border border-transparent hover:border-white hover:shadow-sm transition-all">
                  <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Globe size={16}/></div> 
                  <a href="https://g.dev/roshhellwett" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">Google Dev Member</a>
                </div>
                <div className="flex gap-3 items-center p-2 rounded-xl hover:bg-white border border-transparent hover:border-white hover:shadow-sm transition-all">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg"><Github size={16}/></div> 
                  <a href="https://github.com/roshhellwett" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">Github Dev Member</a>
                </div>
              </div>

              {/* Vertices (Social Links) */}
              <div className="pt-5 lg:pt-6 border-t border-slate-200/50 space-y-1 lg:space-y-2">
                <h3 className="text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 lg:mb-4 px-2 text-center md:text-left">VERTICES</h3>
                {SOCIALS.map((s, i) => (
                  <a key={i} href={s.link} target="_blank" rel="noreferrer" aria-label={`Visit my ${s.label} profile`} className="flex gap-3 items-center p-2 rounded-xl hover:bg-white border border-transparent hover:border-white shadow-sm transition-all group">
                    <span className={`p-2 bg-slate-50 border border-slate-100 rounded-lg group-hover:bg-white transition-colors ${s.color}`}>
                      {s.icon}
                    </span>
                    <span className="font-bold text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                      {s.label}
                    </span>
                  </a>
                ))}
              </div>
            </Panel>

            {/* WIDGET 2: Contact Terminal (FIXED: Cleaned up the details array) */}
            <Panel className="flex flex-col !p-0" delay={0.1}>
              <div className="px-4 lg:px-5 py-3 lg:py-4 bg-white/40 border-b border-white flex items-center justify-between">
                <SoftTrafficLights />
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">contact.exe</span>
                <div className="w-10" />
              </div>
              
              <div className="p-6 lg:p-8 font-mono text-xs lg:text-sm text-slate-700">
                <div className="mb-6 lg:mb-8 font-medium text-slate-500">
                  <span className="text-indigo-500 font-black mr-2">{">"}</span> contact --init
                </div>

                {/* Clean, vertically stacked data without rigid labels */}
                <div className="bg-white/60 border border-white rounded-2xl lg:rounded-[2rem] p-5 lg:p-6 space-y-3 shadow-sm flex flex-col items-start">
                  <span className="text-rose-500 font-bold text-base md:text-lg tracking-tight">Roshan Kr Singh</span>
                  <span className="text-amber-500 font-bold text-sm md:text-base">@roshhellwett</span>
                  <a href="mailto:roshhellwett@icloud.com" className="text-emerald-500 hover:text-emerald-600 font-bold text-sm md:text-base hover:underline underline-offset-4 transition-all break-all pt-1">
                    roshhellwett@icloud.com
                  </a>
                </div>

                <div className="mt-8 lg:mt-10 flex items-center gap-2 font-bold text-slate-500 bg-white/40 p-3 lg:p-4 rounded-xl border border-white overflow-hidden">
                  <span className="text-indigo-500 truncate">roshhellwett@local</span><span className="text-slate-400 shrink-0">:~$</span>
                  <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 lg:w-2.5 h-4 lg:h-5 bg-indigo-500 rounded-sm shrink-0" />
                </div>
              </div>
            </Panel>

          </div>


          {/* ==============================================================
              COLUMN 2: MAIN CONTENT AREA (Repositories & Tech Stash)
              ============================================================== */}
          <div className="flex flex-col h-full">
            
            <section className="flex-1">
              <h2 className="text-xl lg:text-2xl font-black mb-6 flex gap-3 items-center text-slate-800 tracking-tight px-2">
                <div className="p-2 bg-white text-indigo-500 rounded-xl border border-white shadow-sm">
                  <Terminal size={18} className="lg:w-5 lg:h-5" />
                </div>
                Open Source Projects
              </h2>

              <motion.div variants={stagger} className="grid md:grid-cols-2 gap-6 items-stretch">
                {repos.map((repo, i) => (
                  <RepoCard repo={repo} index={i} key={i}/>
                ))}
              </motion.div>

              {/* View More Projects Button */}
              <motion.div variants={fadeUp} className="mt-8 mb-10 flex justify-center md:justify-end">
                <a 
                  href="https://github.com/roshhellwett?tab=repositories" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center w-full md:w-auto gap-2 px-6 py-3.5 bg-white/60 hover:bg-white text-slate-700 hover:text-indigo-600 font-bold text-sm rounded-2xl border border-white shadow-sm hover:shadow-md transition-all group"
                >
                  View more projects
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </section>

            {/* HORIZONTAL TECH STASH WIDGET (Conceptual & Professional) */}
            <Panel className="p-6 md:p-8 w-full mt-auto" delay={0.4}>
              <h3 className="text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Code2 size={14} /> TECHNOLOGY SPECTRUM & CONCEPTUAL UNDERSTANDING
              </h3>
              
              <div className="flex flex-col gap-4 lg:gap-6">
                {STACK.map((group, i) => (
                  <div key={i} className={`flex flex-col md:flex-row gap-4 p-4 lg:p-5 rounded-2xl border ${group.bgColor}`}>
                    
                    {/* Category Header & Icon */}
                    <div className="flex items-center gap-3 md:w-48 shrink-0">
                      <div className={`p-2 rounded-xl bg-white border border-white shadow-sm ${group.color}`}>
                        {group.icon}
                      </div>
                      <span className={`text-xs font-black tracking-wide uppercase ${group.color}`}>
                        {group.category}
                      </span>
                    </div>

                    {/* Conceptual Description & Pills */}
                    <div className="flex flex-col gap-3 flex-1">
                      <p className="text-xs lg:text-sm font-medium text-slate-600 leading-relaxed">
                        {group.concept}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map(item => (
                          <span 
                            key={item} 
                            className="px-2.5 py-1 bg-white/60 border border-white rounded-lg text-[10px] lg:text-[11px] font-bold text-slate-700 shadow-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

          </div>

        </motion.div>
      </main>

      {/* --- SITE FOOTER --- */}
      <footer className="max-w-7xl mx-auto px-4 md:px-6 py-8 mt-8 lg:mt-12 w-full text-center relative z-10">
        <div className="pt-8 border-t border-slate-300/40">
          <p className="text-[10px] lg:text-xs font-bold text-slate-500">
            © {new Date().getFullYear()} Zenith Open Source Projects. All rights reserved.
          </p>
          <p className="text-[9px] lg:text-[10px] font-medium text-slate-400 mt-2">
            Built with Next.js, Tailwind CSS, Framer Motion & Design By Claude & Gemini.
          </p>
        </div>
      </footer>
      
    </div>
  );
}