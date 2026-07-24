// ---------------------------------------------------------------------------
// Single source of truth for SEO.
//
// Consumed by THREE places so meta never drifts:
//   1. The React app (src/components/seo/Seo.tsx) — updates <head> on SPA nav.
//   2. scripts/seo-build.mjs — injects a route-correct <head> into each
//      dist/<route>/index.html at build time so crawlers get real HTML.
//   3. scripts/seo-build.mjs — generates sitemap.xml + robots.txt.
//
// Plain ESM JS on purpose: a post-build Node script can import it directly,
// no TS compile step. Types live in config.d.ts.
// ---------------------------------------------------------------------------

export const ORIGIN = "https://www.meptrasoftai.in";

export const site = {
  name: "Meptrasoft AI",
  legalName: "Meptrasoft AI Technologies",
  origin: ORIGIN,
  logo: `${ORIGIN}/assets/logo.svg`,
  image: `${ORIGIN}/assets/og-image.png`,
  email: "info@meptrasoftai.in",
  telephone: "+91-86681-26216",
  // Virtual offices today; physical offices opening soon.
  addressLocality: "Chennai",
  addressRegion: "Tamil Nadu",
  postalCode: "600130",
  streetAddress: "Near Alpha City, Navalur",
  addressCountry: "IN",
  sameAs: [
    "https://www.instagram.com/meptrasoft_ai_technologies",
    "https://www.linkedin.com/company/meptrasoft-ai-technologies/",
    "https://www.facebook.com/profile.php?id=61592124312206",
    "https://wa.me/918668126216",
  ],
};

// Cities/districts we serve — used for LocalBusiness areaServed and location pages.
export const serviceAreas = [
  "Chennai",
  "Cuddalore",
  "Villupuram",
  "Tiruvannamalai",
  "Kallakurichi",
  "Puducherry",
  "Tamil Nadu",
];

// -- helpers ----------------------------------------------------------------

export const abs = (path) => (path.startsWith("http") ? path : `${ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`);

const crumb = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});

// Sitewide Organization + WebSite (emitted on the home page).
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    "@id": `${ORIGIN}/#organization`,
    name: site.legalName,
    alternateName: [
      "Meptrasoft AI",
      "Meptrasoft",
      "meptrasoftai",
      "meptrasoft ai",
      "Meptra Soft AI",
      "Meptrasoft AI Technologies"
    ],
    url: `${ORIGIN}/`,
    foundingDate: "2025-11-22",
    logo: site.logo,
    image: site.image,
    email: site.email,
    telephone: site.telephone,
    description:
      "Meptrasoft AI Technologies builds AI products for businesses and trains the engineers who build them — AI & software services, online internships, courses, final-year projects, and placement training across Tamil Nadu.",
    sameAs: site.sameAs,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.streetAddress,
      addressLocality: site.addressLocality,
      addressRegion: site.addressRegion,
      postalCode: site.postalCode,
      addressCountry: site.addressCountry,
    },
    areaServed: serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.telephone,
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["en", "ta"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${ORIGIN}/#website`,
    url: `${ORIGIN}/`,
    name: site.legalName,
    alternateName: ["Meptrasoft AI", "meptrasoftai", "Meptrasoft"],
    publisher: { "@id": `${ORIGIN}/#organization` },
  };
}

export function courseSchema({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: abs(path),
    provider: { "@type": "Organization", name: site.legalName, sameAs: `${ORIGIN}/` },
  };
}

export function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

export function serviceSchema({ name, description, path, serviceType, areas }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: serviceType || name,
    url: abs(path),
    provider: { "@id": `${ORIGIN}/#organization` },
    areaServed: (areas || serviceAreas).map((n) => ({ "@type": "AdministrativeArea", name: n })),
  };
}

export function breadcrumbSchema(items) {
  return crumb(items);
}

// Local SEO: an EducationalOrganization scoped to a city/area. Reuses the
// sitewide org identity via sameAs but expresses local service area.
export function localBusinessSchema({ city, region, path, areas }) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: `${site.legalName} — ${city}`,
    url: abs(path),
    logo: site.logo,
    image: site.image,
    email: site.email,
    telephone: site.telephone,
    parentOrganization: { "@id": `${ORIGIN}/#organization` },
    sameAs: site.sameAs,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: region,
      addressCountry: "IN",
    },
    areaServed: (areas || [city, region]).map((n) => ({ "@type": "AdministrativeArea", name: n })),
  };
}

export function articleSchema({ title, description, path, image, date, author }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: abs(path),
    image: image ? abs(image) : site.image,
    datePublished: date,
    dateModified: date,
    author: { "@type": "Organization", name: author || site.legalName },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      logo: { "@type": "ImageObject", url: site.logo },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(path) },
  };
}

export { crumb };
