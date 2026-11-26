# Keimelion Web — Claude context

## Language — English only

**Everything in this repo is written in English.** No French, no other language. This applies to every agent, subagent, and the main Claude — no exceptions.

- **Code** — identifiers, string constants, enum values, error messages, exceptions
- **Comments and JSDoc** (rare per standards — but when present, English only)
- **Git** — branch names, commit messages, PR titles, PR descriptions
- **Notion tickets when written by an agent** — description, acceptance criteria, technical notes, comments
- **Tests** — describe/it titles, assertion messages, fixture data

UI copy is the one exception by design: it lives in the i18n catalogs, never in code. French is a **first-class locale for end users** (owners, editors, guests): every `fr` string must read as natural French written by a native speaker, never a word-for-word translation of the English key.

The user is French-speaking and may write to you in French — respond in French in chat, but every artifact committed to the repo stays in English (catalog values excepted).

## Project

Public web app of Keimelion, a collaborative wishlist app: list owners, editors and guests (people who open a shared list and reserve a gift, often without an account). Built with Next.js 16 (App Router, Turbopack) and TypeScript, consuming the Keimelion REST API.

This repo is a sibling of **Keimelion-Backoffice** (the admin UI) and follows the exact same setup and conventions, minus the admin features, so an agent can switch repos without re-learning anything. When a pattern is missing here, look at how the BackOffice does it before inventing one.

Ports: API `3000`, BackOffice `3001`, **web app `3002`**.

## Stack

- **Framework**: Next.js 16 (App Router, RSC, Turbopack for dev and build, `output: 'standalone'`)
- **Language**: TypeScript strict
- **Styling**: Tailwind CSS v4 + shadcn/ui. No Sass/SCSS, no `tailwind.config`: design tokens are CSS variables in `src/styles/tokens.css` (`:root` light + `.dark` night), mapped to Tailwind through `@theme inline` in `src/app/globals.css`, which only holds `@import 'tailwindcss'`, `@custom-variant dark`, `@theme inline` and base styles. The few component rules Tailwind cannot express live in a colocated plain `.css` file (native nesting) imported from `src/app/layout.tsx`
- **Fonts** (`next/font/google`, in `src/app/layout.tsx`): Bricolage Grotesque for titles (`font-display`, weight 800, letter-spacing `-0.035em`, applied to `h1`–`h3` by default), DM Sans for text (`font-sans`, the body default), DM Mono for labels, prices and codes (`font-mono`), Caveat for handwritten accents (`font-hand`)
- **Data fetching**: TanStack Query v5
- **Forms**: react-hook-form + Zod v4
- **Animations**: `motion` (the only animation library). Reduced motion is honoured from day one: `<MotionConfig reducedMotion="user">` in `Providers` turns motion animations off when the OS asks for it, and a `prefers-reduced-motion` base rule in `globals.css` neutralises CSS transitions/animations. For a JS decision, use motion's own `useReducedMotion()` — never a hand-rolled media-query hook
- **Other libs**: next-themes, sonner (toasts), dnd-kit (reorder), lucide-react, `qrcode` (SVG output, share QR code)
- **Tests**: Vitest + React Testing Library (jsdom env, `src/test/setup.ts`) for unit and component tests under `src/`; Playwright smoke specs under `e2e/` against the production build with the API mocked by route interception (`e2e/support/mock-api.ts`). Every smoke spec runs an axe check (`@axe-core/playwright`, `expectNoAccessibilityViolations`) in light AND dark, and fails on any browser console error (hydration mismatches included)
- **Linting**: ESLint with `typescript-eslint` strict + stylistic type-checked
- **Formatting**: Prettier (same config as API and BackOffice)
- **No analytics** (see KEI-135): do not add any tracking script or SDK

## Design exports — `temp/design/`

Design boards are exported as HTML and dropped in `temp/design/` (git-ignored, never committed). Each web ticket names the boards it implements in its description (`DESIGN EXPORT → temp/design/: …`).

- `temp/design/*.html` are **visual specs, never imported by code**. Nothing under `src/` or `e2e/` may import, fetch, or copy files from `temp/`.
- Each exported board (`App-HF-*.html`) shows the **mobile layout (390 px) AND the desktop layout (1440 px)** of the same feature, plus notes under each screen. **Both must be implemented.**
- The HTML is a visual spec, not code to copy: rebuild with the UI kit (`src/components/ui`, `src/components/shared`) and the tokens. **Never paste inline styles**, hex values or class soup from the export.
- Board copy is in English; the French copy goes through i18n (natural French, see above).
- Animations loop in the boards for demo purposes; in the product they **play once, on their trigger**, and respect reduced motion.

