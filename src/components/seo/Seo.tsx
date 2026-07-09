import { Helmet } from "react-helmet-async";
import { ORIGIN } from "@/seo/routes";
import { site } from "@/seo/config";
import type { JsonLd } from "@/seo/config";

export interface SeoProps {
  title: string;
  description: string;
  /** Path only, e.g. "/learn"; joined to ORIGIN for canonical + og:url. */
  path: string;
  keywords?: string[];
  image?: string;
  noindex?: boolean;
  /** JSON-LD blocks to emit. */
  schema?: JsonLd[];
  type?: "website" | "article";
}

/**
 * Per-route <head>. Runs client-side for SPA navigation; the build-time
 * injector (scripts/seo-build.mjs) writes the same tags into static HTML so
 * crawlers see them without executing React.
 */
export function Seo({
  title,
  description,
  path,
  keywords,
  image,
  noindex,
  schema,
  type = "website",
}: SeoProps) {
  const canonical = `${ORIGIN}${path === "/" ? "/" : path.replace(/\/+$/, "")}`;
  const ogImage = image || site.image;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site.legalName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {(schema || []).map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}

/** Convenience: render <Seo> straight from a manifest route object. */
export function RouteSeoTags({ route }: { route: import("@/seo/config").RouteSeo }) {
  return (
    <Seo
      title={route.title}
      description={route.description}
      path={route.path}
      keywords={route.keywords}
      image={route.ogImage}
      noindex={route.noindex}
      schema={route.schema}
    />
  );
}
