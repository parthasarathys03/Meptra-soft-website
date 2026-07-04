# Meptrasoft AI Technologies — Website Build Handoff

> Self-contained spec for the engineer/AI building this. Everything needed is here.
> Companion docs (deeper rationale): `BRAND_DESIGN_SYSTEM.md`, `UX_ARCHITECTURE.md`, `MOTION_MEDIA_SPEC.md`, `STRATEGY_REVIEW.md`.
> **Prime directive:** premium AI-technology company that does NOT look like a generic AI/SaaS template. One signature motif, restrained motion, real content.

---

## 1. Summary

**Company:** AI-first company, two equal pillars — **(1) AI Products & Technology Solutions** (B2B) and **(2) Education & Career** (students/professionals).
**Business reality:** revenue today is student-driven (courses, internships, projects, certifications). So: **equal brand weight, deeper student conversion funnel** ("Rule B5").
**Audience:** ~50% students (mobile, from Instagram/WhatsApp/LinkedIn/Google) + ~50% business (desktop). Plus job seekers (third, smaller).
**Signature idea:** the logo — a **brain-circuit-tree growing from an open book** — is the through-line (hero animation, dividers, bullets, loaders).

### Goals every screen must serve
Business growth (convert) · Brand identity (premium, equal pillars) · UX (mobile-first, per-platform) · Scalability (5–10 yr, content-model driven).

---

## 2. Tech stack

- **React + Vite + TypeScript** (fresh scaffold)
- **Tailwind CSS v4** (`@tailwindcss/vite`) — tokens below become the theme
- **shadcn/ui** (Radix base) — restyled to tokens, never default look
- **Motion (Framer Motion)** — `LazyMotion`, `whileInView`, `viewport={{once:true}}`, transform/opacity only
- **Router** (React Router or TanStack) — multi-route
- **21st.dev Magic MCP** — inspiration only, restyle to tokens, copy nothing
- Font: **Sora** (self-host/`@font-face`, weights 400/600/700)

---

## 3. Color system (exact)

**Principle:** navy carries surfaces (stable on all screens); teal/aqua = accents only; amber = education accent. This fixes the "teal looks different on every monitor" problem. **sRGB only** — no display-p3, no pure-saturated cyans as fills.

### Tokens (CSS variables → Tailwind theme)
```
/* Ink / Navy — surfaces, text, structure */
--ink-900:   #0B1F38   /* darkest bg / text */
--navy-800:  #0F2F50   /* brand navy (from logo) */
--navy-700:  #164761
--slate-500: #5C7085   /* muted text */
--line-200:  #DCE4EC   /* borders */
--bg-50:     #F5F8FA   /* light page bg */
--surface:   #FFFFFF

/* Teal / Aqua — Pillar 1 (Solutions) accent, ACCENT ONLY */
--teal-700:  #0A6E78   /* the only teal safe for small text on white (WCAG AA) */
--teal-600:  #008088   /* primary teal fill */
--teal-500:  #0A9CA0
--aqua-400:  #00B4AE   /* icons, highlights, gradient mid */
--aqua-300:  #5BC3B9

/* Amber — Pillar 2 (Learn) accent */
--amber-600: #E08A2B   /* amber text/strong */
--amber-500: #F5A623   /* amber fill / student CTA */
--amber-300: #F5B84E

/* Gradients */
--gradient-hero:  linear-gradient(155deg,#0A1A30 0%,#0F2F50 45%,#0C3A44 100%)
--gradient-brand: linear-gradient(120deg,#008088,#00B4AE)   /* teal→aqua, e.g. text-clip */
--gradient-learn: linear-gradient(120deg,#164761,#E08A2B)

/* Semantic (separate from accents) */
--success:#1E9E6A  --warning:#E0A020  --error:#D64545
```

