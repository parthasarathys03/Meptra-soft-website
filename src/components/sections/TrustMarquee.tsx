import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { Icon } from "@/components/ui/Icon";
import { testimonials, techStack } from "@/data/content";
import type { Testimonial } from "@/lib/types";

const mid = Math.ceil(testimonials.length / 2);
const row1 = testimonials.slice(0, mid);
const row2 = testimonials.slice(mid);

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name="star"
          size={11}
          className={i < rating ? "text-amber-400" : "text-white/15"}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -4, borderColor: "rgba(0,180,174,0.4)" }}
      transition={{ duration: 0.2 }}
      className="glass flex w-[300px] shrink-0 flex-col rounded-[var(--radius-md)] p-5"
    >
      <Stars rating={t.rating} />
      <p className="mt-3 text-[14px] leading-relaxed text-hero-ink">&ldquo;{t.quote}&rdquo;</p>
      <p className="mt-4 font-bold text-hero-ink">{t.name}</p>
      <p className="text-sm text-hero-soft">{t.role}</p>
    </motion.div>
  );
}

/** Light social-proof band: partner/tech pill marquee + a two-row, opposite-direction
 *  testimonial marquee (student internship / course / project feedback only). */
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

        <Reveal className="mt-14 flex flex-col gap-5" delay={0.1}>
          <Marquee speed={55}>
            {row1.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </Marquee>
          <Marquee speed={55} reverse>
            {row2.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </Marquee>
        </Reveal>
      </div>
    </section>
  );
}
