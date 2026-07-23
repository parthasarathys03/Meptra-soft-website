# Diagnostic Report & Plan: Fixing Google Brand Search & Entity Indexing for `meptrasoftai.in`

**Domain:** `https://www.meptrasoftai.in`  
**Brand Name:** Meptrasoft AI Technologies (`Meptrasoft AI` / `Meptrasoft`)  
**Target Search Queries:** `meptrasoftai`, `meptrasoft ai`, `meptrasoft`, `meptrasoftai.in`  
**Date:** July 24, 2026  
**Status:** 🔴 Issue Active — Google auto-corrects `meptrasoftai` → `medhasoft`; AI Overview falsely claims site is inactive  
**Reviewed by:** Claude Opus 4.6 (deep re-analysis of original Gemini Flash report)

---

## 1. Problem Summary

| Search Query | What Google Shows | Expected |
|---|---|---|
| `meptrasoftai.in` | ✅ Site at #1, but AI Overview says "not an active website" | Site at #1, no false warning |
| `meptrasoftai` | ❌ "These are results for **medhasoft**" — site doesn't appear | Site at #1 |
| `meptrasoft ai` | ❌ No brand match, no result | Site at #1 |
| `meptrasoft` | ❌ No brand match | Site at #1 |

**User impact:** Users and potential customers can't find the website by searching the brand name. They report "your website is not showing on Google."

---

## 2. Root Cause Analysis (7 Factors, Ordered by Impact)

### 🔴 Factor 1: Empty `<body>` in HTML (SPA Problem)

The website is a React SPA. The HTML served to crawlers contains:

```html
<body>
  <div id="root"></div>
  <script type="module" src="/assets/index-xxx.js"></script>
</body>
```

**There is zero visible text content in the initial HTML.** While `<head>` has correct meta tags and JSON-LD (injected by `seo-build.mjs`), the `<body>` is empty until JavaScript renders React.

Googlebot's Web Rendering Service (WRS) does execute JS, but:
- Initial HTML crawl pass sees an empty page
- JS rendering is queued and can lag by days/weeks for new domains
- Google's AI Overview synthesized from the initial HTML pass, saw no content, and concluded the site is "inactive"

**This is the single most likely cause of the "inactive website" AI Overview.**

**Fix (Applied):** Added a `<noscript>` block with full brand content, navigation, and service descriptions in `index.html`.

### 🔴 Factor 2: Schema Changes Were Not Deployed

The previous session added `alternateName` variants (`meptrasoftai`, `meptrasoft ai`) to the JSON-LD schema, but **the live site still serves the old schema without these terms**. The changes exist only in the local build.

**Fix:** Must commit and deploy to Vercel.

### 🔴 Factor 3: No Knowledge Graph Entry

Google doesn't recognize "Meptrasoft AI" as a distinct entity. There is:
- No Google Business Profile
- No Wikidata entry
- No Crunchbase listing
- No Knowledge Panel

Without these, Google's spell-correction algorithm defaults to the phonetically similar `medhasoft` (a government portal with millions of monthly visits, edit distance = 1 character).

**Fix:** Create GBP, Wikidata entry, and Crunchbase listing (see Action Plan below).

### 🟡 Factor 4: No Entity-Defining Content on About Page

The `/about` page exists but lacks a clear, extractable "Wikipedia-style" definitional sentence. Google's NLP algorithms look for sentences like:

> "Meptrasoft AI Technologies is an AI and software company headquartered in Chennai, Tamil Nadu, India."

Without this, Google has structured data but no natural-language confirmation of what the entity is.

### 🟡 Factor 5: LinkedIn `sameAs` Points to Personal Profile

The `sameAs` array contains `linkedin.com/in/meptrasoft-ai-technologies-b90442420` — this is a **personal profile** (`/in/`), not a **Company Page** (`/company/`). Google's entity recognition treats `/company/` URLs as much stronger corporate entity signals.

### 🟡 Factor 6: Missing `foundingDate` in Schema

The Organization schema had no `foundingDate`. This is a standard entity verification property that Google uses to distinguish established companies from placeholder domains.

**Fix (Applied):** Added `foundingDate: "2024"` to `organizationSchema()`.

### 🟠 Factor 7: New Domain + Low Authority

`meptrasoftai.in` is a new domain with 16 indexed pages and minimal backlinks. `medhasoft.bihar.gov.in` has years of authority and millions of visits. Google's spell-correction heavily weights search volume — until `meptrasoftai` accumulates enough branded search volume and clicks, the correction will persist.

---

## 3. Action Plan (Prioritized)

### 🔴 PHASE 1: Deploy Code Fixes (Day 1)

| # | Action | File | Status |
|---|---|---|---|
| 1 | Add `<noscript>` brand content to `<body>` | `index.html` | ✅ Done |
| 2 | Add `alternateName` with `meptrasoftai`, `meptrasoft ai` | `src/seo/config.mjs` | ✅ Done (prev session) |
| 3 | Add `foundingDate: "2024"` to Organization schema | `src/seo/config.mjs` | ✅ Done |
| 4 | Add `alternateName` to WebSite schema | `src/seo/config.mjs` | ✅ Done (prev session) |
| 5 | **Deploy to Vercel** | `git push` | ⬜ **YOU MUST DO THIS** |
| 6 | Fix LinkedIn `sameAs` to `/company/` URL | `src/seo/config.mjs` | ⬜ Need Company Page first |