### Usage rules
- **Text:** `--ink-900` / `--navy-800` on light; white on navy. Teal text → `--teal-700` only. Amber text → `--amber-600` only.
- **Pillar signaling:** Solutions blocks = teal accent; Learn blocks = amber accent; Careers = navy. Same navy+neutral base everywhere → one brand.
- **Contrast:** WCAG AA (4.5:1 body, 3:1 large/UI). Never use `--teal-500`/`--aqua-400`/`--amber-500` as text on white.

### Amber discipline (learned from hero v1 → v2)
- **Bright amber `#F5A623` is reserved for the primary CTA only** — it earns maximum pull when it's the single warmest thing on screen. Use it on `Start Learning` / `Enroll` / `Enquire`.
- **Everywhere else amber = deeper `#E08A2B`** (accent nodes, amber text, small highlights). Bright amber sprinkled around reads "candy/marketing"; reserving it keeps the page premium.
- **Headline gradient = teal→aqua only** (`--gradient-brand`, `#00B4AE → #5BC3B9` on dark / `#008088 → #00B4AE` on light). **Never teal→amber for text** — the midpoint goes muddy olive and cheapens it. Warm + cool mix only as separate elements, not blended in one gradient.
- **On-navy label/caption text ≥ `--slate-500`/`#9FB3C6`.** `--faint` (`#5C7085`) is decorative only — too low-contrast for stat labels or any real text on the dark hero.

---

## 4. Typography — Sora

| Role | Size (desktop → mobile via clamp) | Weight | Tracking | Line-height |
|---|---|---|---|---|
| Display/hero | 60 → 34px | 700 | -0.028em | 1.04 |
| H1 | 40px | 700 | -0.02em | 1.1 |
| H2 | 30px | 600 | -0.01em | 1.2 |
| H3 | 22px | 600 | normal | 1.3 |
| Body-lg | 18px | 400 | normal | 1.6 |
| Body | 16px | 400 | normal | 1.6 |
| Caption | 13px | 500 | normal | 1.4 |
| Eyebrow/label | 12px | 700 | 0.14–0.16em, UPPERCASE | 1.4 |

- Headings `text-wrap:balance`. Body max ~46–65ch. `tabular-nums` on stats.
- **Eyebrows/labels/stats use a mono accent** (`ui-monospace` stack) — ties to the circuit/tech theme and reads "engineering", not "marketing".

---

## 5. Spacing, radius, shadow, motion tokens

```
space:  4 8 12 16 24 32 48 64 96 128 (px)   section pad: 96–128 desktop / 56–72 mobile
radius: --r-sm 8 · --r-md 14 (cards) · --r-lg 24 (feature) · --r-pill 100
shadow-card:  0 2px 12px rgba(11,31,56,.06)
shadow-hover: 0 14px 34px rgba(11,31,56,.10), 0 3px 10px rgba(11,31,56,.05)
shadow-amber: 0 8px 26px rgba(245,166,35,.28)   /* on amber CTAs */
ease:     cubic-bezier(.22,.9,.3,1)   /* general in */
ease-pop: cubic-bezier(.3,1.4,.5,1)   /* node/badge pop */
dur:      micro 150ms · ui 250ms · reveal 600–700ms · draw 1.6–1.7s
```

---

## 6. Card styles (exact specs)

All cards: `--surface` bg, `1px --line-200` border, `--shadow-card`, hover → `--shadow-hover` + lift `translateY(-4px)`. Pillar accent = **top border (3px)** or icon tint, in the pillar color. Radius `--r-md`.

| Card | Anatomy | Notes |
|---|---|---|
| **OfferingCard** (course/internship/service, reusable) | icon/thumb · title · 1-line outcome · meta chips (duration·level·price) · CTA | Amber CTA for Learn, teal for Solutions. Content-model driven. |
| **ProductCard** | product UI screenshot · name · what-it-does · "Book a demo" | Teal lane. Screenshot is real, not clip-art. |
| **CourseCard** (mobile carousel) | thumb · title · duration+level chips · price-or-"Enquire" · Enroll | Swipeable row on mobile; grid on desktop. |
| **StatCard** | count-up number (aqua) · mono label | On navy proof band; `tabular-nums`. |
| **TestimonialCard** | quote · avatar · name/role | In marquee or grid. |
| **BentoTile** | variable span (1×1 / 2×1 / 2×2) · icon/graphic · short label | For "products we build" / features. Mixed sizes = visual interest without clutter. |
| **RoleCard** (careers) | title · type/location chips · Apply | Navy accent. |

