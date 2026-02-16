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
  Github, Twitter, Instagram, Mail, Gitlab, 
  Terminal, Code2, Cpu, Database, Globe, 
  FolderGit2, CheckCircle2, User, MapPin, 
  Link2, Star, GitFork, Activity, Clock, 
  FileText, Rocket, BookOpen, GitCommit
} from "lucide-react";


/* =========================================================================
   2. TYPES & INTERFACES
   ========================================================================= */
interface Repo {
  name: string;
  link: string;
  desc: string;
  lang: string;
  stars?: number;
  forks?: number;
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
// Now contains ALL 9 repositories
const TARGET_REPOS = [
  "ZenithSupremeEdition",
  "PayNix",
  "Egnima",
  "Logichands",
  "Numsuko",
  "easyeffects-pulsewire-presets",
  "WinActivation",
  "Grub",
  "MovieFix"
];

const FALLBACK_REPOS: Repo[] = [
  { name: "ZenithSupremeEdition", link: "https://github.com/roshhellwett/ZenithSupremeEdition.git", desc: "Open Source Telegram Bots", lang: "Python", stars: 0, forks: 0, gradient: "from-indigo-100 to-blue-50", iconColor: "text-indigo-500" },
  { name: "PayNix", link: "https://github.com/roshhellwett/PayNix", desc: "Secure transaction processing module.", lang: "JavaScript", stars: 0, forks: 0, gradient: "from-orange-100 to-amber-50", iconColor: "text-orange-500" },
  { name: "Egnima", link: "https://github.com/roshhellwett/Egnima", desc: "Advanced encryption/decryption algorithm.", lang: "C++", stars: 0, forks: 0, gradient: "from-emerald-100 to-teal-50", iconColor: "text-emerald-500" },
  { name: "Logichands", link: "https://github.com/roshhellwett/Logichands", desc: "Digital logic gate simulation kernel.", lang: "C", stars: 0, forks: 0, gradient: "from-rose-100 to-pink-50", iconColor: "text-rose-500" },
  { name: "Numsuko", link: "https://github.com/roshhellwett/Numsuko", desc: "High-performance numerical analysis toolkit.", lang: "Java", stars: 0, forks: 0, gradient: "from-cyan-100 to-sky-50", iconColor: "text-cyan-600" },
  { name: "easyeffects-pulsewire-presets", link: "https://github.com/roshhellwett/easyeffects-pulsewire-presets", desc: "Audio processing signal chains.", lang: "Shell", stars: 0, forks: 0, gradient: "from-purple-100 to-fuchsia-50", iconColor: "text-purple-500" },
  { name: "WinActivation", link: "https://github.com/roshhellwett/WinActivation.git", desc: "Windows OS Activation utility scripts.", lang: "Batchfile", stars: 0, forks: 0, gradient: "from-sky-100 to-blue-50", iconColor: "text-sky-500" },
  { name: "Grub", link: "https://github.com/roshhellwett/Grub.git", desc: "Custom GRUB bootloader themes and configs.", lang: "Shell", stars: 0, forks: 0, gradient: "from-fuchsia-100 to-pink-50", iconColor: "text-fuchsia-500" },
  { name: "MovieFix", link: "https://github.com/roshhellwett/MovieFix.git", desc: "Movie metadata matching and renaming tool.", lang: "Python", stars: 0, forks: 0, gradient: "from-rose-100 to-orange-50", iconColor: "text-rose-500" }
];

const STACK = [
  { category: "Core Systems", icon: <Cpu size={18} />, items: ["C", "C++", "Python", "Java"], color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
  { category: "Web", icon: <Globe size={18} />, items: ["HTML5", "CSS3", "JavaScript", "React"], color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
  { category: "Data & Tools", icon: <Database size={18} />, items: ["MySQL", "MongoDB", "Linux", "Git"], color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" }
];

const SOCIALS = [
  { label: "GitHub", icon: <Github size={18} />, link: "https://github.com/roshhellwett", color: "text-slate-700" },
  { label: "Twitter", icon: <Twitter size={18} />, link: "https://twitter.com/roshhellwett", color: "text-sky-500" },
  { label: "Instagram", icon: <Instagram size={18} />, link: "https://instagram.com/roshhellwett", color: "text-pink-500" },
  { label: "GitLab", icon: <Gitlab size={18} />, link: "https://gitlab.com/roshhellwett", color: "text-orange-500" },
  { label: "Email", icon: <Mail size={18} />, link: "mailto:roshhellwett@icloud.com", color: "text-emerald-500" }
];

const COMMIT_PATTERN = [
  "bg-slate-200", "bg-emerald-300", "bg-emerald-200", "bg-slate-200", "bg-emerald-400", "bg-emerald-500", "bg-emerald-200",
  "bg-slate-200", "bg-slate-200", "bg-emerald-300", "bg-emerald-500", "bg-emerald-400", "bg-emerald-200", "bg-slate-200",
  "bg-emerald-200", "bg-emerald-400", "bg-emerald-300", "bg-emerald-500", "bg-emerald-500", "bg-emerald-300", "bg-emerald-200"
];


/* =========================================================================
   4. ANIMATION CONFIGURATION
   ========================================================================= */
const spring: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};


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
      className={`bg-white/70 backdrop-blur-xl border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden ${className}`}
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

  // Safety check to prevent crashes if a repo is undefined
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
      className="block cursor-pointer h-full outline-none"
    >
      <div className="relative h-full bg-white/60 hover:bg-white/90 backdrop-blur-lg border border-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col overflow-hidden">
        
        {/* Repo Header */}
        <div className="px-5 py-4 bg-white/40 border-b border-white flex items-center justify-between z-20 relative">
          <SoftTrafficLights />
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{repo.name || "repo"}.sh</span>
          <div className="w-10" />
        </div>

        {/* Repo Content */}
        <motion.div 
          animate={{ opacity: hover ? 0 : 1, scale: hover ? 0.95 : 1 }}
          transition={{ duration: 0.2 }}
          className="p-6 flex-1 flex flex-col relative z-10"
        >
          <div className="flex gap-4 items-center mb-5">
            <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${repo.gradient || "from-slate-100 to-slate-50"} ${repo.iconColor || "text-slate-500"} shadow-sm border border-white`}>
              <FolderGit2 size={24} />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-slate-800">{repo.name || "Unknown"}</h3>
          </div>

          <p className="text-slate-500 mb-6 flex-1 font-medium leading-relaxed">
            {repo.desc || "No description provided."}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="inline-block text-[11px] font-bold px-4 py-1.5 rounded-full bg-slate-100/80 text-slate-600 shadow-sm border border-white">
              {repo.lang || "Code"}
            </span>
            {(repo.stars !== undefined || repo.forks !== undefined) && (
              <div className="flex gap-3 text-slate-400 text-xs font-bold">
                <span className="flex items-center gap-1"><Star size={14}/> {repo.stars || 0}</span>
                <span className="flex items-center gap-1"><GitFork size={14}/> {repo.forks || 0}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Repo Hover State */}
        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 top-[52px] z-30 bg-white/95 backdrop-blur-xl p-8 flex flex-col justify-center font-mono text-sm rounded-b-[2rem]"
            >
              <div className="space-y-4">
                <div className="text-slate-800 font-semibold text-base flex items-center h-6">
                  <span className="text-indigo-600 font-black mr-3">{">"}</span> 
                  <TerminalTyping text={`git clone ${repo.name}`} delay={0} />
                </div>
                <div className="text-slate-400 font-medium h-6">
                  <span className="text-indigo-600 font-black mr-3">{">"}</span> 
                  <TerminalTyping text="resolving dependencies..." delay={600} />
                </div>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} 
                  className="text-emerald-600 font-bold flex items-center gap-2 text-base mt-2"
                >
                  <CheckCircle2 size={18} /> build success
                </motion.div>
                <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-3 h-5 bg-indigo-500 mt-2 rounded-sm" />
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
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const response = await fetch("https://api.github.com/users/roshhellwett/repos?per_page=100");
        if (!response.ok) throw new Error("GitHub API rate limit or error");
        const data = await response.json();
        
        const liveRepos = TARGET_REPOS.map(targetName => {
          const liveData = data.find((r: any) => r.name === targetName);
          const fallbackData = FALLBACK_REPOS.find(r => r.name === targetName);
          
          const safeFallback = fallbackData || { name: targetName, link: "#", desc: "", lang: "Code", gradient: "from-slate-100 to-slate-50", iconColor: "text-slate-500" };

          if (liveData) {
            return {
              ...safeFallback,
              name: liveData.name,
              link: liveData.html_url,
              desc: liveData.description || safeFallback.desc,
              lang: liveData.language || safeFallback.lang,
              stars: liveData.stargazers_count,
              forks: liveData.forks_count,
            };
          }
          return safeFallback as Repo; 
        }).filter(Boolean);

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
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <div className="font-bold text-slate-700 tracking-wide bg-white shadow-sm border border-slate-100 px-4 py-1.5 rounded-xl">
            Zenith Projects
          </div>
        </div>
      </header>

      {/* --- MAIN LAYOUT GRID --- */}
      <main className="max-w-7xl mx-auto px-6 pt-12 relative z-10 flex-grow w-full">
        <motion.div 
          variants={stagger} 
          initial="hidden" 
          animate="show"
          className="grid lg:grid-cols-[340px_1fr] gap-10 items-stretch h-full"
        >

          {/* ==============================================================
              COLUMN 1: SIDEBAR (Widgets)
              ============================================================== */}
          <div className="flex flex-col space-y-8 h-full">
            
            {/* WIDGET 1: Main Profile Panel */}
            <Panel className="p-8 space-y-8">
              <div className="text-center md:text-left">
                <h1 className="text-3xl xl:text-[32px] font-black tracking-tight text-slate-800 mb-2 whitespace-nowrap shrink-0">
                  ROSHAN ✭ 
                </h1>
                <p className="text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg inline-block">
                  @roshhellwett
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-5 border border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] mb-8 font-mono text-sm">
                <span className="text-indigo-500 font-bold">const</span> <span className="text-rose-500 font-semibold">focus</span> = <br/>
                <span className="text-emerald-600 font-medium">"Building systems that think."</span>;
              </div>

              <div className="space-y-4 text-sm font-semibold text-slate-600">
                <div className="flex gap-3 items-center p-2 rounded-xl hover:bg-white border border-transparent hover:border-white hover:shadow-sm transition-all">
                  <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg"><User size={16}/></div> 
                  INDEPENDENT DEVELOPER
                </div>
                <div className="flex gap-3 items-center p-2 rounded-xl hover:bg-white border border-transparent hover:border-white hover:shadow-sm transition-all">
                  <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><MapPin size={16}/></div> 
                  ASIA/INDIA
                </div>
                <div className="flex gap-3 items-center p-2 rounded-xl hover:bg-white border border-transparent hover:border-white hover:shadow-sm transition-all">
                  <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><Link2 size={16}/></div> 
                  <a href="https://g.dev/roshhellwett" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">DEVLOPER PROGRAM MEMBER</a>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200/50 space-y-2">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">SOCIAL NODES</h3>
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

            {/* WIDGET 2: System Status */}
            <Panel className="p-8" delay={0.1}>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2 px-2">
                <Activity size={14} /> SYSTEM STATUS
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/60 border border-white rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <span className="text-sm font-bold text-slate-600">NETWORK</span>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-emerald-600">ACTIVE</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/60 border border-white rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <span className="text-sm font-bold text-slate-600">LOCAL TIME</span>
                  <div className="flex items-center gap-2 text-indigo-600 font-mono text-xs font-bold">
                    <Clock size={14} />
                    <span>{time || "Loading..."}</span>
                  </div>
                </div>

                <a 
                  href="https://www.linkedin.com/in/roshhellwett" 
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(99,102,241,0.4)] transition-all active:scale-95"
                >
                  <FileText size={16} />
                  LINKEDIN
                </a>
              </div>
            </Panel>

            {/* WIDGET 3: Logic Synthesizer */}
            <Panel className="p-8" delay={0.2}>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2 px-2">
                <Cpu size={14} /> LOGIC SYNTHESIZER
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-white/60 border border-white rounded-xl shadow-sm hover:shadow-md transition-all">
                  <span className="text-xs font-bold text-slate-700">GATE SIMULATION</span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-amber-100 border border-amber-200 text-amber-600 rounded-md shadow-sm">XOR / NAND</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-white/60 border border-white rounded-xl shadow-sm hover:shadow-md transition-all">
                  <span className="text-xs font-bold text-slate-700">K-MAP OPTIMIZATIONS</span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-md shadow-sm">Active</span>
                </div>
                <div className="flex items-center justify-between p-3.5 bg-white/60 border border-white rounded-xl shadow-sm hover:shadow-md transition-all">
                  <span className="text-xs font-bold text-slate-700">GRAPH ALGORITHMS</span>
                  <span className="text-[10px] font-bold px-2 py-1 bg-indigo-100 border border-indigo-200 text-indigo-600 rounded-md shadow-sm">O(V+E)</span>
                </div>
              </div>
            </Panel>

            {/* WIDGET 4: Activity Matrix */}
            <Panel className="p-8 flex-1 flex flex-col justify-center" delay={0.3}>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2 px-2">
                <GitCommit size={14} /> Activity Matrix
              </h3>
              <div className="bg-white/60 border border-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center">
                 <div className="flex items-center justify-between w-full mb-3">
                   <span className="text-xs font-bold text-slate-800">Recent Commits</span>
                   <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                 </div>
                 <div className="grid grid-cols-7 gap-1.5 w-full">
                    {COMMIT_PATTERN.map((color, i) => (
                      <div key={i} className={`aspect-square rounded-[4px] ${color} shadow-inner hover:scale-110 transition-transform cursor-pointer`}></div>
                    ))}
                 </div>
                 <div className="flex justify-between w-full mt-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                   <span>Less</span>
                   <span>More</span>
                 </div>
              </div>
            </Panel>

          </div>


          {/* ==============================================================
              COLUMN 2: MAIN CONTENT AREA (Repos & Terminals)
              ============================================================== */}
          <div className="flex flex-col space-y-10 h-full">
            
            {/* SECTION: Pinned Repositories */}
            <section>
              <h2 className="text-2xl font-black mb-6 flex gap-3 items-center text-slate-800 tracking-tight px-2">
                <div className="p-2 bg-white text-indigo-500 rounded-xl border border-white shadow-sm">
                  <Terminal size={20}/>
                </div>
                Open Source Projects
              </h2>

              <motion.div variants={stagger} className="grid md:grid-cols-2 gap-6 items-stretch">
                {repos.map((repo, i) => (
                  <RepoCard repo={repo} index={i} key={i}/>
                ))}
              </motion.div>
            </section>

            {/* SECTION: Twin Terminals */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch flex-1">
              
              {/* TERMINAL 1: Tech Stack */}
              <Panel className="flex flex-col h-full !p-0">
                <div className="px-5 py-4 bg-white/40 border-b border-white flex items-center justify-between">
                  <SoftTrafficLights />
                  <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">stack.sh</span>
                  <div className="w-10" />
                </div>
                <div className="p-8 font-mono text-sm text-slate-700 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mb-8 font-medium text-slate-500">
                      <span className="text-indigo-500 font-black mr-2">{">"}</span> ./init_systems.sh
                    </div>
                    
                    <div className="space-y-6">
                      {STACK.map((group, i) => (
                        <div key={i} className={`bg-white/60 p-5 rounded-2xl border border-white shadow-sm`}>
                          <h3 className={`font-bold mb-4 flex items-center gap-2 ${group.color}`}>
                            <span className={`p-1.5 rounded-lg ${group.bg} ${group.border} border`}>{group.icon}</span> 
                            {group.category}
                          </h3>
                          <div className="grid grid-cols-2 gap-3 pl-2">
                            {group.items.map(item => (
                              <div key={item} className="flex gap-2 items-center font-bold text-slate-700 text-sm">
                                <CheckCircle2 size={16} className={`${group.color} opacity-80`}/> {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200/50 flex items-center gap-2 font-bold text-emerald-600">
                    <span className="text-indigo-500 font-black">{">"}</span> systems active.
                  </div>
                </div>
              </Panel>

              {/* TERMINAL 2: Contact Info */}
              <Panel className="flex flex-col h-full !p-0">
                <div className="px-5 py-4 bg-white/40 border-b border-white flex items-center justify-between">
                  <SoftTrafficLights />
                  <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">contact.exe</span>
                  <div className="w-10" />
                </div>
                
                <div className="p-8 font-mono text-sm text-slate-700 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mb-8 font-medium text-slate-500">
                      <span className="text-indigo-500 font-black mr-2">{">"}</span> contact --init
                    </div>

                    <div className="bg-white/60 border border-white rounded-[2rem] p-6 md:p-8 space-y-6 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 whitespace-nowrap overflow-hidden">
                        <div className="flex items-center shrink-0">
                          <span className="text-rose-500 font-bold w-16 md:w-24">NAME</span>
                          <span className="text-slate-400 mr-2 md:mr-4">:</span>
                        </div>
                        <span className="text-slate-800 font-bold text-xs sm:text-sm md:text-base truncate">ROSHAN ✭</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-4 whitespace-nowrap overflow-hidden">
                        <div className="flex items-center shrink-0">
                          <span className="text-amber-500 font-bold w-16 md:w-24">ALIAS</span>
                          <span className="text-slate-400 mr-2 md:mr-4">:</span>
                        </div>
                        <span className="text-slate-800 font-bold text-xs sm:text-sm md:text-base truncate">@roshhellwett</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 whitespace-nowrap overflow-hidden">
                        <div className="flex items-center shrink-0">
                          <span className="text-emerald-500 font-bold w-16 md:w-24">EMAIL</span>
                          <span className="text-slate-400 mr-2 md:mr-4">:</span>
                        </div>
                        <a href="mailto:roshhellwett@icloud.com" className="text-indigo-600 hover:text-indigo-500 font-bold text-[11px] sm:text-sm md:text-base hover:underline underline-offset-4 transition-all truncate">
                          @roshhellwett
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 flex items-center gap-2 font-bold text-slate-500 bg-white/40 p-4 rounded-xl border border-white">
                    <span className="text-indigo-500">roshhellwett@local</span><span className="text-slate-400">:~$</span>
                    <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2.5 h-5 bg-indigo-500 rounded-sm" />
                  </div>
                </div>
              </Panel>

            </div>
          </div>

        </motion.div>
      </main>

      {/* --- SITE FOOTER --- */}
      <footer className="max-w-7xl mx-auto px-6 py-8 mt-12 w-full text-center relative z-10">
        <div className="pt-8 border-t border-slate-300/40">
          <p className="text-xs font-bold text-slate-500">
            © {new Date().getFullYear()} Zenith Open Source Projects . All rights reserved.
          </p>
          <p className="text-[10px] font-medium text-slate-400 mt-2">
            Built with Next.js, Tailwind CSS, Framer Motion & Design By Claude & Gemini.
          </p>
        </div>
      </footer>
      
    </div>
  );
}