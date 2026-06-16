# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page marketing/landing site for **Meptrasoft AI Technologies** (AI products + engineering training/internships). React 18 + Vite, no router, no backend. Everything renders on one page; navigation is anchor links that smooth-scroll to `section[id]` blocks.

## Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint      # ESLint over the repo (flat config, eslint.config.js)
```

No test framework is configured.

## Architecture

- **Entry**: `src/main.jsx` mounts `<App />` in `StrictMode` and imports `src/styles.css` (the real stylesheet). `src/index.css` and `src/App.css` are leftover Vite-template files and are **not imported** — ignore them; don't add styles there.
- **`src/App.jsx`** is the whole page composition. `Header` and `Hero` load eagerly; every section below is `React.lazy` + a single `<Suspense fallback={null}>`. New sections go here, in render order, and must be lazy-loaded to match the pattern.
- **Sections** live in `src/components/*.jsx`, one component per page section (Products, Services, Training, Courses, Internship, FinalYearProjects, Career, StudentSuccess, TechStack, About, BookConsultation, Register, Contact, Footer). Each renders a `<section id="...">` whose id is the scroll anchor target.
- **Navigation contract**: `Header.jsx` holds the `navItems` array (`href` → `label`) and uses an `IntersectionObserver` to highlight the active section. Anchor clicks call `handleAnchorClick`, which `preventDefault()`s and does `scrollIntoView({ behavior: 'smooth' })`. When you add/rename/remove a section, keep three things in sync: the `id` on the section, the entry in `navItems`, and any `href="#..."` links pointing at it.

## Styling

- All styling is **one global stylesheet**, `src/styles.css` (~2000 lines), driven by CSS custom properties in `:root` (`--teal`, `--orange`, `--navy`, `--gradient-hero`, `--radius*`, `--transition`, etc.). Use these tokens rather than hardcoding colors/radii. There are no CSS modules and no styled-components — components reference plain `className` strings.
- Font is **Sora**, loaded via `<link>` in `index.html` (not npm).

## Hero globe (the one heavy piece)

`src/components/Hero.jsx` renders an interactive 3D dotted globe with animated arcs using **three.js** directly (no react-three-fiber). Key points:
- The whole scene is built inside a single `useEffect(() => {...}, [])` with a full cleanup return (cancels RAF, disconnects `ResizeObserver`, removes window/container listeners, disposes renderer). Preserve this teardown — leaks here cause WebGL context exhaustion under StrictMode double-mount.
- Globe point positions come from `src/components/globePoints.json` (precomputed `[x,y,z]` triples fed into a `BufferGeometry`).
- Stat counters and the globe scale-in animate via `requestAnimationFrame`; counters start on `IntersectionObserver` visibility.

## Build config

`vite.config.js` defines `manualChunks` splitting `three`, `topojson-client`, and the FontAwesome packages into separate bundles, and targets `es2020`. If you add a large dependency that should be code-split, add it here.

## Icons

Two icon sources are in use: **grommet-icons** (e.g. `FormNextLink` in the Hero) and **FontAwesome** (`@fortawesome/*`, used across most section components). Match whichever the surrounding component already uses.
