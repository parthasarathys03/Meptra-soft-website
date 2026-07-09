import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { RouteSeoTags } from "@/components/seo/Seo";
import { getRoute } from "@/seo/routes";
import { landings } from "@/data/landings";

// Auto-lists every internship landing page. Add a new /internships/* entry to
// landings.mjs and it appears here automatically — no wiring needed.
const tracks = landings.filter((l) => l.path.startsWith("/internships/"));

// Planned specializations without a page yet — shown as badges (no dead links).
const upcoming = [
  "Python Internship",
  "Data Science Internship",
  "Machine Learning Internship",
  "Generative AI Internship",
  "Cloud Internship",
  "Full Stack Internship",
];

const locationsLinks = [
  { label: "Internship in Chennai", to: "/locations/chennai" },
  { label: "All Tamil Nadu districts", to: "/locations" },
  { label: "Internship in Pondicherry", to: "/locations/puducherry" },
  { label: "Internship all over India", to: "/internships/online" },
];

const faqs = [
  {
    q: "What internships does Meptrasoft AI offer?",
    a: "AI, software, web development, free, paid, and online internships — all working on real client products with mentor code reviews. More specializations (Python, data science, machine learning, generative AI, cloud, full stack) are added based on demand.",
  },
  {
    q: "Are the internships online?",
    a: "Yes. Every internship is delivered remotely across Tamil Nadu and India, in Tamil and English. You only need a laptop and internet.",
  },
  {
    q: "Is there a free internship option?",
    a: "Yes. Our free internship is merit-based (interview or top course performance). A mentored paid track is available if you're not job-ready yet — same real work, same certificate.",
  },
  {
    q: "Do interns work on real projects?",
    a: "Yes — interns contribute to the same live products we ship to paying clients, reviewed by senior engineers. You leave with a verifiable history of real work.",
  },
];

const crumbs = [
  { name: "Home", to: "/" },
  { name: "Learn", to: "/learn" },
  { name: "Internships", to: "/internships" },
];

export default function InternshipsHub() {
  return (
    <>
      <RouteSeoTags route={getRoute("/internships")} />

      <div className="bg-gradient-hero">
        <nav aria-label="Breadcrumb" className="container-page pt-24 md:pt-28">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-hero-soft">
            {crumbs.map((it, i) => (
              <li key={it.to} className="inline-flex items-center gap-1.5">
                {i > 0 && <span aria-hidden className="opacity-40">/</span>}
                {i < crumbs.length - 1 ? (
                  <Link to={it.to} className="hover:text-aqua-300">{it.name}</Link>
                ) : (
                  <span className="text-hero-ink" aria-current="page">{it.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <PageHeader
        eyebrow="Internships"
        title="Internships in Tamil Nadu — real work, real projects"
        subtitle="AI, software, Python, data science, machine learning, and web development internships — online, mentored, and built on live client products. Free and paid tracks."
        accent="amber"
        image="/assets/career.webp"
        imageAlt="Internships at Meptrasoft AI Technologies"
        imageWide
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/contact" className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-[#20160a] transition-transform hover:-translate-y-0.5">
            Apply now <Icon name="arrow-right" size={14} />
          </Link>
          <Link to="/careers" className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-hero-ink transition-colors hover:border-aqua-400">
            View open roles
          </Link>
        </div>
      </PageHeader>

      {/* Intro / SEO copy */}
      <section className="section-pad section-dark">
        <div className="container-page relative z-10 max-w-[75ch]">
          <Reveal>
            <p className="text-[15px] leading-relaxed text-hero-soft md:text-base">
              Meptrasoft AI Technologies runs online internships for college students and freshers across
              Chennai, Cuddalore, and every district of Tamil Nadu. Whether you want an{" "}
              <strong className="text-hero-ink">AI internship</strong>, a{" "}
              <strong className="text-hero-ink">software internship</strong>, or a{" "}
              <strong className="text-hero-ink">web development internship</strong>, you work on the same live
              products we ship to paying clients — not throwaway exercises — with a senior engineer reviewing
              every pull request.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-hero-soft">
              Choose a <strong className="text-hero-ink">free internship</strong> (merit-based entry) or a
              mentored <strong className="text-hero-ink">paid internship</strong> if you're not job-ready yet.
              Every track is remote, runs from one month to a year, and ends with a verifiable certificate.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Available internship tracks — auto-listed */}
      <section className="section-pad section-dark">
        <div className="container-page relative z-10">
          <Reveal>
            <h2 className="text-[clamp(22px,3vw,32px)] font-bold text-hero-ink">Internship tracks</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((t) => (
              <Reveal key={t.path}>
                <Link
                  to={t.path}
                  className="glass group flex h-full flex-col rounded-[var(--radius-lg)] p-5 transition-transform hover:-translate-y-0.5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-aqua-400/15 text-aqua-300">
                    <Icon name={t.highlights[0]?.icon ?? "briefcase"} size={18} />
                  </span>
                  <h3 className="mt-3 text-base font-bold text-hero-ink">{t.eyebrow}</h3>
                  <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-hero-soft">{t.subtitle}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-300">
                    Learn more
                    <Icon name="arrow-right" size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming specializations */}
      <section className="section-pad section-dark">
        <div className="container-page relative z-10">
          <h2 className="text-[clamp(20px,2.4vw,26px)] font-bold text-hero-ink">More specializations</h2>
          <p className="mt-2 max-w-[60ch] text-[14px] text-hero-soft">
            We place interns in these tracks based on demand and open client work. Ask us and we'll match you.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {upcoming.map((u) => (
              <span key={u} className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[13px] font-medium text-hero-soft">
                {u}
              </span>
            ))}
          </div>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-300 hover:text-white">
            Request a specialization <Icon name="arrow-right" size={13} />
          </Link>
        </div>
      </section>

      {/* Internships by location */}
      <section className="section-pad section-dark">
        <div className="container-page relative z-10">
          <h2 className="text-[clamp(20px,2.4vw,26px)] font-bold text-hero-ink">Internships by location</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {locationsLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="inline-flex items-center gap-1.5 rounded-full border border-aqua-400/25 bg-aqua-400/10 px-4 py-2 text-sm font-medium text-aqua-300 transition-colors hover:border-aqua-400 hover:text-white"
              >
                <Icon name="map-pin" size={13} />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad section-dark">
        <div className="container-page relative z-10">
          <h2 className="text-[clamp(22px,3vw,32px)] font-bold text-hero-ink">Internship FAQs</h2>
          <dl className="mt-6 flex flex-col gap-4">
            {faqs.map((f) => (
              <Reveal key={f.q}>
                <div className="glass rounded-[var(--radius-lg)] p-5">
                  <dt className="text-base font-semibold text-hero-ink">{f.q}</dt>
                  <dd className="mt-2 text-[14px] leading-relaxed text-hero-soft">{f.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