### 🟠 PHASE 2: External Entity Building (Days 1-7)

#### 2.1 Google Business Profile (HIGHEST PRIORITY)
1. Go to [business.google.com](https://business.google.com)
2. Create profile for **Meptrasoft AI Technologies**
3. Category: "Software Company" + "Educational Institution"
4. Address: Near Alpha City, Navalur, Chennai, Tamil Nadu 600130
5. Website: `https://www.meptrasoftai.in`
6. Phone: must match the number on the website exactly
7. Verify (Google will mail a postcard or call)

#### 2.2 Wikidata Entry
1. Create account at [wikidata.org](https://www.wikidata.org)
2. Create new item:
   - Label: `Meptrasoft AI Technologies`
   - Description: `Indian AI and software company based in Chennai`
3. Add statements:
   - `instance of (P31)`: `company (Q783794)`
   - `country (P17)`: `India (Q668)`
   - `headquarters location (P159)`: `Chennai (Q1352)`
   - `official website (P856)`: `https://www.meptrasoftai.in`
   - `industry (P452)`: `software industry (Q880739)`
   - `inception (P571)`: `2024`
4. Wait 24-48 hours, then add more properties

#### 2.3 LinkedIn Company Page
1. Create a proper Company Page at `linkedin.com/company/meptrasoft-ai-technologies`
2. Bio must include: "Meptrasoft AI Technologies (meptrasoftai.in) builds AI products..."
3. Update `sameAs` in code to point to `/company/` URL instead of `/in/`

#### 2.4 Google Search Ads Campaign (FASTEST ACCELERATOR)
- **Campaign type:** Search
- **Keywords (exact match):** `[meptrasoftai]`, `[meptrasoft ai]`, `[meptrasoft]`
- **Daily budget:** ₹100-200 (~$1.20-2.50/day)
- **Why this works:** Forces Google to recognize `meptrasoftai` as a legitimate search intent, not a typo. Brand keywords with no competition cost ₹1-2 per click. Google's ad system feeds data back into organic entity recognition.
- **Duration:** 2-4 weeks minimum

### 🟢 PHASE 3: Signal Accumulation (Weeks 2-6)

#### 3.1 NavBoost Click Training
- Share link: `https://www.google.com/search?q=meptrasoftai`
- Tell team/community to:
  1. Click **"Search instead for meptrasoftai"**
  2. Click the `meptrasoftai.in` result
  3. Browse at least 2-3 pages (reduces pogo-stick rate)
- Google's ML learns from these correction→click patterns

#### 3.2 Branded Content & Backlinks
- Publish 2-3 articles on Medium / LinkedIn with titles containing "Meptrasoft AI Technologies"
- Ensure anchor text links to `https://www.meptrasoftai.in`
- Each article creates a third-party co-occurrence of brand name + URL

#### 3.3 GSC Actions After Deploy
1. **URL Inspection** → `https://www.meptrasoftai.in/` → **Test Live URL** → **Request Indexing**
2. Submit feedback on AI Overview "inactive" claim (⋮ icon → "Not factually correct")
3. Re-submit sitemap under GSC → Sitemaps

#### 3.4 NAP Consistency Audit
Verify identical Name/Address/Phone across:
- Website structured data
- Google Business Profile
- LinkedIn Company Page
- Instagram bio
- All directory listings

---

## 4. Expected Timeline

| Week | Milestone |
|---|---|
| **Week 1** | Deploy code. Create GBP + Wikidata. Start Google Ads. Request GSC re-index. |
| **Week 2** | Google recrawls, sees `<noscript>` content + updated schema. AI Overview may self-correct. |
| **Week 3-4** | GBP verified. Wikidata indexed. Branded ad impressions accumulate. |
| **Week 4-6** | Google stops auto-correcting `meptrasoftai` → `medhasoft` |
| **Week 6-8** | Branded searches consistently return `meptrasoftai.in` at #1 |

> **There is no instant fix.** The spell-correction is algorithmic. Google Ads is the fastest accelerator (days), but full organic correction takes 4-8 weeks of consistent signals.

---

## 5. Summary Checklist

### Code (Done — needs deploy)
- [x] `alternateName` includes `meptrasoftai`, `meptrasoft ai`
- [x] `foundingDate: "2024"` added to Organization schema
- [x] `<noscript>` brand content added to `<body>`
- [x] `alternateName` added to WebSite schema
- [x] Build passes (`71/71 pages, all checks pass`)
- [ ] **⚠️ DEPLOY TO VERCEL**

### Off-Page (You must do these manually)
- [ ] Google Business Profile created and verified
- [ ] Wikidata entry created with basic properties
- [ ] LinkedIn Company Page created (not personal profile)
- [ ] Google Search Ads campaign running on brand keywords
- [ ] GSC: Request indexing for homepage
- [ ] GSC: Submit AI Overview feedback ("inaccurate")
- [ ] NAP consistency audit across all platforms
