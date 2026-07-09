// SEO verification (dev-only). Run after `npm run build`:  node scripts/verify-seo.mjs
// Audits: internal-link validity, title/description uniqueness, required tags,
// canonical correctness, JSON-LD presence, sitemap coverage.
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { routes, ORIGIN } from "../src/seo/routes.mjs";
import { landings } from "../src/data/landings.mjs";
import { posts } from "../src/data/blog.mjs";
import { locations } from "../src/data/locations.mjs";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const problems = [];
const ok = [];
const strip = (p) => p.split("#")[0].split("?")[0].replace(/\/+$/, "") || "/";

// ---- 1. valid path set ----
const valid = new Set(routes.map((r) => strip(r.path)));
valid.add("/admin"); // client-only SPA route

// ---- 2. gather every internal link target used anywhere ----
const targets = new Set();
const add = (t) => t && typeof t === "string" && !t.startsWith("http") && !t.startsWith("mailto") && !t.startsWith("tel") && targets.add(t);
landings.forEach((l) => { l.related.forEach((r) => add(r.to)); });
posts.forEach((p) => { p.related.forEach((r) => add(r.to)); p.body.forEach((b) => b.cta && add(b.cta.to)); });
// Fixed link lists embedded in components:
["/internships/ai","/internships/free","/internships/software","/courses/python","/courses/ai","/courses/data-science","/courses/web-development","/courses/generative-ai","/final-year-projects","/college-projects","/industrial-training","/placement-training","/contact","/locations"].forEach(add); // LocationPage offerings
["/placement-training","/internships","/internships/online","/courses/ai","/courses/python","/final-year-projects","/learn","/blog","/careers","/about","/solutions","/contact","/"].forEach(add); // nav + footer
["/internships/paid","/internships/free","/internships/ai","/internships/software","/internships/web-development","/locations/chennai","/locations/cuddalore","/locations"].forEach(add); // internships hub links
["/solutions","/learn","/internships/online","/final-year-projects","/contact","/"].forEach(add); // NotFound

[...targets].sort().forEach((t) => {
  if (valid.has(strip(t))) ok.push(t);
  else problems.push(`BROKEN LINK: ${t} → no matching route`);
});

// ---- 3. read built pages, check tags + uniqueness ----
const titles = new Map();
const descs = new Map();
let pagesChecked = 0;
for (const r of routes) {
  const file = r.path === "/" ? join(DIST, "index.html") : join(DIST, r.path.replace(/^\//, ""), "index.html");
  let html;
  try { html = await readFile(file, "utf8"); } catch { problems.push(`MISSING FILE: ${file}`); continue; }
  pagesChecked++;
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1] || "";
  const desc = (html.match(/<meta data-ssg-seo name="description" content="([^"]*)"/) || [])[1] || "";
  const canonical = (html.match(/rel="canonical" href="([^"]*)"/) || [])[1] || "";
  if (!title) problems.push(`NO TITLE: ${r.path}`);
  if (!desc) problems.push(`NO DESCRIPTION: ${r.path}`);
  if (!canonical) problems.push(`NO CANONICAL: ${r.path}`);
  const expected = `${ORIGIN}${strip(r.path)}`;
  if (canonical && canonical !== expected) problems.push(`BAD CANONICAL: ${r.path} → ${canonical} (expected ${expected})`);
  if (!/property="og:title"/.test(html)) problems.push(`NO OG: ${r.path}`);
  if (!/name="twitter:card"/.test(html)) problems.push(`NO TWITTER: ${r.path}`);
  if (!/application\/ld\+json/.test(html) && r.path !== "/") problems.push(`NO JSON-LD: ${r.path}`);
  if (title) titles.set(title, (titles.get(title) || 0) + 1);
  if (desc) descs.set(desc, (descs.get(desc) || 0) + 1);
}
for (const [t, n] of titles) if (n > 1) problems.push(`DUPLICATE TITLE (${n}×): ${t}`);
for (const [d, n] of descs) if (n > 1) problems.push(`DUPLICATE DESCRIPTION (${n}×): ${d.slice(0, 60)}…`);

// ---- 4. sitemap coverage ----
try {
  const sm = await readFile(join(DIST, "sitemap.xml"), "utf8");
  const inSitemap = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => strip(m[1].replace(ORIGIN, "") || "/")));
  for (const r of routes) if (!r.noindex && !inSitemap.has(strip(r.path))) problems.push(`NOT IN SITEMAP: ${r.path}`);
} catch { problems.push("sitemap.xml missing"); }

// ---- report ----
console.log(`\nPages checked: ${pagesChecked}/${routes.length}`);
console.log(`Internal links checked: ${targets.size} (all valid: ${ok.length === targets.size})`);
console.log(`Unique titles: ${titles.size}, unique descriptions: ${descs.size}`);
if (problems.length) {
  console.log(`\n❌ ${problems.length} PROBLEM(S):`);
  problems.forEach((p) => console.log("  - " + p));
  process.exit(1);
} else {
  console.log("\n✅ ALL CHECKS PASSED — links valid, titles/descriptions unique, tags present, sitemap complete.");
}
