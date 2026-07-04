# Deliverable 6 (part) — Motion, Media & Visual Language

> Goal: impressive, premium, **original** — NOT the generic AI-startup look.
> Every effect scored on: does it build *Meptrasoft's* identity, and does it hold 60fps on a mid Android?
> Magic MCP = inspiration for these at build (you connect it first); all restyled to our tokens, nothing copied.

---

## 0. The rule that decides everything

**Your signature is ONE ownable moment, not 24 borrowed effects.** Spend boldness in one place, keep the rest quiet (design principle). For Meptrasoft that moment is the **brain-circuit-tree-from-a-book drawing itself** (your logo, animated via SVG path-draw). Nobody else has that. Everything else supports it.

The fastest way to look AI-generated is to stack particles + aurora + glass + gradient-blobs. We are not doing that.

---

## 1. Effect audit — keep / limit / cut

### ✅ KEEP — original + performant (these ARE the design)
| Effect | Where | Why it earns its place |
|---|---|---|
| **SVG path drawing** | Hero logo-motif, section dividers as "branches" | The signature. Original to Meptrasoft. GPU-cheap. |
| **Staggered text** | Hero headline (word-by-word) | One high-impact reveal, then stop. |
| **Scroll reveal** (fade/slide/scale) | Every section, subtle | Standard, tasteful, `transform/opacity` only. |
| **Count-up numbers** | Proof band | Concrete proof animating = trust, not decoration. |
| **Infinite marquee** | Client / tech logos, testimonials | One row, pauses on hover + reduced-motion. |
| **Bento grid** | "Products we build", feature showcase | Shows range without a wall of cards. On-brand for a product company. |
| **Magnetic buttons** | Primary CTAs only, desktop | Subtle pull (≤8px). Premium micro-interaction, one context. |
| **3D hover tilt** | Offering cards, desktop | Max ~6°, spring-eased. Off on touch. |
| **Sticky scroll section** | Ecosystem loop only | Pin + reveal the 3 steps. One orchestrated moment. |
| **Smooth page transitions** | Route changes (multi-route) | Short fade/slide, 250ms. Ties the multi-page feel together. |
| **Spotlight hover** | Dark cards, desktop | Light follows cursor, low-cost radial-gradient. |

### 🟡 LIMIT — one context, not everywhere
| Effect | Allowed only as | Guard |
|---|---|---|
| **Glassmorphism** | Sticky nav on scroll + 1–2 overlays | `backdrop-blur` is expensive — never on long scrolling lists or mobile-wide areas. |
| **Parallax** | Hero motif layers, desktop | Tiny depth (≤20px). Disabled on mobile. |
| **Background gradient animation** | Hero ground only | Slow (~20s), 2-stop navy→teal, `will-change` off after. Not page-wide. |
| **Card stack** | Optional mobile treatment of one section | Only if it reduces scroll fatigue. |
| **Image wheel / circular gallery** | Product screenshots, desktop only | Heavy + poor on mobile → mobile falls back to swipe carousel. |

### ❌ CUT by default — AI-cliché and/or perf-killers (your own §3/§7)
| Effect | Why cut |
|---|---|
| **Particle background** | THE generic AI look. Perf cost. Directly violates "don't look like every AI company." |
| **Aurora background** | Same cliché family. At most one restrained instance — default off. |
| **Mouse trail / cursor glow** | Gimmick, no purpose, hurts "premium", desktop-only novelty. |
| **Blob animation** | Generic SaaS filler. Only reconsider if fused into the tree motif. |
| **Text scramble** | Hurts readability + a11y; screen-readers choke. Skip. |

---

## 2. Performance tiers (per-platform, non-negotiable)

**Desktop (full):** all KEEP + LIMIT effects.

**Mobile (budget):** path-draw (simplified), scroll-reveal, count-up, marquee (CSS-only), short staggered headline. **No** parallax, tilt, spotlight, particles, aurora, mouse effects; blur minimized.

**`prefers-reduced-motion`:** all motion → instant final state. Marquees pause. Non-negotiable a11y.

**Tech:** Motion (Framer Motion) with `whileInView` + `viewport={{once:true}}`; animate `transform`/`opacity` only; `LazyMotion` + code-split so animation JS isn't in the mobile hero critical path. Targets stay: Lighthouse mobile ≥90, LCP<2.5s.

---

## 3. Imagery plan (real photos, multiple places)

No stock-y AI clip-art. Real, specific, human (your §7 voice applies to images too).

| Slot | Content |
|---|---|
| Hero | The animated motif (not a photo) — keeps LCP light |
| Products | Real **product UI screenshots / mock dashboards** |
| Ecosystem loop | Photos: students at work, a shipped product, a live project |
| Learn preview | Classroom / lab / cohort, real faces |
| Solutions preview | Case-study thumbnails |
| Trust | Client + partner logos (marquee), headshots for testimonials |
| About/Careers | Team, office, events, hackathons |

**Rules:** WebP/AVIF + `srcset`; explicit width/height (no CLS); lazy-load below fold; art-directed crops for mobile vs desktop; subtle duotone/navy overlay on photos so they sit in the palette.

---

## 4. Video plan

| Placement | Spec |
|---|---|
| **Hero (optional) or Ecosystem section** | Short brand film / product montage, 8–15s |
| Product pages | Short product walkthrough clips |

**Rules:** `muted autoplay loop playsinline`, **poster image required**, `preload="none"`/lazy, ≤~2–3MB, H.264+WebM. **Mobile shows the poster or a lighter clip** — never block LCP with video. Respect reduced-motion + data-saver → static poster. A "play brand film" click-to-expand is the safest premium option.

---

## 5. Magic MCP component candidates (at build, restyled to tokens)
Bento grid · infinite marquee · 3D tilt card · spotlight card · animated/ magnetic CTA · sticky-scroll section. Pull for **structure/interaction ideas**, then reskin to Meptrasoft tokens + motif. Never ship a template look.

---

## 6. What "not AI-generated" actually means here
- One signature motif (the tree), used as the through-line — hero, dividers, bullets, loading.
- Restraint: 2–3 motion ideas repeated well > 24 effects sprinkled.
- Real content + real images + specific copy (no buzzwords).
- Asymmetric, editorial layout — not centered-everything, not rounded-card-with-accent-rail everywhere.
- Type does work: Sora with a real scale, tight display tracking, generous body.
