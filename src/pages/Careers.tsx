import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ApplyModal } from "@/components/ui/ApplyModal";
import { roles } from "@/data/content";
import { RouteSeoTags } from "@/components/seo/Seo";
import { getRoute } from "@/seo/routes";

export default function Careers() {
  const [applyingTo, setApplyingTo] = useState<string | null>(null);

  return (
    <>
      <RouteSeoTags route={getRoute("/careers")} />
      <PageHeader
        eyebrow="Careers"
        title="Build products people actually use."
        subtitle="We hire engineers who want to ship real AI products — and grow the next ones alongside our students."
        accent="navy"
        image="/assets/career.webp"
        imageAlt="Careers at Meptrasoft AI Technologies"
        imageWide
      />

      <section className="section-pad section-dark">
        <div aria-hidden className="glow-teal pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full" />
        <div aria-hidden className="glow-amber pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full" />
        <div className="container-page relative z-10">
          <Reveal>
            <h2 className="text-[clamp(24px,3vw,34px)] font-bold tracking-[-0.01em] text-hero-ink">Open roles</h2>
          </Reveal>
          <ul className="mt-8 flex flex-col gap-4">
            {roles.map((r) => (
              <li key={r.id}>
                <div className="glass relative flex flex-col gap-4 rounded-[var(--radius-lg)] p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="block text-lg font-bold text-hero-ink">{r.title}</span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-hero-soft">
                          {r.type}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm text-hero-soft">
                          <Icon name="map-pin" size={14} />
                          {r.location}
                        </span>
                        <span className="text-sm text-hero-soft">· {r.experience}</span>
                        <span className="text-sm text-hero-soft">· {r.duration}</span>
                        <span className="text-sm text-hero-soft">
                          · {r.openings} {r.openings === 1 ? "opening" : "openings"}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApplyingTo(r.title)}
                      className="group inline-flex items-center gap-1 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-[#20160a] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-amber)]"
                    >
                      Apply
                      <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>

                  <p className="max-w-[70ch] text-sm leading-relaxed text-hero-soft">{r.description}</p>

                  {r.skills && (
                    <div className="flex flex-wrap gap-2">
                      {r.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-aqua-400/25 bg-aqua-400/10 px-2.5 py-0.5 text-[12px] font-medium text-aqua-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA />

      {applyingTo && <ApplyModal roleTitle={applyingTo} onClose={() => setApplyingTo(null)} />}
    </>
  );
}
