# Deliverable 1 — Strategy Review & Challenges

> Senior product-design pass over the brief + `BRAND_DESIGN_SYSTEM.md`.
> I am challenging decisions (mine and yours) where I think there's a stronger path.
> Nothing here is code. This gates the sitemap (Deliverable 2).

---

## Verdict up front

The strategy is solid on **brand, color, tokens, scalability**. It is **weak on the thing that matters most to you: converting two very different audiences who want two different things.** A single premium scrolling page treats them the same. Below are 10 issues, ranked by impact, each with a recommendation. The first four change the sitemap, so they need your call before I proceed.

---

## A. Issues that change the architecture (decide these first)

### A1. Single-page anchors fight your two-audience goal — **CHALLENGE (mine)**
My doc kept "single-page anchors, migrate to routes later." That's wrong for your business.
- Students and businesses want **different journeys** (your §2). One scroll funnel forces both down the same path.
- Google Search is a stated discovery channel; a single-page anchor app has **weak SEO** — each offering can't rank on its own URL.
- Scalability (5–10 yr, many products/courses) needs real pages, not more anchors.

**Recommendation:** build **multi-route from day one** — a small router. Home stays rich, but `/solutions`, `/learn`, `/careers`, and detail pages exist as real URLs. This is the single most important change vs the current plan.

### A2. "Company/vision-first hero" can lose the student — **CHALLENGE (mine)**
I said the hero leads with company + vision. But half your visitors are students on a phone from an Instagram link who want *a course, now*. A vision statement is friction for them.

**Recommendation: audience-aware entry.** Keep one premium brand hero, but put a **fast fork** high on the page — two clear paths, "For Students" / "For Business" — and on **mobile default to student-forward** ordering. Equal brand, but each audience reaches its lane in one tap. (Details in the journeys deliverable.)

### A3. Kill the 3D globe as the hero — **CHALLENGE (yours + mine)**
The current site's three.js globe is: (a) a **performance anchor** on Android (your §5, §7), and (b) **generic** — particles/globes are on every AI landing page, which violates "don't look like every AI company" (your §3).

**Recommendation:** drop the globe from the hero. Build an **original signature motif from YOUR logo** — the brain-circuit-tree-growing-from-a-book. Animate it lightly (SVG/CSS, GPU-only). That's ownable identity *and* fast. Globe, if kept at all, becomes a small desktop-only accent far down the page.

### A4. "Job seekers" are a third audience you've been folding into education — **CHALLENGE (yours)**
Deliverable 3 names three audiences: students, businesses, **job seekers**. My doc buried Careers under "Learn & Grow." But someone who wants a *job at Meptrasoft* is not a student who wants to *learn*. Different intent, different page, different CTA.

**Recommendation:** treat **Careers/Jobs as its own top-level destination** with its own short journey, not a child of the education funnel.

---

## B. Issues that change content & identity (strong recommendations)

### B5. "Equal branding vs student-revenue" is asserted, not solved
The doc says "hold the tension." A product designer resolves it. Concrete rule:
> **Equal brand shell, unequal funnel depth.**
> Nav, hero brand, footer, visual weight = perfectly equal between pillars. But the **student path is deeper and faster** (more entry points, sticky CTA, WhatsApp) because that's today's revenue. Businesses get an equally *premium* but *shorter* path. Brand stays 50/50; conversion effort follows the money — invisibly.

### B6. No "signature" = no memorability
Your §3 wants an unmistakable identity. Color + Sora alone won't do it — lots of edtech uses teal/amber/navy. Memorability needs a **recurring signature system**:
- The **circuit-tree** as a generative motif (section dividers as branches/roots; bullet points as node-dots; connectors between the two pillars as branching lines).
- One signature interaction (e.g., the tree "grows" as you scroll the ecosystem loop).
Used consistently, *that* is what people remember — not the palette.

### B7. Product-driven story is underweight (your §6)
You emphasized: Meptrasoft **builds its own products**, not just services. The current homepage plan treats products as one preview card. For an "innovation-driven company" perception (and enterprise trust), products deserve a **stronger, distinct showcase** — named products, what they do, screenshots/mock UI — separate from the services list.

### B8. Content voice spec is missing (your §7)
No buzzwords ("AI-powered future," "revolutionizing," "unlocking innovation"). The doc has no voice/tone rules, so a builder will default to exactly that. **Add a content spec:** concrete, believable, plain. Every claim backed by a number, a name, or an outcome. I'll include copy patterns in the homepage-sections deliverable.

---

## C. Minor / already-covered

### B9. Amber risk (mild)
Amber+teal+navy is a known edtech combo. Keep amber (it works, it's warm, it separates pillars) — but make identity original via **motif + layout (B6)**, not color. Color isn't where memorability comes from here.

### B10. Analytics as product (already noted, keep first-class)
Instrumentation on every CTA/form/WhatsApp click + UTM capture stays in scope. For a "product," this is not optional polish — it's how you learn which social channel pays.

---

## What I need from you (gates Deliverable 2 = sitemap)

1. **Architecture:** multi-route from day one (A1) — yes/no?
2. **Hero:** audience-fork entry + mobile student-forward (A2) — yes/no?
3. **Globe:** replace with original logo-derived motif (A3) — yes/no?
4. **Careers:** its own top-level destination (A4) — yes/no?

Once these are settled, I build: **Sitemap & nav → User journeys (student / business / job seeker) → Homepage sections & purpose → Lo-fi wireframes (mobile + desktop) → Hi-fi visual system → your review.**