**Interaction (desktop only):** OfferingCard/ProductCard get **subtle 3D tilt (≤6°, spring)** and **spotlight hover** (radial light follows cursor) on dark tiles. Off on touch + reduced-motion.

---

## 7. Animation details (the full motion system)

**Global rules:** transform/opacity only (GPU) · `whileInView once:true` · `prefers-reduced-motion` → all snap to final, marquees pause · animation JS code-split out of mobile hero critical path · targets: Lighthouse mobile ≥90, LCP<2.5s.

| # | Animation | Where | Params | Mobile | Reduced-motion |
|---|---|---|---|---|---|
| 1 | **SVG path-draw (signature)** | Hero motif (brain-tree), section dividers | `stroke-dashoffset 1→0`, 1.7s ease, per-path stagger +0.11s; nodes pop after (`ease-pop`, +0.08s) | simplified paths, keep | final drawn state |
| 2 | **Staggered text** | Hero headline only | words `translateY(26px)+opacity` → in, +0.06s/word, 0.6s | shorter | visible |
| 3 | **Fade/slide reveal** | Every section | `translateY(14–24px)+opacity`→in on scroll, 0.6–0.7s | yes | visible |
| 4 | **Count-up** | Stat band | 0→target, ~1.4s easeOut, starts when in view | yes | show final |
| 5 | **Infinite marquee** | Tech + client logos, testimonials | `translateX 0→-50%`, ~26s linear, duplicate track, pause on hover | yes (CSS) | paused |
| 6 | **Magnetic button** | Primary CTAs | pointer offset ×0.28/0.4, spring back on leave | OFF (touch) | off |
| 7 | **3D hover tilt** | Offering/product cards | max 6°, spring | OFF | off |
| 8 | **Spotlight hover** | Dark cards | radial-gradient follows cursor | OFF | off |
| 9 | **Sticky-scroll section** | Ecosystem loop (ONE place) — **full choreography §9a** | pin ~300vh, `scrollYProgress`→step index, sequential connector draw + node light-up + panel crossfade | vertical, no pin, connector draws on reveal | static stacked, loop final state |
| 10 | **Page transition** | Route changes | fade+slide 250ms | yes (light) | instant |
| 11 | **Bg gradient shift** | Hero ground only | 2-stop navy→teal, ~26s alternate | keep (cheap) | static |
| 12 | **Glassmorphism** | Sticky nav on scroll only | `backdrop-blur(10px)` + translucent navy | reduce/none | n/a |

**CUT (do not build) — these make it look AI-generated + hurt perf:** particle background, aurora background, mouse trail / cursor glow, blob morphing, text-scramble.

**Parallax:** hero motif layers only, ≤20px, desktop; off mobile.

