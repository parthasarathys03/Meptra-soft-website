import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { RouteSeoTags } from "@/components/seo/Seo";
import { getRoute } from "@/seo/routes";
import { getLocation } from "@/data/locations";
import NotFound from "@/pages/NotFound";

// The 12 target intents — every district page links to real destinations.
const offerings: { label: string; to: string; icon: IconName }[] = [
  { label: "AI Internship", to: "/internships/ai", icon: "brain" },
  { label: "Free Internship", to: "/internships/free", icon: "star" },
  { label: "Software Internship", to: "/internships/software", icon: "code" },
  { label: "Python Course", to: "/courses/python", icon: "code" },
  { label: "AI Course", to: "/courses/ai", icon: "brain" },
  { label: "Data Science Course", to: "/courses/data-science", icon: "chart" },
  { label: "Web Development Course", to: "/courses/web-development", icon: "laptop-code" },
  { label: "Generative AI Training", to: "/courses/generative-ai", icon: "robot" },
  { label: "Final Year Projects", to: "/final-year-projects", icon: "star" },
  { label: "College Projects", to: "/college-projects", icon: "pen-ruler" },
  { label: "Industrial Training", to: "/industrial-training", icon: "briefcase" },
  { label: "Placement Training", to: "/placement-training", icon: "graduate" },
];

const shortName = (full: string) => full.replace(/\s*\(.*\)\s*$/, "");

export default function LocationPage({ slug }: { slug: string }) {
  const c = getLocation(slug);
  if (!c) return <NotFound />;
  const name = shortName(c.city);

  const faqs = [
    {
      q: `Do you offer online internships and courses in ${name}?`,
      a: `Yes. Every program — AI, software and Python courses, data science, web development, generative AI training, internships, projects, and placement training — is delivered online in Tamil and English to students across ${name}, ${c.region}.`,
    },
    {
      q: `Can students in ${name} do a free internship?`,
      a: `Yes. Our free internship is merit-based (interview or top course performance), and a mentored paid track is available if you're not job-ready yet. Both work on real client products.`,
    },
    {
      q: `Do you help with final-year and college projects in ${name}?`,
      a: `Yes. We build original IEEE, AI, ML, and deep-learning final-year and college projects for ${name} students, with source code, documentation, and viva support.`,
    },
  ];

  return (
    <>
      <RouteSeoTags route={getRoute(`/locations/${slug}`)} />
      <PageHeader
        eyebrow={`${c.city}, ${c.region}`}
        title={`AI internships, courses & projects in ${name}`}
        subtitle={c.lead}
        accent="navy"
      />

      <section className="section-pad section-dark">
        <div className="container-page relative z-10 grid gap-10 md:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <p className="text-[15px] leading-relaxed text-hero-soft md:text-base">{c.highlight}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-hero-soft">
              Meptrasoft AI Technologies supports students and businesses across {name} and nearby areas
              including {c.nearby.join(", ")}. Every program is delivered online in Tamil and English with
              mentor code reviews on real work — so learners in {name} get the same opportunities as those in
              Chennai or Bengaluru, without relocating.
            </p>

            <h2 className="mt-8 text-[clamp(20px,2.4vw,26px)] font-bold text-hero-ink">
              Programs for students in {name}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {offerings.map((o) => (
                <Link
                  key={o.label}
                  to={o.to}
                  className="glass group flex items-center gap-3 rounded-[var(--radius-md)] p-3.5 transition-transform hover:-translate-y-0.5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aqua-400/15 text-aqua-300">
                    <Icon name={o.icon} size={16} />
                  </span>
                  <span className="text-[13px] font-semibold text-hero-ink">{o.label}</span>
                  <Icon name="arrow-right" size={12} className="ml-auto text-aqua-300 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>

            {/* Local context */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="glass rounded-[var(--radius-lg)] p-4">
                <h3 className="text-sm font-bold text-aqua-300">Key industries</h3>
                <ul className="mt-2 flex flex-col gap-1 text-[13px] text-hero-soft">
                  {c.industries.map((i) => <li key={i}>• {i}</li>)}
                </ul>
              </div>
              <div className="glass rounded-[var(--radius-lg)] p-4">
                <h3 className="text-sm font-bold text-aqua-300">Colleges</h3>
                <ul className="mt-2 flex flex-col gap-1 text-[13px] text-hero-soft">
                  {c.colleges.map((i) => <li key={i}>• {i}</li>)}
                </ul>
              </div>
              <div className="glass rounded-[var(--radius-lg)] p-4">
                <h3 className="text-sm font-bold text-aqua-300">Universities</h3>
                <ul className="mt-2 flex flex-col gap-1 text-[13px] text-hero-soft">
                  {c.universities.map((i) => <li key={i}>• {i}</li>)}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass sticky top-24 rounded-[var(--radius-lg)] p-6">
              <h2 className="text-lg font-bold text-hero-ink">Serving {name} & nearby</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {[name, ...c.nearby].map((n) => (
                  <li
                    key={n}
                    className="rounded-full border border-aqua-400/25 bg-aqua-400/10 px-3 py-1 text-[12px] font-medium text-aqua-300"
                  >
                    {n}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-[#20160a] transition-transform hover:-translate-y-0.5"
                >
                  Talk to us
                  <Icon name="arrow-right" size={14} />
                </Link>
                <Link
                  to="/locations"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-hero-ink transition-colors hover:border-aqua-400"
                >
                  All locations
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad section-dark">
        <div className="container-page relative z-10">
          <h2 className="text-[clamp(22px,3vw,32px)] font-bold text-hero-ink">
            Internships & courses in {name} — FAQs
          </h2>
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
