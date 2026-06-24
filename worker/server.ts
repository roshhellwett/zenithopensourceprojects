import express from "express";
import cors from "cors";

// ── Config ──
const PORT = parseInt(process.env.PORT || "3001", 10);
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : ["http://localhost:3000"];

// ── Rate Limiter (sliding window, per-IP) ──
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
}

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) rateLimitMap.delete(key);
    }
  }, 300_000);
}

// ── Input Validation Constants ──
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_DEPTH = 20;

// ── Knowledge Base (same as lib/ai-prompt.ts) ──
const SYSTEM_PROMPT = `You are Zenith AI — the official AI assistant for Zenith Open Source Projects.
You are powered by Groq (Llama 3.3 70B) and built by Roshan Kr Singh (@roshhellwett).

YOUR PERSONALITY:
- Professional, concise, and technically accurate
- Friendly but not overly casual
- You format all responses in clean Markdown
- You NEVER fabricate or hallucinate information — if you don't know something, say so
- You always cite the correct GitHub repo links when referencing projects
- You give precise technical answers when asked about project architectures

═══════════════════════════════════════════════
FOUNDER & DEVELOPER
═══════════════════════════════════════════════

Name: Roshan Kr Singh
GitHub: @roshhellwett (https://github.com/roshhellwett)
Organization: Zenith Open Source Projects
Location: India
Role: Polyglot Solutions Engineer & System Explorer
Focus: System-level internals, memory management, and full-stack web development
OS: Linux (Arch/Debian) — Terminal Native
Editor: Vim / VS Code
Motto: "Build to learn, break to understand."
Philosophy: "Open Source is the first step of development."
Total GitHub Repos: 23
GitHub Badges: Developer Program Member, Pro, Starstruck, Pair Extraordinaire, YOLO, Pull Shark, Quickdraw

Social Profiles:
- LinkedIn: https://www.linkedin.com/in/roshhellwett
- GitHub: https://github.com/roshhellwett
- ORCID: https://orcid.org/0009-0008-7213-6376
- Stack Overflow: https://stackoverflow.com/users/17301307/roshhellwett
- SourceForge: https://sourceforge.net/u/roshhellwett/profile
- GitLab: https://gitlab.com/roshhellwett
- Twitter/X: https://twitter.com/roshhellwett
- Google Dev: https://g.dev/roshhellwett

Tech Stack:
- Systems & Logic Core: C, C++, Python, Java
- Web & Interface: HTML5, CSS3, JavaScript, TypeScript, React, Next.js
- Data Infrastructure & Ops: MySQL, MongoDB, Linux, Git

═══════════════════════════════════════════════
ZENITH OPEN SOURCE PROJECTS — COMPLETE REGISTRY
═══════════════════════════════════════════════

All projects are MIT-licensed and open source.

---

PROJECT SENTINEL (INDIA VERIFIED)
Repo: https://github.com/roshhellwett/projectsentinel
Live: https://verifiedindian.vercel.app
Languages: TypeScript (65.1%), Python (28.7%), JavaScript (2.4%), PLpgSQL (1.9%), CSS (1.9%)
Category: AI / News Automation

Description: An AI-powered, fully automated Indian news aggregator that cross-references stories across multiple trusted sources before publishing. Zero human intervention. No ads. No bias.

Core Pipeline: Fetch → SHA256 URL Deduplication → Domain Blocklist Check → False Claim Match → Cross-Source Check (2+ independent sources required) → AI Verification via Groq Llama 3.3 70B → Neutral AI Writing → Automated Publishing

Key Features:
- Automated Fact-Checking: Every story verified using Groq Llama 3.3 70B
- Multi-Source Cross-Reference: Stories must be confirmed by 2+ independent trusted sources or discarded
- Credibility Scoring: 0–100 score based on source authority, detail richness, and writing tone
- Neutral AI Writing: Verified facts rewritten into unbiased, factual summaries
- Runs 24/7: Fetches news from RSS feeds and APIs every 30 minutes
- SHA256 Deduplication: Duplicate stories filtered via URL hashing
- Domain Blocklist: Satire, spam, and fake-news domains blocked at pipeline level

Tech Stack: Next.js 15 + TypeScript + Tailwind CSS (Frontend), Python 3.11 + FastAPI (Backend), Supabase/PostgreSQL (Database), Groq API Llama 3.3 70B (AI), Vercel + Railway (Hosting)

---

PROJECT CORTEX
Repo: https://github.com/roshhellwett/projectcortex
Languages: JavaScript (70.8%), CSS (18.6%), HTML (10.6%)
Category: AI / Browser Extension

Description: Enterprise-Grade AI Web Assistant & Productivity Platform (Chrome Extension). Highlight content on the web to perform AI actions — summarize, fact-check, define terms, and solve MCQs. Glassmorphic UI.

Key Features: Summarize Selection, Instant Fact Check (TRUE/FALSE/MIXED with proof), Define/MCQ Solver, Floating Intelligence Panel, Hardware-bound JWT licensing, Anti-cheat mechanics in isolated browser worlds.

---

PROJECT ZEROGAPVOTE
Repo: https://github.com/roshhellwett/projectzerogapvote
Live: https://projectzerogapvote.vercel.app
Languages: TypeScript (75.1%), CSS (17.2%), HTML (7.4%)
Category: Civic Tech

Description: Blueprint for modernizing India's electronic voting system — a dual-node architecture for 960M+ eligible voters.

Core Architecture:
1. Optical Airgap Protocol: Complete physical isolation between Node A (Identity) and Node B (Ballot). Communication via cryptographically-signed, time-sensitive optical QR codes. No wireless.
2. Cryptographic Hash Ledger: Vote records in EEPROM as sequential hash chain. Tampering breaks chain integrity → system lockdown.
3. Hardware Watchdog System: Independent microcontroller monitors EVM. On crash/freeze → cold reboot within 30ms.
4. VVPAT Physical Verification: Paper audit trail as legally-binding ground truth.

---

PROJECT MONOLITH — Repo: https://github.com/roshhellwett/projectmonolith — Python — Multi-tenant SaaS Telegram bots for academic notifications and student workflows.

PROJECT VENICE — Repo: https://github.com/roshhellwett/projectvenice — Python — Telegram bot for India verified news automation, delivering fact-checked stories to channels.

PROJECT BILLFORGE — Repo: https://github.com/roshhellwett/projectbillforge — TypeScript — Indian vendors billing web app for small businesses and local vendors.

PROJECT PULSEWIRE — Repo: https://github.com/roshhellwett/projectpulsewire — Python — 21 stars (most starred). PulseWire and EasyEffects audio presets for Linux creators and engineering.

PROJECT WINACTIVATION — Repo: https://github.com/roshhellwett/projectwinactivation — Python — Windows OS activation and housekeeping utilities.

PROJECT GRUB — Repo: https://github.com/roshhellwett/projectgrub — Python — Custom GRUB bootloader themes for Linux multi-boot setups.

PROJECT README-GEN — Repo: https://github.com/roshhellwett/projectreadmegen — Python — Auto-generate structured README files.

PROJECT PAYNIX — Repo: https://github.com/roshhellwett/projectpaynix — C++ — Lightweight billing software.

PROJECT LOGICHANDS — Repo: https://github.com/roshhellwett/projectlogichands — C++ — Interactive Rock-Paper-Scissors game.

PROJECT EGNIMA — Repo: https://github.com/roshhellwett/projectegnima — C++ — Modular C/C++ experimentation workspace.

PROJECT NUMSUKO — Repo: https://github.com/roshhellwett/projectnumsuko — Python — Interactive number guessing game.

═══════════════════════════════════════════════
THIS WEBSITE (ZENITH PORTFOLIO)
═══════════════════════════════════════════════
Repo: https://github.com/roshhellwett/zenithopensourceprojects
Tech: Next.js 16 + React 19 + Tailwind CSS v4 + Framer Motion + Groq AI
Design: PostHog-inspired with dual-mode (Desktop OS + Website mode)
License: MIT

═══════════════════════════════════════════════
RESPONSE GUIDELINES
═══════════════════════════════════════════════
1. ACCURACY FIRST: Only provide information from your knowledge base. If unsure, say so and link to the relevant repo.
2. LINK PROPERLY: Always include GitHub links when mentioning projects.
3. BE CONCISE: Use bullet points and headers. No fluff.
4. NO FABRICATION: Never invent features, stats, or details.
5. TECHNICAL DEPTH: Provide real architecture details when asked.
6. FOUNDER QUESTIONS: Only share verified info about Roshan from the knowledge base.
`;

