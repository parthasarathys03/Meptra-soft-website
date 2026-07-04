# Meptrasoft AI Technologies — Brand & Design System

> Redesign spec. Plan stage — no implementation. Hand this to a builder.
> Logo is fixed; this system is built to sit inside the logo's existing DNA.

---

## 1. Strategy in one line

**We build AI products, and we train the engineers who build them.**

Two equal pillars, one brand:

- **Pillar 1 — Solutions**: AI Products & Technology Services (B2B)
- **Pillar 2 — Learn & Grow**: Education, Internships, Careers (B2C)

Differentiator (the spine of every page): learners train on the **real products we ship**. Business and education feed each other. This is the visual and narrative center of gravity.

The logo already encodes this: a **brain-circuit tree** (AI) **growing from an open book** (education). Design should reinforce that metaphor, not fight it.

### 1.1 Business reality that drives every decision

Both pillars get **equal branding**, but the money today comes from **students**. Revenue drivers, in priority order:

1. Professional Courses
2. Paid Internships
3. Free Internships (funnel → paid services)
4. Final Year Projects
5. College Projects
6. Certification Programs

**The tension to hold:** look like a **premium AI technology company** (for the 50% enterprise audience + credibility), while **converting students** into inquiries/registrations/enrollments (the 50% that pays now). Never read as "just a training institute."

Every design/UX decision is scored against four goals: **Business growth · Brand identity · UX (per-platform) · Scalability (5–10 yr).**

### 1.2 Audience split (design for both, equally)

- **50% Students & fresh graduates** — arrive on **mobile**, from Instagram / WhatsApp / LinkedIn / Google / social links. Want: excitement, proof it works, fast path to enroll.
- **50% Businesses & clients** — want: trust, capability, enterprise polish.

The site must feel **trustworthy to enterprise** and **exciting to students** at the same time. This is the hardest balance and it is non-negotiable.

---

## 2. The color problem & the decision

**Problem:** the current teal `#01808E` renders inconsistently across monitors. It is a saturated cyan-teal at ~50% lightness — the exact region where uncalibrated panels drift most (green on one screen, blue on another). The fault is not the hue; it is **using teal as a large field color**, which makes the drift obvious.

**Decision (approved):**
1. **Navy is the dominant brand color.** Fields, headers, footers, body text. Deep low-saturation navy is stable on every display.
2. **Teal / aqua are accents only** — CTAs, links, icons, data viz, gradient edges. Small areas → drift stops mattering.
3. **Amber is the Education-pillar accent** — warm counterpart to teal, replaces the old generic orange.
4. **Logo is untouched.** Its exact hexes are preserved and reused.

---

## 3. Color tokens

### 3.1 Ink / Navy ramp — the workhorse (surfaces, text, structure)

| Token | Hex | Use |
|---|---|---|
| `--ink-900` | `#0B1F38` | Darkest text, deepest backgrounds |
| `--navy-800` | `#0F2F50` | **Brand navy** (from logo). Primary dark surfaces, headings |
| `--navy-700` | `#164761` | Secondary dark surface, hovers on dark |
| `--slate-500` | `#5C7085` | Muted text, captions, meta |
| `--line-200` | `#DCE4EC` | Borders, dividers, card outlines |
| `--bg-50` | `#F5F8FA` | Page background (light) |
| `--surface` | `#FFFFFF` | Cards, panels |

### 3.2 Teal / Aqua ramp — accents (Pillar 1 signature)

| Token | Hex | Use |
|---|---|---|
| `--teal-700` | `#0A6E78` | **Teal text/links** — only teal that passes WCAG AA for small text on white |
| `--teal-600` | `#008088` | Primary teal fills (buttons, active states) |
| `--teal-500` | `#0A9CA0` | Hover/lighter fills |
| `--aqua-400` | `#00B4AE` | Icons, highlights, gradient mid |
| `--aqua-300` | `#5BC3B9` | Gradient end, subtle tints |

