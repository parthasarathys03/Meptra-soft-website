# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing/product site for **Meptrasoft AI Technologies** (AI products + engineering training/internships). **React 18 + TypeScript + Vite + Tailwind CSS v4**, client-side routing via **react-router-dom**, no backend. Multi-page: `/`, `/solutions`, `/learn`, `/careers`, `/about`, `/contact`.

## Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # tsc -b && vite build → dist/
npm run preview   # serve the production build locally
npm run lint      # ESLint (flat config: eslint.config.js)
```

No test framework is configured. Typecheck standalone with `npx tsc -b --noEmit`.

## Architecture

- **Entry**: `src/main.tsx` mounts `<App />` in `StrictMode`, wrapped in `<BrowserRouter>` (with v7 future flags) and `<MotionConfig reducedMotion="user">` (so all Framer Motion honors `prefers-reduced-motion`). Imports `src/index.css` (the real stylesheet).
- **`src/App.tsx`** holds the `<Routes>`. `Home` is imported eagerly for fast first paint; `Solutions`, `Learn`, `Careers`, `About`, `Contact` are `React.lazy` + `<Suspense>` (route-level code splitting).
- **Pages** live in `src/pages/*.tsx`; each composes **section** components from `src/components/sections/*.tsx`. Shared UI in `src/components/ui`, motion primitives in `src/components/motion`, layout in `src/components/layout`, brand visuals in `src/components/brand`.
- **Content** is centralized in `src/data/content.ts`; types in `src/lib/types.ts`; helpers in `src/lib/utils.ts` (incl. `prefersReducedMotion`).

## Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` — components use utility `className` strings. Design tokens (colors like `--color-aqua-400`, gradients, radii) and a few custom utilities live in `src/index.css` (`@layer base/utilities`). Prefer tokens over hardcoded values.
- Global `:focus-visible` ring and a `prefers-reduced-motion` block are in `src/index.css`. Note that block only affects **CSS** animation/transition; JS-driven motion is handled by `MotionConfig` (Framer) and explicit checks (Globe, `prefersReducedMotion()`).
- Font is **Sora**, loaded via `<link>` in `index.html` (weights 400/500/600/700/900 — the ones actually used).

## Hero globe (the one heavy piece)

`src/components/brand/Globe.tsx` renders an interactive 3D dotted globe with animated arcs using **three.js** directly (no react-three-fiber).
- three.js is ~129 kB gzip, so `Hero` (`src/components/sections/Hero.tsx`) loads `Globe` via `React.lazy` and only mounts it on `requestIdleCallback` after first paint — the chunk stays off the critical path. The hero's right column reserves the globe's box (`min-h`) so the late mount causes **no layout shift**. Keep both the lazy import and the reserved space.
- The whole scene lives in one `useEffect` with a full cleanup return (cancels RAF, disconnects `ResizeObserver` + `IntersectionObserver`, removes listeners, disposes renderer). Preserve this teardown — leaks cause WebGL context exhaustion under StrictMode double-mount.
- The render loop is paused via `IntersectionObserver` when the globe is off-screen, and under `prefers-reduced-motion` it draws a single static frame (no loop). Preserve both.
- Globe point positions come from `src/data/globePoints.json` (`[x,y,z]` triples → `BufferGeometry`).

## Build config

`vite.config.ts` targets `es2020` and defines `manualChunks` splitting `three`, `react-router-dom` (router), and `framer-motion` (motion) into separate bundles. `three` + `Globe` are async chunks (dynamic import). If you add a large dependency to code-split, add it here.

## Icons

Two icon sources are in use: **grommet-icons** and **FontAwesome** (`@fortawesome/*`, tree-shaken). There is also a local `Icon` wrapper (`src/components/ui/Icon.tsx`). Match whichever the surrounding component already uses.