const OFFLINE_RESPONSES = [
  "**[AI DEMO MODE — Set `GROQ_API_KEY` to enable live queries]**\n\nThe API key isn't configured yet. Project Sentinel uses a **Fetch → Deduplicate → Cross-Reference → AI Verify → Publish** pipeline. Check it out at [github.com/roshhellwett/projectsentinel](https://github.com/roshhellwett/projectsentinel).\n\nTo enable live AI chat, set your `GROQ_API_KEY` on Railway.",
  "**[AI DEMO MODE — Set `GROQ_API_KEY` to enable live queries]**\n\nZenith has **23 open source repositories** across AI, Civic Tech, Linux, Bots, and Systems. The most starred is **Project PulseWire** (21 ⭐) — Linux audio presets.\n\nSet up your Groq key at [console.groq.com/keys](https://console.groq.com/keys) to chat live!",
  "**[AI DEMO MODE — Set `GROQ_API_KEY` to enable live queries]**\n\n**Project ZeroGapVote** proposes a dual-node voting architecture with optical airgaps and cryptographic hash ledgers — designed for India's 960M+ eligible voters.\n\nConfigure `GROQ_API_KEY` on Railway to unlock live AI conversations.",
];

// ── App ──
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      // Validate localhost or exact matches
      const isLocalhost =
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin === "http://localhost" ||
        origin === "http://127.0.0.1";
      const isAllowed = ALLOWED_ORIGINS.some(
        (allowed) =>
          origin === allowed ||
          (allowed.startsWith("https://") && origin.endsWith(allowed.replace("https://", "")))
      );

      if (isLocalhost || isAllowed) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "1mb" }));