### 3.3 Amber ramp — Education accent (Pillar 2 signature)

| Token | Hex | Use |
|---|---|---|
| `--amber-600` | `#E08A2B` | Amber text/strong accents (better contrast) |
| `--amber-500` | `#F5A623` | Primary amber fills, Learn-pillar CTAs |
| `--amber-300` | `#F5B84E` | Highlights, gradient end |

### 3.4 Gradient & semantic

| Token | Value |
|---|---|
| `--gradient-hero` | `linear-gradient(120deg, #0B1F38 0%, #0F2F50 30%, #008088 70%, #00B4AE 100%)` |
| `--gradient-learn` | `linear-gradient(120deg, #164761 0%, #0F2F50 40%, #E08A2B 100%)` |
| `--success` | `#1E9E6A` |
| `--warning` | `#E0A020` |
| `--error` | `#D64545` |

### 3.5 Contrast rules (non-negotiable)

- Body/small text: use `--ink-900`, `--navy-800`, or `--slate-500` on light; white on `--navy-800`+.
- Teal text only via `--teal-700`. Never `--teal-500`/`--aqua-400` on white for text.
- Amber text only via `--amber-600`. `--amber-500` is a fill, not a text color on white.
- Target WCAG AA (4.5:1 body, 3:1 large/UI). Verify every accent-on-surface pair.

### 3.6 Cross-device consistency (why these values, not prettier ones)

Requirement: colors must look the same on cheap laptops, phones, monitors, OLED/LCD panels.

- **Stay in sRGB.** No `display-p3` / wide-gamut-only colors — they shift or clip on standard panels.
- **Large surfaces use low-saturation navy/neutral** — the stable zone. Saturated cyan/teal is confined to small accents where drift is invisible.
- **No pure `#00FFxx`-type saturated cyans as fills.** The chosen teals sit below max saturation on purpose.
- **Test protocol:** sign-off requires viewing on ≥3 devices (one budget laptop, one phone, one external monitor). If navy + accents hold across all three, ship. This is the primary acceptance test for the redesign.

---

## 4. Pillar signaling

One brand, two readable halves. Everything shares navy + neutrals + type. **Only the accent hue changes:**

- **Solutions pages / blocks → teal accent** (`--teal-600` / `--aqua-400`)
- **Learn & Grow pages / blocks → amber accent** (`--amber-500` / `--amber-600`)

A visitor always knows which half they are in from the accent, without a second brand appearing. Keep the accents **equal in prominence** — neither pillar gets more color, size, or nav priority.

---

## 5. Typography

