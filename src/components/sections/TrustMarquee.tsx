import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { testimonials, techStack } from "@/data/content";

/** Light social-proof band: partner/tech pill marquee + testimonial grid. */
export function TrustMarquee() {
  return (
    <section className="section-dark-alt section-pad">
      <div aria-hidden className="glow-teal pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full" />
      <div aria-hidden className="glow-amber pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal className="max-w-[60ch]">
          <p className="eyebrow text-aqua-300">Trusted by</p>
          <h2 className="mt-3 text-[clamp(24px,3vw,34px)] font-bold tracking-[-0.02em] text-hero-ink">
            Teams and students building on what we ship.
          </h2>
        </Reveal>

        <div className="mt-8">
          <Marquee speed={30}>
            {techStack.map((t) => (
              <span
                key={t.name}
                className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[12px] text-hero-soft"
              >
                {t.name}
              </span>
            ))}
          </Marquee>
        </div>

        <Reveal className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3" delay={0.1}>
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="glass rounded-[var(--radius-md)] p-6 transition-all duration-300 hover:-translate-y-1.5"
            >
              <p className="text-[15px] leading-relaxed text-hero-ink">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                {t.avatar && (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/15"
                  />
                )}
                <div>
                  <p className="font-bold text-hero-ink">{t.name}</p>
                  <p className="text-sm text-hero-soft">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