### Breakpoints

- **Mobile**: below 768 px (`< md`), designs at 390 px
- **Tablet**: 768–1023 px (`md`) uses the **mobile layout in a centered 720 px column** (`md:max-w-tablet`) unless a ticket says otherwise
- **Desktop**: from 1024 px (`lg`), designs at 1440 px (`lg:max-w-desktop`)

`SiteShell` (`src/components/shared/site-shell/`) already applies this column rule to the header and `<main>`. Its layout reads the session cookie on the server (`hasServerSession()` from `src/data-access/_shared/auth-storage/server-session.ts`) so the navigation renders signed in or out without a flash: below `lg` a brand header and the bottom bar (Home, Browse, My lists, Profile / Home, Browse, Log in), from `lg` the top nav. The bottom bar is reserved under the page, and a mobile FAB goes in the `fab-slot` utility (right 16, bottom 100). A guest opening a signed-in page lands on `/auth/login?next=<page>`; read the return path with `resolveLoginReturnPath()` (`src/lib/login-return-path.ts`), never trust the raw parameter.

### Design tokens

Brand tokens live in `src/styles/tokens.css` (`:root, .light` by day, `.dark` at night) and are exposed through `@theme inline` in `globals.css`: `surface`, `raised`, `sunken`, `rule`, `rule-strong`, `ink`, `muted` (as `text-muted-foreground`), `brand`, `brand-deep`, `hand`, `hand-on-paper` (handwriting on an occasion paper, readable on every night paper), `danger`, `danger-deep` (button bottom edge), `warning`/`on-warning` (warning toasts), `success`, `focus`, `on-brand`, `on-danger`, `inverse`/`on-inverse` (toasts), `brand-soft`/`on-brand-soft` (soft tags); selected chips, the tab knob, radio dots, checkboxes and the selected radio card use `brand`/`on-brand`, `paper-*` (occasion papers), `gift-*` + `gift-ribbon` (wrapped gifts), `shadow-card`/`shadow-float` (none at night), `opacity-(--reserved-opacity)`, `brightness-(--photo-brightness)` and `bg-scrim` (overlay behind dialogs and sheets). Easings: `ease-spring` (arrivals), `ease-soft-out` (sheets, unfolding), `ease-standard` (exits, wrap); `animate-shimmer` for skeletons. Type scale: `text-display-xl`, `text-display-m`, `text-title`, `text-body`, `text-small`, `text-label`, `text-kicker`. Radii: `rounded-card` (22), `rounded-t-sheet` (28), `rounded-field` (16), `rounded-thumb` (16), `rounded-pill`. Map an occasion slug to its paper with `getOccasionPaper()` (`src/lib/occasions/occasion-paper.ts`). Hex colours are forbidden outside `tokens.css` (ESLint `no-restricted-syntax` + `scripts/check-no-hex-colors.mjs`, both in `npm run lint`). Run `npm run dev` and open `/dev/tokens` to see every token in both themes.

### UI kit and motion

**Before building any UI, read `.claude/ui-kit.md`** — the catalog of every reusable component (where it lives, its API in one line, when to use it) and the contracts they all follow. See them live with `npm run dev` → `/dev/kit`. Extend an existing component (new prop or variant) rather than writing a look-alike in a feature, and add any new reusable component to `/dev/kit` and to the catalog in the same PR.

In short: restyled primitives live in `src/components/ui`, composed components in `src/components/shared`, brand icons in `src/components/icons`, motion presets in `src/lib/motion`. Every form control drops into `FormControl`; every control keeps a 44 px touch target below `lg` (`touch-target`); selection is `brand`; animations play once and honour reduced motion through `useShouldReduceMotion()`. `src/components/` never imports from `src/features/` or `src/data-access/` (ESLint).

## Coding standards

See `.claude/coding-standards.md` for the full standards. They are derived from the API's rules (universal TypeScript patterns) with a React/Next addendum at the end.

