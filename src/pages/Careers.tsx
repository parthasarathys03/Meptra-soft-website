import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { roles } from "@/data/content";

export default function Careers() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build products people actually use."
        subtitle="We hire engineers who want to ship real AI products — and grow the next ones alongside our students."
        accent="navy"
      />

      <section className="section-pad section-dark">
        <div aria-hidden className="glow-teal pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full" />
        <div aria-hidden className="glow-amber pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full" />
        <div className="container-page relative z-10">
          <Reveal>
            <h2 className="text-[clamp(24px,3vw,34px)] font-bold tracking-[-0.01em] text-hero-ink">Open roles</h2>
          </Reveal>
          <ul className="mt-8 flex flex-col gap-3">
            {roles.map((r) => (
              <li key={r.id}>
                <Link
                  to={`/careers/${r.id}`}
                  className="group glass relative flex items-center gap-4 rounded-[var(--radius-lg)] p-5 transition-all hover:-translate-y-1.5 hover:border-white/25"
                >
                  <div className="flex-1">
                    <span className="block text-lg font-bold text-hero-ink">{r.title}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-3 text-sm text-hero-soft">
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-hero-soft">{r.type}</span>
                      <span className="inline-flex items-center gap-1"><Icon name="map-pin" size={14} />{r.location}</span>
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-aqua-300">
                    Apply <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
