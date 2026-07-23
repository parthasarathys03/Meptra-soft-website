// Post-build SEO pass. Runs after `vite build`.
//
//  1. For every route in the manifest, writes dist/<route>/index.html with a
//     route-correct <head> (title, description, canonical, OG/Twitter) and its
//     JSON-LD, by editing the built dist/index.html. Crawlers that don't run JS
//     still get real per-page metadata.
//  2. Generates dist/sitemap.xml and dist/robots.txt from the same manifest.
//
// The React app (react-helmet-async) keeps these tags correct during client
// navigation; this script makes the *first* server response correct too.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { routes, ORIGIN } from "../src/seo/routes.mjs";
import { site } from "../src/seo/config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const TODAY = new Date().toISOString().slice(0, 10);

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function seoBlock(route) {
  const url = `${ORIGIN}${route.path === "/" ? "/" : route.path.replace(/\/+$/, "")}`;
  const img = route.ogImage || site.image;
  const robots = route.noindex ? "noindex, nofollow" : "index, follow";
  const ogType = route.ogType || "website";
  // data-ssg-seo marks tags the client strips at startup so react-helmet-async
  // becomes the single owner (no duplicate canonical/description after hydration).
  const d = "data-ssg-seo";
  const lines = [
    `<title ${d}>${esc(route.title)}</title>`,
    `<meta ${d} name="description" content="${esc(route.description)}" />`,
    route.keywords?.length ? `<meta ${d} name="keywords" content="${esc(route.keywords.join(", "))}" />` : "",
    `<link ${d} rel="canonical" href="${esc(url)}" />`,
    `<meta ${d} name="robots" content="${robots}" />`,
    `<meta ${d} property="og:type" content="${ogType}" />`,
    `<meta ${d} property="og:site_name" content="${esc(site.legalName)}" />`,
    `<meta ${d} property="og:title" content="${esc(route.title)}" />`,
    `<meta ${d} property="og:description" content="${esc(route.description)}" />`,
    `<meta ${d} property="og:url" content="${esc(url)}" />`,
    `<meta ${d} property="og:image" content="${esc(img)}" />`,
    `<meta ${d} property="og:image:secure_url" content="${esc(img)}" />`,
    `<meta ${d} property="og:image:type" content="image/png" />`,
    `<meta ${d} property="og:image:width" content="1200" />`,
    `<meta ${d} property="og:image:height" content="630" />`,
    `<meta ${d} property="og:image:alt" content="${esc(site.legalName)}" />`,
    `<meta ${d} name="twitter:card" content="summary_large_image" />`,
    `<meta ${d} name="twitter:title" content="${esc(route.title)}" />`,
    `<meta ${d} name="twitter:description" content="${esc(route.description)}" />`,
    `<meta ${d} name="twitter:image" content="${esc(img)}" />`,
  ].filter(Boolean);
  return lines.map((l) => `    ${l}`).join("\n");
}

function jsonLdTags(route) {
  if (!route.schema?.length) return "";
  return (
    route.schema
      // JSON.stringify safely escapes </script> only if we replace "<"; do it.
      .map(
        (block) =>
          `    <script type="application/ld+json" data-ssg-seo>${JSON.stringify(block).replace(/</g, "\\u003c")}</script>`
      )
      .join("\n") + "\n  "
  );
}

async function run() {
  const templatePath = join(DIST, "index.html");
  let template;
  try {
    template = await readFile(templatePath, "utf8");
  } catch {
    console.error("[seo-build] dist/index.html not found — run `vite build` first.");
    process.exit(1);
  }

  const seoRe = /<!-- SEO:START[\s\S]*?SEO:END -->/;
  if (!seoRe.test(template)) {
    console.error("[seo-build] SEO marker block not found in index.html. Aborting.");
    process.exit(1);
  }

  let written = 0;
  for (const route of routes) {
    let html = template.replace(seoRe, seoBlock(route));
    const ld = jsonLdTags(route);
    if (ld) html = html.replace("</head>", `${ld}</head>`);

    const outPath =
      route.path === "/" ? join(DIST, "index.html") : join(DIST, route.path.replace(/^\//, ""), "index.html");
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    written++;
  }

  // 404.html — served by Vercel with a real HTTP 404 for unmatched paths.
  // It boots the SPA (so React Router renders <NotFound/>) but ships a noindex head.
  const notFound = {
    path: "/404",
    title: "Page not found (404) | Meptrasoft AI Technologies",
    description:
      "The page you were looking for doesn't exist. Explore Meptrasoft AI Technologies' internships, courses, projects, and AI solutions.",
    noindex: true,
  };
  await writeFile(join(DIST, "404.html"), template.replace(seoRe, seoBlock(notFound)), "utf8");

  // sitemap.xml — indexable routes only
  const urls = routes
    .filter((r) => !r.noindex)
    .map((r) => {
      const loc = `${ORIGIN}${r.path === "/" ? "/" : r.path.replace(/\/+$/, "")}`;
      return `  <url>\n    <loc>${esc(loc)}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${r.changefreq || "monthly"}</changefreq>\n    <priority>${(r.priority ?? 0.5).toFixed(1)}</priority>\n  </url>`;
    })
    .join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  await writeFile(join(DIST, "sitemap.xml"), sitemap, "utf8");

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`;
  await writeFile(join(DIST, "robots.txt"), robots, "utf8");

  console.log(`[seo-build] ${written} route pages, sitemap.xml (${routes.filter((r) => !r.noindex).length} urls), robots.txt`);
}

run();
