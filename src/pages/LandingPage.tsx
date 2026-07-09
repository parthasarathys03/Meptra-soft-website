import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { RouteSeoTags } from "@/components/seo/Seo";
import { getLanding } from "@/data/landings";
import { getRoute } from "@/seo/routes";
import NotFound from "@/pages/NotFound";

function Breadcrumbs({ items }: { items: { name: string; to: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="container-page pt-24 md:pt-28">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-hero-soft">
        {items.map((it, i) => (
          <li key={it.to} className="inline-flex items-center gap-1.5">
            {i > 0 && <span aria-hidden className="opacity-40">/</span>}
            {i < items.length - 1 ? (
              <Link to={it.to} className="hover:text-aqua-300">
                {it.name}
              </Link>
            ) : (
              <span className="text-hero-ink" aria-current="page">
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function LandingPage({ slug }: { slug: string }) {
  const data = getLanding(slug);
  if (!data) return <NotFound />;

  const route = getRoute(data.path);
  const midName = data.path.startsWith("/courses/") || data.path.startsWith("/internships/") ? "Learn" : data.eyebrow;
  const crumbItems = [
    { name: "Home", to: "/" },
    { name: midName, to: "/learn" },
    { name: data.eyebrow, to: data.path },
  ];

  return (
    <>
      <RouteSeoTags route={route} />

      <div className="bg-gradient-hero">
        <Breadcrumbs items={crumbItems} />
      </div>

      <PageHeader
        eyebrow={data.eyebrow}
        title={data.h1}
        subtitle={data.subtitle}
        accent={data.accent}
        image={data.image}
        imageAlt={data.imageAlt}
      >
        <div className="flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-[#20160a] transition-transform hover:-translate-y-0.5"
          >
            {data.cta.title}
            <Icon name="arrow-right" size={14} />
          </Link>
          <Link
            to="/learn"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-hero-ink transition-colors hover:border-aqua-400"
          >
            Explore all programs
          </Link>
        </div>
      </PageHeader>

      <section className="section-pad section-dark">
        <div className="container-page relative z-10 grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="prose-invert max-w-none">
              {data.intro.map((p, i) => (
                <p key={i} className="mb-4 text-[15px] leading-relaxed text-hero-soft md:text-base">
                  {p}
                </p>
              ))}

              <h2 className="mt-8 text-[clamp(20px,2.4vw,28px)] font-bold text-hero-ink">What you get</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {data.checklist.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-[15px] text-hero-soft">
                    <Icon name="check" size={18} className="mt-0.5 shrink-0 text-aqua-300" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.highlights.map((h) => (
                <div key={h.title} className="glass rounded-[var(--radius-lg)] p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-aqua-400/15 text-aqua-300">
                    <Icon name={h.icon} size={18} />
                  </span>
                  <h3 className="mt-3 text-base font-bold text-hero-ink">{h.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-hero-soft">{h.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad section-dark">
        <div className="container-page relative z-10">
          <Reveal>
            <h2 className="text-[clamp(22px,3vw,32px)] font-bold text-hero-ink">Frequently asked questions</h2>
          </Reveal>
          <dl className="mt-6 flex flex-col gap-4">
            {data.faqs.map((f) => (
              <Reveal key={f.question}>
                <div className="glass rounded-[var(--radius-lg)] p-5">
                  <dt className="text-base font-semibold text-hero-ink">{f.question}</dt>
                  <dd className="mt-2 text-[14px] leading-relaxed text-hero-soft">{f.answer}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Related internal links */}
      <section className="section-pad section-dark">
        <div className="container-page relative z-10">
          <h2 className="text-[clamp(20px,2.4vw,26px)] font-bold text-hero-ink">Explore related programs</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {data.related.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="inline-flex items-center gap-1.5 rounded-full border border-aqua-400/25 bg-aqua-400/10 px-4 py-2 text-sm font-medium text-aqua-300 transition-colors hover:border-aqua-400 hover:text-white"
              >
                {r.label}
                <Icon name="arrow-right" size={13} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