Summary of rules that matter most in this codebase:
- **Named exports only** — no default exports (except Next.js page/layout components, which require default exports)
- **Explicit return types** on every function, including React components (`React.JSX.Element`)
- **No `else`** — early return pattern everywhere
- **`null` over `undefined`** for intentional absence
- **No abbreviations** — `error` not `err`, `response` not `res`
- **No comments** — rename instead of annotate
- **No magic numbers/strings** — extract to `const`
- **`const` over `let`**, never `var`
- **`async/await` only** — no `.then()` / `.catch()`
- **`??` over `||`** for nullish coalescing

## User-facing strings — always i18n

Every user-facing string is rendered through `react-intl`. There is no hardcoded UI copy — page titles, labels, buttons, headers, placeholders, toast bodies, empty states, error messages, `aria-label`, and metadata all go through catalog keys.

- **Library**: `react-intl` (FormatJS, ICU). Client provider at `src/lib/i18n/i18n-provider/`, mounted inside `Providers` in `src/components/providers.tsx`.
- **Catalogs**: split per-namespace under `src/lib/i18n/messages/{en,fr}/*.json` (`common.json`, `home.json`, `auth.json`, `lists.json`, `invites.json`, `error.json`, `query.json`, `dev.json`). Each locale is re-exported as a single flat catalog via `messages/en.ts` and `messages/fr.ts`; `messages/index.ts` exposes `MESSAGES` (per locale) and the `MessageId` type. Add a new string in the file that matches its namespace prefix — in BOTH locales. A new feature namespace gets a new pair of files, wired into `en.ts` and `fr.ts`.
- **Key convention**: `<feature>.<component>.<purpose>` — e.g. `lists.overview.title`, `common.locale_picker.select_language`, `auth.login.title`.
- **Adding a new string**: add the key to BOTH `en` and `fr` in the same PR. A PR that ships a new English string without the French counterpart (or vice versa) is blocked (`fr.ts` enforces it at typecheck through `satisfies Record<MessageId, string>`).
- **Interpolation**: use ICU syntax (`{name}`, `{count, plural, one {# gift} other {# gifts}}`), never string concatenation.
- **Client components**: use the typed `useTranslate()` hook — `const t = useTranslate(); t('auth.login.title')`. The `id` parameter is typed as `MessageId`, so typos fail typecheck. Read the active locale with `useLocale()` (hydration-safe, backed by the provider) — never `useLocaleStore((state) => state.locale)` in render, it mismatches the server HTML. Never call `useIntl()` directly outside `src/lib/i18n/`.
- **Server components** (pages, layouts, `generateMetadata`, OG images): use `await getServerTranslate()` and `await getRequestLocale()` from `src/lib/i18n/server-translate.ts`. The locale comes from the `keimelion_locale` cookie (written by the locale store next to `localStorage`), falling back to `Accept-Language`, then `en`.
- **Outside React**: for imperative client contexts (mutation callbacks, `queryClient` handlers, toast helpers), use `translate(id, values)` from `src/lib/i18n/translate.ts` — it reads the current locale from the Zustand store.
- **Tests**: wrap components in `IntlProvider` via `renderWithIntl` / `renderWithQueryClient` from `src/test/test-utils.tsx` — both already include the English catalog.
- **Locale resolution and switching**: `resolve-locale.ts` resolves the initial client locale from `localStorage` → `navigator.language` → `en`, and persists it to `localStorage` + the locale cookie. The `LocalePicker` drives `useLocaleStore`, then calls `router.refresh()` so server components re-render in the new locale. The `I18nProvider` renders the server's request locale during hydration, then follows the store; it also keeps `<html lang>` in sync. The locale flows to the API through the `Accept-Language` header set in `src/data-access/_shared/client/`.
- **Enforcement**: no ESLint rule is wired today. Reviewers must reject any PR that introduces a raw string in JSX or a hardcoded label passed to a prop — the string belongs in the catalog.

### React/Next.js additions

