# Contributing to Zenith Open Source

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/zenithopensourceprojects.git`
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`

## Development Workflow

- Create a branch for your changes: `git checkout -b feature/my-feature`
- Make your changes
- Run lint: `npm run lint`
- Run type check: `npm run type-check`
- Run build: `npm run build`
- Commit with a clear message
- Push and open a Pull Request

## Code Style

- TypeScript strict mode is enabled — avoid `any` types
- Use `"use client"` only when React hooks or browser APIs are needed
- New components should be Server Components by default
- Use Tailwind CSS for styling, avoid inline styles
- Add `React.memo` to components rendered in lists

## Pull Request Process

1. Ensure the build passes locally
2. Update documentation if needed
3. PRs require at least one review
4. Keep PRs focused on a single concern

## Reporting Issues

Open an issue at https://github.com/roshhellwett/zenithopensourceprojects/issues
