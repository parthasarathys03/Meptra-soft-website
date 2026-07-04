# UX Architecture — Deliverables 2–4

> Built on the approved decisions: multi-route · audience-fork hero (mobile student-forward) · original logo-motif hero · Careers as its own destination.
> No code. Feeds the wireframes (Deliverable 5).

---

# Deliverable 2 — Sitemap & Navigation

## 2.1 Sitemap (multi-route)

```
/                             Home
│
├─ /solutions                 Pillar 1 hub · TEAL · business-facing
│   ├─ /solutions/products        AI products we build (showcase)
│   │   └─ /solutions/products/:slug   product detail
│   ├─ /solutions/services         technology services
│   ├─ /solutions/data-ai          data engineering, BI, AI solutions
│   └─ /solutions/work             case studies / portfolio
│
├─ /learn                     Pillar 2 hub · AMBER · student-facing
│   ├─ /learn/courses             professional courses (list)
│   │   └─ /learn/courses/:slug       course detail → enroll
│   ├─ /learn/internships         internship tiers (free/paid/live/research)
│   │   └─ /learn/internships/:slug   internship detail → apply
│   ├─ /learn/projects            final-year / IEEE / mini / college
│   └─ /learn/certifications      certificate programs
│
├─ /careers                   Job seekers · NAVY · own destination
│   └─ /careers/:slug             role detail → apply
│
├─ /about                     vision, ecosystem, team, story
└─ /contact                   contact + lead form

Utility (modals or light routes): /enroll · /apply · /enquire (reusable LeadForm)
```

**Why this shape:** each offering owns a URL → ranks on Google (your discovery channel), scales to unlimited products/courses without redesign (content-model driven, §14 of design system), and gives each audience a clean lane.

## 2.2 Navigation

**Desktop header (sticky):**
`[Logo]   Solutions ▾   Learn ▾   Careers   About        [Contact ▸ (CTA)]`
- **Solutions ▾** and **Learn ▾** = mega-menus (grouped children + one featured item).
- Careers, About = plain links. Contact = single primary CTA, far right.
- Active-route highlight in the pillar accent (teal on Solutions, amber on Learn).

**Mobile:**
- Top bar: `[Logo]  [☰]`. Menu is full-screen, two pillar groups + Careers/About/Contact.
- **Persistent bottom CTA bar** (highest conversion lever): `Enroll / Enquire` (amber) + **WhatsApp** button. Always thumb-reachable, never overlaps content.
- Mobile nav order is **student-forward**: Learn surfaces before Solutions in the menu (brand still equal; funnel depth follows revenue — rule B5).

**Footer (all pages):** grouped by destination (Solutions / Learn / Careers / Company) + social (Instagram, LinkedIn, WhatsApp) + legal. Gradient background.

---

# Deliverable 3 — User Journeys

Three audiences, three intents. Brand shell is identical for all; **funnel depth differs** (rule B5: equal brand, unequal funnel).

## 3.1 Student & fresh graduate  ·  primary revenue  ·  mobile

| Stage | Detail |
|---|---|
| **Source** | Instagram / WhatsApp / LinkedIn / Google → lands on **mobile** |
| **Entry** | Home hero → mobile is **student-forward**; one tap to `/learn` (or picks "For Students" fork) |
| **Explore** | Swipeable course/internship cards → each card: duration · level · outcome · price-or-"enquire" · CTA |
| **Detail** | `/learn/courses/:slug` — outcomes, curriculum, "build real products," cohort proof, certificate |
| **Trust** | Cohort counts, testimonials, placement/certificate proof, ecosystem loop |
| **Convert** | `Enroll` / `Apply for Internship` / `Get Project Help` / `Book Free Consultation` → **phone-first short form** or **WhatsApp** |
| **Safety net** | Sticky bottom CTA always present; free internship / free consult as low-friction entry → paid |
| **Drop-off risks** | Slow load on Android (→ perf budget), buried course path (→ student-forward), long forms (→ phone+WhatsApp only) |

## 3.2 Business & client  ·  50% of audience  ·  often desktop