- **Server Components by default** — add `'use client'` only when needed (event handlers, hooks, browser APIs). Public guest pages (shared list, invite) must server-render their content: it is what link previews and slow phones see first
- **`React.JSX.Element` return type** on all components
- **Props as interface** — `interface ComponentProps { ... }`, not inline type or `type`
- **One component per file** — file name matches component name in kebab-case (`list-card.tsx` exports `ListCard`)
- **Folder-per-component when 2+ files** — if a component has more than one file (a `.tsx` plus `.test.tsx`, `.css`, `.stories.tsx`…), wrap them in a folder named after the component and add an `index.ts` that re-exports so imports stay short. Example: `components/shared/locale-picker/{locale-picker.tsx, locale-picker.test.tsx, index.ts}` — imported as `@/components/shared/locale-picker`. Single-file components stay flat.
- **Hooks prefix** — all custom hooks start with `use` (`useLists`, `useLogin`)
- **One form for create + update** — single component with a `mode: 'create' | 'edit'` discriminated union prop; never two parallel forms (`ListForm`, not `ListCreateForm` + `ListEditForm`). See `.claude/coding-standards.md` for the pattern.

### Review-learned pitfalls

Rules distilled from past BackOffice code reviews — follow unless there's an explicit reason to deviate.

- **Mount only what the user sees.** Tabs, accordions, sheets, modals, popovers and expandable rows render their inner trees only when active — otherwise every hidden panel runs its hooks and queries.
- **Prune transient `Set`/`Map` state when its source list changes.** Local sets like `expandedIds` or `selectedIds` must drop entries that no longer exist in the current page/filter. Use a `useEffect` keyed on the visible-id set.
- **Nullable id → sentinel queryKey + `enabled: false`.** Never do `useQuery({ queryKey: [..., id ?? ''], enabled: id !== null })`: the empty-string fallback collides across every call site that passes `null`. Pattern: `queryKey: id === null ? [...KEY, 'detail', null] : build(id)`.
- **Zod schemas with "at least one of X / Y" must `superRefine`.** A schema that happily parses an all-null record is a client-side bug waiting for a server 4xx.
- **Required form fields: `<FormLabel required>` is sufficient.** Don't duplicate the asterisk manually or add `sr-only "required"` text — that pollutes the input's accessible name.
- **Cap concurrent pending editor rows.** When the user can append new rows that each mount their own `useForm` + queries, allow at most one unsaved pending row at a time.
- **Accessible name contains the visible label.** Do not put an `aria-label` on a control that shows text: it hides the visible text from screen readers and fails axe (`label-content-name-mismatch`). Add the extra context as `sr-only` text inside the control instead, and mark decorative emoji/icons `aria-hidden`.

## Project structure

```
src/
  app/                  # Next.js App Router — pages and layouts only, no business logic
    (public)/           # Pages open to everyone with the full app chrome (SiteShell): / (home), browse, legal…
    (guest)/            # Guest pages reached from a shared link (GuestShell: logo, EN · FR, footer, no bottom bar): /invites/accept, shared lists…
    (auth)/auth/        # Account pages: /auth/login, /auth/verify-email, /auth/reset-password…
    (app)/              # Signed-in pages (owners, editors): /lists… — gated by src/middlewares/require-session.ts
    not-found.tsx       # 404 (the lost parcel) inside SiteShell; every route group has an error.tsx rendering RouteErrorState
  components/
    ui/                 # Our restyled primitives (shadcn + Radix) — owned code, see .claude/ui-kit.md
    shared/             # Reusable app-level components (site-shell, locale-picker, theme-picker…)
  data-access/          # All API calls — mirrors db/ in the API
    _shared/            # Shared infra used across resources (not itself a resource)
      client/           # apiClient: the single SDK client (locale, token, session refresh)
      auth-storage/     # Token + user + session-cookie storage — used by client, middleware, hooks
    <resource>/
      <resource>.api.ts # fetchX(), updateX()… plain async functions
  features/             # Feature logic: TanStack Query hooks + feature-specific components
    <feature>/
      components/
      hooks/
  styles/
    tokens.css          # Design tokens as CSS variables (:root + .dark), consumed by @theme inline in app/globals.css
  lib/
    app-paths.ts        # AppPaths: every route path, incl. the ones reserved by the API emails (WebAppPaths)
    query-client.ts     # TanStack Query client configuration + global mutation error toast
    i18n/               # i18n infrastructure (client provider, locale store, server helper, catalogs)
  proxy.ts              # Edge proxy entry (Next.js 16 — formerly middleware.ts). Next.js requires this exact path. Keep thin: composes helpers from middlewares/
  middlewares/          # Individual middleware helpers, each returns NextResponse | null (null = pass through)
    require-session.ts  # Gates signed-in routes (SIGNED_IN_PATH_PREFIXES) on the session cookie
e2e/                    # Playwright smoke specs; support/ holds the route-interception API mock and the axe helper
temp/                   # Git-ignored. temp/design/*.html = design exports (visual specs only)
```