- **Family: Sora** (already the logo font — keep it; it is distinctive and on-brand). Loaded via `<link>` in `index.html`.
- Fallback stack: `'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.

| Role | Size (desktop) | Weight | Line-height |
|---|---|---|---|
| Display / hero | 56–64px | 700 | 1.05 |
| H1 | 40px | 700 | 1.1 |
| H2 | 30px | 600 | 1.2 |
| H3 | 22px | 600 | 1.3 |
| Body-lg | 18px | 400 | 1.6 |
| Body | 16px | 400 | 1.6 |
| Caption/meta | 13px | 500 | 1.4 |
| Eyebrow/label | 12px | 700 | 1.4, `letter-spacing: .06em`, uppercase |

Fluid scaling with `clamp()` for mobile. Max text measure ~68ch.

---

## 6. Spacing, radius, elevation

- **Spacing scale (px):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Section vertical padding 96–128 desktop, 56–72 mobile.
- **Radius:** `--r-sm 8px` · `--r-md 14px` (cards) · `--r-lg 24px` (feature panels) · `--r-pill 100px` (buttons/tags).
- **Elevation (subtle, flat-leaning):**
  - `--shadow-card: 0 2px 12px rgba(11,31,56,.06)`
  - `--shadow-hover: 0 14px 34px rgba(11,31,56,.10), 0 3px 10px rgba(11,31,56,.05)`
- **Motion:** `--ease: cubic-bezier(.25,.8,.25,1)`; durations 150ms (micro) / 300ms (transitions). Respect `prefers-reduced-motion`.

---

## 7. Component rules

- **Buttons**
  - Primary (Solutions): `--teal-600` fill, white text, pill.
  - Primary (Learn): `--amber-500` fill, `--ink-900` text, pill.
  - Secondary: navy outline, navy text, transparent fill.
  - Ghost: text + accent underline on hover.
- **Cards**: white surface, `--line-200` border, `--r-md`, `--shadow-card`; on hover lift to `--shadow-hover`. Accent = a top border or icon tint in the pillar color.
- **Nav (header)**: two parent groups — **Solutions** and **Learn & Grow** — each a dropdown/mega-menu. Sticky, navy-on-white, active section highlight preserved (keep the existing IntersectionObserver contract). One primary CTA far right.
- **Section eyebrows**: uppercase label in the pillar accent color above each H2.
- **Stat / proof band**: navy background, aqua numerals, count-up on scroll (reuse existing counter pattern).
- **Footer**: `--gradient-hero`, white text, grouped links by pillar.

---

## 8. Information architecture

Collapse today's flat 13-section sprawl into **two labeled tracks under one nav**.

```
Home
├─ Solutions  (teal)
│   ├─ AI Products
│   ├─ Technology Services
│   ├─ Data & BI
│   └─ Case Studies / Work
├─ Learn & Grow  (amber)
│   ├─ Training Programs
│   ├─ Internships
│   ├─ Academic Projects (Final Year / IEEE / Mini)
│   └─ Careers & Placement
├─ About / Vision   (shared)
└─ Contact          (shared)
```

Nav shows **two parent groups**, not 13 peers. Keep the section-id / navItems / anchor-href sync contract already documented in CLAUDE.md.

---

## 9. Homepage wireframe (top → bottom)

1. **Hero** — eyebrow, headline ("We build AI products, and train the engineers who build them"), subline naming both audiences, **dual CTA**: `Explore Solutions` (teal) + `Start Learning` (amber). Right side: the logo's brain-tree motif or the existing 3D globe.
2. **Two-pillar split** — two equal cards side by side (teal | amber), each with a one-line promise + 3–4 sub-links. This is the IA made visual.
3. **Ecosystem loop** — the differentiator. A simple loop diagram: Products ⇄ Learners ⇄ Real Projects. "Our students build on the products our clients use."
4. **Proof band** — navy background, count-up stats (AI models deployed, engineers trained, products shipped, internships completed).
5. **Solutions preview** (teal) — 3–4 flagship products/services, link to Solutions.
6. **Learn & Grow preview** (amber) — training tracks + internship tiers, link to Learn.
7. **Trust** — client/partner logos, testimonials, certifications.
8. **Vision** — short statement block, navy or gradient.
9. **Contact + dual CTA** → **Footer** (gradient).

---

## 9a. Mobile homepage (designed first, not a shrunk desktop)

Mobile is the **primary** canvas — most students arrive here. Desktop and mobile **may differ**; optimize each. Mobile order & patterns:

1. **Hero (mobile)** — compact. Headline + subline + **one** primary CTA (`Start Learning`, amber) above the fold; `Explore Solutions` secondary below. **No heavy 3D globe** — use a lightweight animated brain-tree SVG or a static hero image (see Performance §13).
2. **Sticky bottom CTA bar** — persistent, thumb-reachable: `Enroll / Enquire` + a **WhatsApp** quick-contact button (students discover via WhatsApp). This is the top conversion lever on mobile.
3. **Two-pillar split → stacked cards** (teal, then amber), full-width, tappable.
4. **Ecosystem loop** — simplified vertical diagram, no parallax.
5. **Proof band** — 2×2 stat grid, count-up on scroll.
6. **Learn & Grow preview FIRST on mobile** (amber) — swipeable horizontal card carousel of courses/internships. On mobile the student offering surfaces earlier than on desktop (business goal), while branding stays equal.
7. **Solutions preview** (teal) — swipeable cards.
8. **Trust** — logo strip + 1–2 testimonials in a swiper.
9. **Contact / lead form** — short, above footer.

**Mobile interaction rules:** touch targets ≥44px; swipe for card rows (no hover-dependent reveals); collapse nav to a bottom-anchored or hamburger menu with the two pillar groups; sticky CTA never overlaps content (pad the last section).

**Desktop differences (allowed & encouraged):** multi-column pillar split, optional 3D globe hero, hover states, larger editorial whitespace, mega-menu. Same content model, different composition.

---

## 10. Technical stack & migration (build stage — not now)

### 10.1 Official stack
- **React + Vite + TypeScript** (current repo is JS → migrate, see 10.2)
- **Tailwind CSS** (v4, `@tailwindcss/vite` already present) — design tokens (§3/§5/§6) become Tailwind theme + CSS variables
- **shadcn/ui** — accessible headless component base (Radix under the hood); style to Meptrasoft, don't ship default look
- **Motion (Framer Motion)** — animations, within the perf budget (§13): transform/opacity only, `prefers-reduced-motion`, no motion in mobile hero critical path
- **21st.dev Magic MCP** — **inspiration only**, never copy templates. Original components that reflect Meptrasoft.
- **Multi-route** (approved) — router (React Router or TanStack Router) per sitemap in `UX_ARCHITECTURE.md`.

### 10.2 Migration approach (decision pending)
Current repo: JS, no TS, no shadcn, no Motion, single-page. Two paths:
- **Fresh scaffold (recommended):** new Vite React-TS app, add Tailwind/shadcn/Motion/router clean, port content/assets over. Cleaner, no legacy Vite-template cruft, TS from line one.
- **Convert in place:** rename to `.tsx`, add tsconfig, retrofit. Faster start, carries legacy baggage.

### 10.3 Carry over / retire
- **Keep:** Sora font, logo assets, Vite `manualChunks` idea, the design tokens (§3), section content/copy (rewritten per voice spec §D4).
- **Retire:** three.js globe hero (→ original logo-motif, approved A3), `--orange #E8744A` (→ `--amber-*`), single-page anchor nav (→ routes), leftover Vite-template files (`index.css`, `App.css`).
- **Rebuild:** all sections as reusable typed components; nav as mega-menu + mobile sticky CTA bar.