### Signature motif spec (the tree)
SVG, `viewBox 0 0 400 470`. Open book (2 stroked page quads + spine) at bottom → trunk → branches ending in **node circles** → a few **brain-fold curves** on the left. Stroke = vertical gradient `#0F2F50 → #008088 → #00B4AE → #5BC3B9` (navy bottom → aqua top). Node dots mostly aqua, 2–3 deeper-amber (`#E08A2B`) highlights. Draws itself on load (anim #1). Reuse as: hero centerpiece, section dividers ("branches"), bullet markers (node dots), route-loading indicator.

---

## 8. Sitemap & routes

```
/                    Home
/solutions           hub (teal)    → /products, /products/:slug, /services, /data-ai, /work
/learn               hub (amber)   → /courses, /courses/:slug, /internships, /internships/:slug, /projects, /certifications
/careers             (navy)        → /careers/:slug
/about   /contact
utility: /enroll /apply /enquire (reusable LeadForm, can be modal)
```
Nav: desktop = `Solutions▾  Learn▾  Careers  About  [Contact CTA]` (mega-menus). Mobile = hamburger + **sticky bottom CTA bar** (Enroll/Enquire + WhatsApp), Learn listed first.

---

## 9. Homepage build — section by section

Order differs by platform on purpose (mobile is student-forward). Each block = reusable component.

| # | Section | Desktop | Mobile |
|---|---|---|---|
| 1 | Header | mega-menu + Contact CTA | logo + ☰; sticky bottom CTA bar |
| 2 | **Hero** | 2-col: staggered headline + CTAs (teal+amber) ‖ animated tree motif; gradient ground + faint circuit-dot grid | compact, motif smaller, 1 amber CTA above fold |
| 3 | Audience fork | 2 equal cards (Business teal ‖ Students amber) | stacked, **student card first** |
| 4 | Two-pillar split | side-by-side equal | stacked equal |
| 5 | Products we build | **bento grid** of product tiles (real UI shots) | swipe carousel |
| 6 | Ecosystem loop | **sticky-scroll**, 3 steps reveal (products⇄learners⇄projects) — **full spec in §9a** | vertical simplified — **§9a** |
| 7 | Proof band | navy, 4 count-up stats | 2×2 |
| 8 | Learn preview | after Solutions | **before Solutions**, swipe cards |
| 9 | Solutions preview | side-by-side w/ Learn | swipe cards |
| 10 | Trust | logo marquee + testimonials | marquee + swiper |
| 11 | Vision | short editorial block | short |
| 12 | Final CTA + LeadForm | dual CTA + phone-first form | + sticky bar persists |
| 13 | Footer | grouped links + IG/LinkedIn/WhatsApp, gradient | grouped |

---

## 9a. Ecosystem Loop — full spec (section 6, the differentiator)

**Why it exists:** this is the section that proves Meptrasoft is *one system*, not a tech company with a training side-hustle bolted on. It must read as an **interactive system, not a decorative illustration.** It carries the most narrative weight — build it to full fidelity, do not improvise.

### The narrative (3 steps, a closed loop)
A virtuous cycle. Order matters; it must return to the start.

| Step | Node | Headline | Body (voice: concrete) | Accent | Media |
|---|---|---|---|---|---|
| 1 | **Products** | "We build real AI products." | "SaaS and AI tools that paying clients use in production." | teal | product UI screenshot |
| 2 | **Learners** | "Students build on them." | "Interns and trainees ship features on those same live products — not toy exercises." | amber | photo: students/interns working |
| 3 | **Projects → back to Products** | "Their work ships. They get hired." | "Real contributions flow back into our products; job-ready engineers flow into the industry — and into our team." | aqua→teal | photo: shipped work / team |

The connector from Step 3 returns to Step 1 (closed loop) — visually a circular/looping path, drawn with the **signature path-draw** (ties to the brain-tree motif; connectors = "branches/roots").

### Layout & anatomy
- **Container:** full-bleed section, `--ink-900`/navy ground (this is a dark "moment" like the hero). Section padding per tokens.
- **Left (or center on narrower desktop):** the **loop diagram** — 3 nodes arranged in a triangle/ring, connected by curved SVG paths with directional flow (arrowheads or moving dash). Active node: larger + accent glow ring; inactive: dimmed to `--slate`.
- **Right:** a **step panel** — eyebrow ("01 / 03"), headline (H3), body, and the step's media (image/`ProductCard`-style tile). Panels crossfade as the active step changes.
- **Progress rail:** 3 ticks (top or side) showing step 1/2/3; current tick in the step's accent.

### Desktop behavior — sticky-scroll (the one pinned section on the site)
- Section **pins** (`position: sticky`, height ≈ `300vh` scroll distance). As the user scrolls the pinned range, `scrollYProgress` (Framer `useScroll`) maps to **step index 0→1→2**.
- Per step: previous connector path finishes drawing → next node lights (scale 1.15, accent glow, `ease-pop`) → step panel crossfades in (`opacity`+`translateY(16px)`, 0.4s). Loop's return-arc (3→1) draws on the final step so the ring visibly closes.
- After step 3 completes, section **unpins** and normal scroll resumes.
- Parallax allowed here (≤20px) on the diagram layer only.

### Mobile behavior — NO pin (perf + UX)
- Vertical stack: 3 step cards top-to-bottom, each = node badge + headline + body + image.
- Connector line **draws on scroll-reveal** between cards (short path-draw as each enters). No pinning, no scroll-hijack.
- A small looping arc icon at the bottom signals "returns to start" without the full pinned choreography.

### Motion params
- `useScroll({ target, offset:['start start','end end'] })` → `useTransform` to step index + per-path `pathLength`.
- Node light-up: scale 1→1.15, glow `box-shadow`/`filter` in accent, `ease-pop` 0.5s.
- Connector draw: `stroke-dashoffset 1→0`, 0.6s ease, sequential.
- Panel crossfade: 0.4s `ease`.
- **Reduced-motion / mobile-lite:** render all 3 steps **static and fully visible, stacked**, loop drawn in final state, no pin, no scroll-driven changes. The narrative must be fully readable with zero motion.

### Data model
```ts
type LoopStep = { id: string; node: 'products'|'learners'|'projects';
  eyebrow: string; title: string; body: string; accent: 'teal'|'amber'|'aqua'; media: ImageRef }
```
Section renders from `LoopStep[]` (length can change later — the diagram lays out N nodes on a ring). Component: `EcosystemLoop`.

### Acceptance for this section
- Reads as a **closed loop** (returns to start) on both platforms.
- No scroll-jank on mid Android (that's why mobile drops the pin).
- Fully legible with JS/motion disabled (static stacked fallback).

---

## 10. Component inventory (typed, reusable)
`AppShell` · `Header`/`MegaMenu` · `MobileNav` + `StickyCTABar` · `Hero` + `BrainTreeMotif` · `AudienceFork` · `PillarSplit` · `BentoGrid`/`BentoTile` · `EcosystemLoop` (sticky-scroll) · `StatBand`/`StatCard` (count-up) · `OfferingGrid`/`OfferingCard` · `ProductCard` · `CourseCard` · `RoleCard` · `Marquee` · `TestimonialCard` · `LeadForm` · `Reveal` (scroll wrapper) · `MagneticButton` · `TiltCard` · `SpotlightCard` · `Footer`. All fed by a **content model** (JSON/CMS-ready) so new offerings = new data, not new pages.

---

## 11. Content voice (enforce)
Concrete, believable, plain. **Every claim = a number, a name, or an outcome.**
**Banned:** "AI-powered future", "revolutionizing industries", "unlocking innovation", "transforming tomorrow", "cutting-edge", "next-gen synergy".
Example — ❌ "Revolutionizing education with AI" → ✅ "Interns ship features on products real clients use."

---

## 12. Assets needed (from client)
Sora font files · logo (have: `logo.svg`/`logo.png`) · **product UI screenshots** · photos (students, team, classroom, events, office) · client/partner logos · testimonials (quote+name+role) · real stats (currently claimed: 500+ trained, 10+ products, 200+ internships, 50+ models) · optional brand video (muted/autoplay/poster, ≤3MB, mobile fallback to poster).

---

## 13. Acceptance bar
- **Perf:** Lighthouse mobile ≥90; LCP<2.5s on mid Android; CLS<0.1; INP<200ms.
- **A11y:** WCAG AA color; keyboard + screen-reader for nav/forms/carousels; visible focus; `prefers-reduced-motion` honored.
- **Consistency:** verify navy + accents on ≥3 devices (budget laptop, phone, external monitor) — the teal-drift fix must hold.
- **Mobile-first:** built mobile→up, per-platform (not a shrunk desktop).
- **Not-generic:** none of the CUT effects; the tree motif is the through-line; real content + images; asymmetric editorial layout.