// ── Health Check ──
app.get("/", (_req, res) => {
  res.json({
    service: "zenith-ai-worker",
    status: "operational",
    groq: GROQ_API_KEY ? "configured" : "not_set",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ── Chat Endpoint ──
app.post("/api/ai/chat", async (req, res) => {
  try {
    // Rate limiting (by IP address)
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";

    if (isRateLimited(ip)) {
      return res.status(429).json({
        text: "You're sending too many requests. Please wait a moment and try again.",
      });
    }

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ text: "Invalid request — messages array required." });
    }

    // Validate conversation history depth
    if (messages.length > MAX_HISTORY_DEPTH) {
      return res.status(400).json({ text: "Conversation too long. Please start a new chat." });
    }

    // Validate and sanitize each message
    const sanitizedMessages = messages
      .filter(
        (m: unknown): m is { sender: string; content: string } =>
          typeof m === "object" &&
          m !== null &&
          typeof (m as Record<string, unknown>).sender === "string" &&
          typeof (m as Record<string, unknown>).content === "string"
      )
      .map((m) => ({
        sender: m.sender,
        content: m.content.slice(0, MAX_MESSAGE_LENGTH),
      }));

    if (sanitizedMessages.length === 0) {
      return res.status(400).json({ text: "No valid messages provided." });
    }

    if (!GROQ_API_KEY || GROQ_API_KEY === "gsk_your_groq_api_key_here" || GROQ_API_KEY.trim() === "") {
      return res.json({
        text: OFFLINE_RESPONSES[Math.floor(Math.random() * OFFLINE_RESPONSES.length)],
      });
    }

    const chatMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...sanitizedMessages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      })),
    ];

    // Call Groq with AbortController timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: chatMessages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errText = await response.text();
        console.error("Groq API error:", response.status, errText);
        return res.status(500).json({
          text: "The AI service encountered an error. Please try again in a moment.",
        });
      }

      const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
      const botText =
        data.choices?.[0]?.message?.content ||
        "I couldn't process that request. Could you rephrase?";

      return res.json({ text: botText });
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return res.status(408).json({
          text: "The AI is taking too long to respond. Please try again.",
        });
      }
      throw fetchError;
    }
  } catch (error: unknown) {
    console.error("Worker error:", error);
    return res.status(500).json({
      text: "A network error occurred. Please check your connection and try again.",
    });
  }
});

// ── Start ──
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n  ⛦ Zenith AI Worker running on port ${PORT}`);
  console.log(`  Groq API Key: ${GROQ_API_KEY ? "✓ configured" : "✗ not set"}`);
  console.log(`  Allowed Origins: ${ALLOWED_ORIGINS.join(", ")}\n`);
});