### 10.4 Quality bars
- **Accessibility:** shadcn/Radix a11y preserved; WCAG AA color (§3.5); keyboard + screen-reader paths on nav, forms, carousels.
- **Performance:** perf budget §13 (Lighthouse mobile ≥90, LCP<2.5s). Code-split routes; lazy-load heavy sections.
- **Mobile-first:** build mobile layout first, desktop as enhancement (per-platform, §9a).
- **Reusability:** typed component library (`<OfferingCard>`, `<LeadForm>`, `<SectionShell>`, etc.) — content-model driven (§14).
- **QA:** manual pass across 3+ devices to confirm the teal-drift fix (§3.6).

---

## 11. Open items to confirm at build time

- Exact flagship products/services to feature (need real content).
- Real stats for the proof band (current site claims 50+ models / 500+ trained / 10+ products / 200+ internships — confirm).
- Testimonials / client logos availability.
- Whether the hero keeps the 3D globe or moves to the brain-tree motif.

---

## 12. Conversion strategy (student-first, without looking like a training institute)

Goal: turn visitors into **inquiries → registrations → enrollments**, while the top-level brand still reads "AI technology company."

**How brand stays premium while pushing student conversion:**
- Homepage hero speaks **company + vision** first (both audiences). Student offers appear as a strong, equal lane — not the headline. Enterprise sees a tech company; students see a clear path in.
- Education blocks use the **amber** accent and outcome language ("build real products," "get placed," "earn a certificate") — aspirational, not brochure-y.

