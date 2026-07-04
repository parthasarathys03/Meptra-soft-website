# Desktop + Performance/Accessibility Audit

Real Lighthouse run (mobile, simulated throttling) against `npm run build && npm run preview` on
`localhost:4173`, headless Chrome. Not a lab estimate — actual measured scores below.

## Lighthouse — mobile, real run
| Category | Score |
|---|---|
| Performance | **86–89** (2 runs, normal variance) |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **92** |

| Metric | Value |
|---|---|
| First Contentful Paint | 2.7–2.9 s |
| Largest Contentful Paint | 2.8–3.1 s |
| Total Blocking Time | 40–70 ms |
| Cumulative Layout Shift | 0–0.046 |
| Speed Index | 4.3–4.6 s |

Target was ≥90 Performance / LCP<2.5s — close but not fully there. TTFB is 10ms and there are no
render-blocking resources, so the remaining FCP/LCP cost is mostly JS parse/hydrate time on a
throttled mobile CPU simulation, not network.

## Experiment: LazyMotion code-splitting — tried, reverted (measured worse)
Lighthouse flagged 57% unused JS in the framer-motion chunk. Tried `LazyMotion` + async `domMax`
import to defer it off the critical path. **Result was worse, not better**: Performance 86→82,
Total Blocking Time 40ms→290ms. Cause: Hero animates immediately on load, so the dynamic import
added a network round-trip right in the critical rendering path — for an above-the-fold,
animate-on-load hero, eager bundling beats lazy-loading despite the extra bytes. Reverted to plain
eager `motion` imports (confirmed back to baseline via a third Lighthouse run: 89 performance,
70ms TBT). The "unused JS" flag was partly a false economy — much of that code activates on
hover/tap/exit, which a load-only audit can't see as "used".

## Desktop layout — verified at 1440×900 (DOM computed styles)
| Element | Result |
|---|---|
| Desktop nav | `display: flex` (visible) ✅ |
| Mobile hamburger | `display: none` on desktop ✅ |
| Hero grid | 2 columns (≈567 / 513) ✅ |
| Audience fork | 2 equal columns (542 / 542) ✅ |
| Bento products | 4 columns ✅ |
| Capsule header + glass | renders over hero & dark sections ✅ |

All `md:` breakpoints resolve correctly; mobile stacks, desktop uses multi-column.

## Accessibility — in-page checks (passing)
- Images missing `alt`: **0**
- Buttons with no accessible name: **0** (icon-only buttons carry `aria-label`)
- Links with no accessible name: **0**
- `<h1>` count: **1** (correct)
- `<html lang>`: `en`
- Landmarks: header, main, footer, nav all present
- Global `:focus-visible` ring; `prefers-reduced-motion` fully honored (CSS + Framer)
- Decorative SVG/grid marked `aria-hidden`; brand motif has `role="img"` + label

## Performance — production bundle (gzip)
| Chunk | gzip |
|---|---|
| CSS | 12.8 kB |
| index (app) | 44.7 kB |
| motion (framer-motion) | 41.4 kB |
| router | 52.9 kB |
| per-route pages | 0.3–0.9 kB each |

Initial JS ≈ **137 kB gzip**. Good for a motion-rich site. Wins already in place:
- Route-level code splitting (`React.lazy`); framer + router split into own chunks
- Images `loading="lazy"` + `decoding="async"`; fixed-height containers → no layout shift
- Fonts: `preconnect` + `display=swap`; Sora only
- FontAwesome tree-shaken (only used icons bundled)
- `theme-color` + `color-scheme` meta added

## Known follow-ups
1. **Get Performance from ~87 to ≥90**: try `content-visibility:auto` on below-fold sections
   (cheap, no risk) before touching motion again. Re-measure with Lighthouse after each change —
   the LazyMotion lesson above shows perf work here needs verification, not assumption.
2. **Real assets**: swap Unsplash placeholders (product screenshots, team photos) + add the brand video.
3. **21st.dev Magic MCP**: connected and confirmed live (tools loaded after restart).
4. SEO is 92, not 100 — check Lighthouse's SEO audit list for the specific flagged item(s).