### Routes reserved by the API

The API builds the account email links from `WebAppPaths` in `Keimelion-API/src/shared/mail/mail.links.ts`. These routes must keep existing here, with the token read from the URL **fragment** (`#token=…`, never sent to the server):

| Path | Purpose |
|---|---|
| `/auth/verify-email` | Email verification link |
| `/auth/reset-password` | Password reset link |
| `/invites/accept` | List invitation link |

They are declared in `AppPaths` (`src/lib/app-paths.ts`). Renaming one is a cross-repo change: API first, then here.

### data-access/ layer

`data-access/` is the direct equivalent of `db/entities/` in the API:
- Each file exports plain async functions that call the API — no TanStack Query, no hooks
- Functions return the parsed SDK response type
- All API call logic lives here through `apiClient`; features never call `fetch` or the SDK directly
- **No schemas here**: endpoint request and response schemas live in `@keimelion/sdk`; form and URL validation lives in the feature (`<feature>.input-schemas.ts`)
- **`_shared/`** groups every non-resource helper (client, storage). The `_` prefix marks it as shared infra, not a resource
- **Guests use the same `apiClient`**: with no stored token, no `Authorization` header is sent

### features/ layer

- **Hooks** wrap `data-access/` functions with TanStack Query (`useQuery`, `useMutation`)
- **Components** are feature-specific and import from hooks, never from `data-access/` directly

## API contract: `@keimelion/sdk`

The web app has no filesystem dependency on the API. It talks to the API over HTTP through the published [`@keimelion/sdk`](https://www.npmjs.com/package/@keimelion/sdk) package, which is the single source of truth for enums, schemas, types and the HTTP client. The repo clones and runs on its own.

```ts
import { apiClient } from '@/data-access/_shared/client'
import { ApiError } from '@keimelion/sdk/client'
import { ErrorCode, UserRoles } from '@keimelion/sdk/enums'
import type { UserDetailParsed } from '@keimelion/sdk/schemas'
```

- **Contract changes go SDK first, then consumers**: publish the change in `@keimelion/sdk`, bump the pinned version here, then adapt the code. Never redeclare a response or request shape locally.
- **Enums and types** come from `@keimelion/sdk/enums` and `@keimelion/sdk/schemas`. Parsed responses decode timestamps to `Date`.
- **`src/data-access/_shared/client/`** creates the single `apiClient`: auth token, locale (`Accept-Language`) through the `fetch` option, and session refresh through `onUnauthorized` (refresh once, coalesced). It is a copy of the BackOffice client; the `EMAIL_NOT_VERIFIED` refresh case is handled by KEI-222.
- **Errors** are SDK `ApiError` instances (`status`, `code`, `issues`, including client codes `NETWORK_ERROR`, `TIMEOUT`, `ABORTED`, `INVALID_RESPONSE`). Branch on `ErrorCode` values, never on message strings.
- **Form and URL validation** that carries UI copy (messages, `catch` defaults) lives in `src/features/<feature>/<feature>.input-schemas.ts`, reusing SDK constants.

## Commands

```bash
npm run dev        # Start dev server with Turbopack (port 3002 — API 3000, BackOffice 3001)
npm run build      # Production build with Turbopack (output: standalone)
npm start          # Serve the standalone build on port 3002 (copies .next/static and public next to server.js)
npm run lint       # ESLint
npm run format     # Prettier
npm test           # Vitest single-pass
npm run test:watch # Vitest watch mode
npm run test:e2e   # Playwright smoke specs (e2e/) against the built app; run `npm run build` first. Locally reuses a server already on 3002
```

## Environment

- `NEXT_PUBLIC_API_URL` — base URL of the Keimelion API (e.g. `http://localhost:3000`). Required, inlined at build time.
- `NEXT_PUBLIC_WEB_APP_URL` — public origin of this app (e.g. `http://localhost:3002`), used as `metadataBase` and for absolute share links. Must match the API's `WEB_APP_URL`.
- `ENABLE_DEV_PAGES` — server-only, read at runtime. Dev builds always serve the developer pages under `/dev` (`/dev/tokens`); a production build returns 404 for them unless this is `true`. Only the Playwright smoke run sets it, never a deployed environment.

Node 24 (`.nvmrc`).