**Conversion mechanics (build these in):**
- **Primary student CTAs everywhere they matter:** `Enroll`, `Apply for Internship`, `Book a Free Consultation`, `Get Project Help`. Amber, pill, unmissable.
- **Sticky mobile CTA bar** + **WhatsApp** click-to-chat (primary channel for this audience). Optional Instagram/LinkedIn links in footer.
- **Low-friction lead capture:** short form (name, phone, interest) — phone-first, since students convert over call/WhatsApp. Reusable `<LeadForm>` component, embeddable in any section.
- **Free → paid funnel:** free internship / free consultation as the entry offer, with a clear next step to paid programs.
- **Trust accelerators near CTAs:** stats, testimonials, certificate/placement proof, cohort counts.
- **Course/internship cards** carry: duration, level, outcome, price-or-"enquire", and a direct CTA.

**Measurement hooks (plan for, not build now):** event tracking on every CTA, form submit, WhatsApp click; UTM capture for Instagram/LinkedIn/Google traffic so social campaigns are attributable.

---

## 13. Performance budget (fast > fancy)

Premium feel **must not** cost speed. Students on mid-range phones and mobile data are the judge.

**Targets:**
- Lighthouse mobile ≥ 90 (perf).
- LCP < 2.5s on 4G mid-tier phone. CLS < 0.1. INP < 200ms.
- Initial JS (mobile) kept lean; heavy libs code-split and **not shipped to mobile hero**.

**Rules:**
- **3D globe (three.js) = desktop-only, lazy, below-the-fold or opt-in.** Mobile hero uses a lightweight animated **SVG/CSS brain-tree** or static image. Never block mobile first paint on WebGL.
- **Animations: transform/opacity only** (GPU-accelerated). No animating layout props (width/height/top/left). Respect `prefers-reduced-motion`.
- Every animation must earn its place — enhance comprehension or delight, never decorate. If it doesn't help the user act, cut it.
- Images: responsive `srcset`, modern formats (WebP/AVIF), lazy-load below fold, explicit dimensions (no CLS).
- Fonts: preload Sora subset, `font-display: swap`.
- Keep Vite `manualChunks` splitting; add per-route/section lazy loading as the site grows.

---

## 14. Scalability (built for 5–10 years)

The site must absorb new products, services, courses, internships, research, community, events, hackathons, launches — **without another full redesign**.

**Structural principles:**
- **Content-model driven.** Products, Services, Courses, Internships, Projects, Events = repeatable data shapes rendered by generic components (`<OfferingCard>`, `<OfferingGrid>`, `<DetailPage>`). Adding an offering = adding data, not a new bespoke page.
- **CMS-ready.** Even if content is hardcoded now, model it so a headless CMS (or JSON) can feed it later. No copy baked into layout components.
- **Section registry.** Homepage sections are ordered, lazy-loaded, config-driven (already the App.jsx pattern) so new sections slot in by order, not surgery.
- **Two-pillar IA has room to grow:** each pillar is a category that can gain children (Research, Community, Events under Learn; new product lines under Solutions) without breaking nav.
- **Token-based theming.** All color/space/type via CSS variables (§3, §5, §6) — a rebrand or sub-brand is a token swap, not a rewrite.
- **URL/routing plan:** currently single-page anchors. As depth grows, plan a migration path to real routes (`/solutions/...`, `/learn/...`) — design IA (§8) already maps cleanly to routes when that day comes.

---

## 15. The four-goal scorecard (apply to every decision)

Before shipping any screen/component, check it against all four:

| Goal | Question |
|---|---|
| **Business growth** | Does this move a student toward enroll/enquire, or a client toward contact? Is a CTA reachable? |
| **Brand identity** | Does it read premium AI company + equal education ecosystem? Not "just a training institute"? |
| **User experience** | Is it designed *for this platform* (mobile-first, per-device), fast, and accessible? |
| **Scalability** | Is it data/token-driven so it survives 5–10 years of new offerings without a redesign? |
