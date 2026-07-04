import { OfferingCard } from "@/components/ui/OfferingCard";
import { Reveal, RevealGroup, revealItem } from "@/components/motion/Reveal";
import { motion } from "framer-motion";
import { dataCapabilities } from "@/data/content";

/** Data & AI capabilities band on the Solutions page. */
export function DataAI() {
  return (
    <section id="data-ai" className="section-pad section-dark scroll-mt-6">
      <div aria-hidden className="glow-teal pointer-events-none absolute -left-32 bottom-10 h-96 w-96 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal className="max-w-[60ch]">
          <p className="eyebrow text-aqua-300">Data &amp; AI</p>
          <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.02em] text-hero-ink">
            Turn your data into an advantage.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-hero-soft">
            From raw, siloed data to pipelines, dashboards, and AI models in production — we make
            your data usable and put it to work.
          </p>
        </Reveal>

        <RevealGroup className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dataCapabilities.map((c) => (
            <motion.div key={c.id} variants={revealItem}>
              <OfferingCard item={c} />
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
