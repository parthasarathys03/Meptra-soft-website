import { motion } from "framer-motion";
import { Reveal, RevealGroup, revealItem } from "@/components/motion/Reveal";
import { caseStudies } from "@/data/content";

/** Our Work — shipped case studies with headline result metrics. */
export function OurWork() {
  return (
    <section id="work" className="section-pad section-dark-alt scroll-mt-6">
      <div aria-hidden className="glow-amber pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal className="max-w-[60ch]">
          <p className="eyebrow text-aqua-300">Our Work</p>
          <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.02em] text-hero-ink">
            Real projects, measurable results.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-hero-soft">
            A sample of what we&apos;ve shipped for clients — and the outcomes that came with it.
          </p>
        </Reveal>

        <RevealGroup className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
          {caseStudies.map((c) => (
            <motion.div
              key={c.id}
              variants={revealItem}
              className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] glass p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-aqua-400/50 hover:shadow-[0_14px_36px_-16px_rgba(0,180,174,0.26)]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-aqua-400/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="relative w-fit rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-aqua-300">
                {c.tag}
              </span>

              <div className="relative mt-5 flex items-baseline gap-2">
                <span className="text-[40px] font-bold leading-none tracking-tight text-hero-ink">{c.metric}</span>
                <span className="text-[13px] text-hero-soft">{c.metricLabel}</span>
              </div>

              <h3 className="relative mt-4 text-[17px] font-bold leading-snug tracking-[-0.01em] text-hero-ink">
                {c.title}
              </h3>
              <p className="relative mt-2 text-[14px] leading-relaxed text-hero-soft">{c.blurb}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
