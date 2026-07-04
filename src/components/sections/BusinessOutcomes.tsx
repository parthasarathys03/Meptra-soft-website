import { OfferingCard } from "@/components/ui/OfferingCard";
import { Reveal, RevealGroup, revealItem } from "@/components/motion/Reveal";
import { motion } from "framer-motion";
import { outcomes } from "@/data/content";

/** Business-value band: the outcomes clients actually buy — cost, growth,
 *  security, automation, AI. Sits above the service catalog on Solutions. */
export function BusinessOutcomes() {
  return (
    <section id="outcomes" className="section-pad section-dark-alt scroll-mt-6">
      <div aria-hidden className="glow-teal pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal className="max-w-[60ch]">
          <p className="eyebrow text-aqua-300">Why Meptrasoft</p>
          <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.02em] text-hero-ink">
            We build for outcomes, not just output.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-hero-soft">
            Lower costs, tighter security, less busywork, and AI that actually moves the business —
            that&apos;s what our services are measured against.
          </p>
        </Reveal>

        <RevealGroup className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((o) => (
            <motion.div key={o.id} variants={revealItem}>
              <OfferingCard item={o} />
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
