# AGENTS.md — Zenith Open Source Projects

## Quick start

```bash
npm install
npm run dev          # Next.js dev server (localhost:3000)
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
npm run build        # production build
```

CI order: `lint` → `type-check` → `build` (also builds `worker/` separately).

## Project structure

- **`app/`** — Next.js 16 App Router (layout, pages, API routes, globals.css, sitemap, robots)
- **`components/`** — React components; `apps/` subdir for desktop window apps
- **`data/`** — Static data (repos, nav, icons, categories, stack, socials, site config)
- **`lib/`** — Shared utilities (AI prompt, API helper, rate-limit, audio, scroll-lock)
- **`types/`** — Shared TypeScript types (`index.ts`)
- **`worker/`** — Standalone Express server for AI chat (separate `package.json`, deploys to Railway)

## Architecture

Two parallel AI chat backends — both use `lib/ai-prompt.ts` and `lib/rate-limit.ts`:

1. **Built-in**: `app/api/ai/chat/route.ts` — ships with Next.js (Vercel)
2. **Standalone**: `worker/server.ts` — Express server (Railway); run via `cd worker && npm run dev`

Frontend chooses via `NEXT_PUBLIC_API_URL` env var (empty = relative path = Vercel API route).

## AI prompt

The system prompt and offline demo responses live in `lib/ai-prompt.ts`. The prompt contains a comprehensive knowledge base of all Zenith projects, the founder, and response guidelines. There's a mirror copy in `worker/lib/ai-prompt.ts` — keep them in sync.

## Worker

```bash
cd worker
npm install
cp .env.example .env  # set GROQ_API_KEY
npm run dev            # tsx watch on port 3001
npm run build && npm start  # production
```

Deploys to Railway via `railway.json` (Nixpacks builder, healthcheck at `/health`).

## Config quirks

- `@/*` path alias maps to project root (e.g. `@/components/Navbar`)
- `next.config.ts` supports GitHub Pages via `GITHUB_PAGES=true` env (static export with `basePath`)
- Security headers set in `proxy.ts` (middleware), not `next.config.ts`
- Tailwind v4 — no `tailwind.config.js`; uses `@import "tailwindcss"` in `globals.css`
- PostCSS only uses `@tailwindcss/postcss`
- `tsconfig.json` excludes `worker/`

## CI / Deploy

- **CI** (`.github/workflows/ci.yml`): triggers on push/PR to `main`
- **GitHub Pages** (`.github/workflows/deploy-github-pages.yml`): triggers on push to `master`
- Package manager: npm (lockfile: `package-lock.json`)
- `worker/` is built in CI but not auto-deployed — Railway deploys independently

## Style conventions

- TypeScript strict mode — avoid `any`
- `"use client"` only when hooks or browser APIs needed; prefer Server Components
- Tailwind CSS for styling, no inline styles
- `React.memo` for list-rendered components
- IBM Plex Sans (sans-serif) + Source Code Pro (mono) via `next/font/google`

## No tests

There are no test files or test framework configured in this repo.