| Stage | Detail |
|---|---|
| **Source** | Google / LinkedIn / referral → often **desktop** |
| **Entry** | Home hero → "For Business" fork → `/solutions` |
| **Explore** | **Products we build** (proof we're product-driven, your §6) → services → `/solutions/work` case studies |
| **Detail** | Product/service pages: what it does, who it's for, outcomes, tech stack |
| **Trust** | Client logos, case studies with numbers, expertise, enterprise polish |
| **Convert** | `Book a Consultation` / `Contact Sales` / `Request Proposal` — shorter, premium path |
| **Drop-off risks** | Looking like a training institute (→ products/services lead the Solutions lane; premium visual weight) |

## 3.3 Job seeker  ·  third audience  ·  LinkedIn

| Stage | Detail |
|---|---|
| **Source** | LinkedIn / careers link / referral |
| **Entry** | `/careers` directly (own destination — not buried in Learn) |
| **Explore** | Open roles list (filter by team/level) |
| **Detail** | `/careers/:slug` — role, team, "build real products," growth, culture |
| **Convert** | `Apply` — resume + short form |
| **Note** | Distinct from students: intent is *get hired*, not *learn*. Own CTA, own tone. |

---

# Deliverable 4 — Homepage sections & purpose

Every section justified against the four goals (**B**rand · **U**X · **C**onversion · **S**cale). Mobile vs desktop noted. Content voice = concrete, no buzzwords (your §7).

| # | Section | Purpose | Mobile vs Desktop |
|---|---|---|---|
| 1 | **Header / nav** | Wayfinding; single primary CTA | Desktop mega-menus · Mobile hamburger + sticky bottom CTA bar |
| 2 | **Brand hero** | First "wow"; who we are in one line; **original logo-motif** animation (brain-tree from book) | Desktop: large motif + headline side-by-side · Mobile: compact, motif smaller/lighter, one CTA above fold |
| 3 | **Audience fork** | Route the two audiences fast: `For Students` (amber) / `For Business` (teal) + small Careers link | Desktop: two big equal cards · Mobile: student card first, stacked |
| 4 | **Two-pillar split** | Show equal identity — one company, two halves | Desktop: side-by-side · Mobile: stacked, equal size |
| 5 | **Products we build** | Prove **product-driven** (your §6) — named products, what they do, mock UI | Desktop: feature grid · Mobile: swipe carousel |
| 6 | **Ecosystem loop** | The differentiator: learners build on real products; business + education feed each other | Desktop: horizontal loop diagram · Mobile: vertical, simplified, no parallax |
| 7 | **Proof band** | Trust for both audiences: models deployed, engineers trained, products shipped, internships done | Desktop: 4-across count-up · Mobile: 2×2 grid |
| 8 | **Learn preview** | **Student conversion** — top courses/internships + CTA | **Appears before Solutions on mobile** · after on desktop; swipe cards on mobile |
| 9 | **Solutions preview** | Business conversion — flagship services + case study teaser | Desktop grid · Mobile swipe |
| 10 | **Trust / social proof** | Client logos, testimonials, certificates | Desktop strip · Mobile swiper |
| 11 | **Vision** | Long-term brand, "why we exist" (specific, not buzzwords) | Short block both platforms |
| 12 | **Final CTA + lead form** | Last conversion catch: dual CTA + phone-first form | Full-width both; mobile keeps sticky bar too |
| 13 | **Footer** | Wayfinding, social (IG/LinkedIn/WhatsApp), legal | Grouped, gradient |

## 4.1 Content voice spec (your §7 — enforced)

**Banned:** "AI-powered future," "revolutionizing industries," "unlocking innovation," "transforming tomorrow," "cutting-edge," "next-gen synergy."

**Rule:** every claim carries a **number, a name, or an outcome.**

| ❌ Generic | ✅ Meptrasoft |
|---|---|
| "Revolutionizing education with AI" | "Interns ship features on products real clients use." |
| "Unlocking innovation for businesses" | "We build OCR and document-intelligence tools that cut manual data entry." |
| "Empowering the next generation" | "500+ engineers trained. Many now build our products." |
| "Cutting-edge AI solutions" | "AI exam-intelligence and placement-prep products, built in-house." |

Tone: plain, confident, specific. Speak to a 20-year-old student and a CTO in the same clear sentences.

---

## Next (Deliverable 5): low-fidelity wireframes — mobile first, then desktop
Boxes-and-labels layout for the homepage + one key inner page per audience (a course detail, a product detail, a role detail). Rendered so you can see structure before any visual polish. Say go and I'll build them.
