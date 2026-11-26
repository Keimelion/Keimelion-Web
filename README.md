# Keimelion Web

**The public web app of [Keimelion](https://keimelion.com)** — collaborative wishlists for owners, editors and guests.

![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.x-FF4154?logo=reactquery&logoColor=white)

It shares its setup and conventions with [Keimelion-Backoffice](https://github.com/Keimelion/Keimelion-Backoffice), minus the admin features. Agent and contributor rules live in [`CLAUDE.md`](CLAUDE.md) and [`.claude/coding-standards.md`](.claude/coding-standards.md).

---

## Getting started

> Prerequisites:
> - **Node.js 24** (`nvm use` reads `.nvmrc`)
> - A running Keimelion API, reachable at `NEXT_PUBLIC_API_URL` (see its README).

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The web app is available at **http://localhost:3002** (API on 3000, BackOffice on 3001).

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Keimelion API, inlined at build time |
| `NEXT_PUBLIC_WEB_APP_URL` | Public origin of this app (`metadataBase`, share links); must match the API's `WEB_APP_URL` |

### Adding UI components

shadcn/ui is initialized with a **Stone** base:

```bash
npx shadcn add <component-name>
```

---

## Stack

| Layer | Tech |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) — App Router, React Server Components, Turbopack, standalone output |
| UI | [shadcn/ui](https://ui.shadcn.com) — Radix primitives + Tailwind |
| Styling | [Tailwind CSS v4](https://tailwindcss.com), CSS-first: tokens in `src/styles/tokens.css`, no Sass, no `tailwind.config` |
| Fonts | Bricolage Grotesque (titles), DM Sans (text), DM Mono (labels, prices, codes), Caveat (accents) via `next/font` |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) — light / dark / system |
| Animations | [motion](https://motion.dev) — reduced motion honoured globally |
| HTTP client | [`@keimelion/sdk`](https://www.npmjs.com/package/@keimelion/sdk) — single `apiClient` with auth, `Accept-Language` and session refresh |
| Data fetching | [TanStack Query v5](https://tanstack.com/query) |
| Forms | react-hook-form + [Zod](https://zod.dev) |
| i18n | [react-intl](https://formatjs.github.io/docs/react-intl) — EN and FR, client and server rendering |
| Client state | [Zustand](https://zustand-demo.pmnd.rs) — locale store |
| Tests | [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react); [Playwright](https://playwright.dev) smoke specs with a mocked API and [axe](https://github.com/dequelabs/axe-core-npm) checks in light and dark |

---

## Routes

| Group | Paths | Audience |
|---|---|---|
| `(public)` | `/` | Everyone, with the full app navigation |
| `(guest)` | `/invites/accept` | Guests arriving from a shared link: minimal header, no bottom bar |
| `(auth)` | `/auth/login`, `/auth/verify-email`, `/auth/reset-password` | Account pages |
| `(app)` | `/lists` | Signed-in owners and editors (gated by `src/proxy.ts`) |

`/auth/verify-email`, `/auth/reset-password` and `/invites/accept` are the targets of the API email links (`WebAppPaths` in the API); the token travels in the URL fragment.

---

## Commands

```bash
npm run dev         # Development server with Turbopack (port 3002)
npm run build       # Production build with Turbopack (output: standalone)
npm start           # Serve the standalone build on port 3002
npm run lint        # ESLint
npm run format      # Prettier
npm test            # Vitest — single pass
npm run test:watch  # Vitest — watch mode
npm run test:e2e    # Playwright smoke specs + axe against the built app (API mocked)
```

---

## Commit convention

Every commit and every PR title follows:

```
<type>: <identifier> <short description> (<TICKET-ID>)
```

For example `feat: /lists show the owner's lists (KEI-42)`. Commits are checked by commitlint (husky `commit-msg` hook) and releases are cut by semantic-release on `main`. See the Keimelion-Backoffice README for the full table of types and identifiers.

---

## Claude Code — agent workflow

Repo-tracked Claude Code configuration lives under `.claude/` (copied from the BackOffice and adapted to the web app):

| File | Purpose |
|---|---|
| `.claude/agents/dev.md` | The single dev agent — Dev + Lead Dev + DevOps + Tester, with a self-review checklist |
| `.claude/agents/po.md` | Product Owner — grooms Notion tickets (Repo `Frontend`) |
| `.claude/agents/doc-writer.md` | Updates Notion spec pages after a feature is Validated |
| `.claude/skills/build-feature/` | `/build-feature <ticket>` |
| `.claude/skills/refine-ticket/` | `/refine-ticket <ticket>` |
| `.claude/skills/apply-pr-review/` | `/apply-pr-review` |
| `.claude/skills/document-feature/` | `/document-feature` |
| `.claude/coding-standards.md` | Style rules the Dev follows and enforces |

Notion goes through `scripts/notion/notion.mjs` (zero-dependency REST wrapper); put `NOTION_TOKEN` in `.env.local`.

Design boards are exported to `temp/design/` (git-ignored). They are visual specs, never imported by code — see `CLAUDE.md`.
