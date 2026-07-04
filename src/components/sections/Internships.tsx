import { motion } from "framer-motion";
import { OfferingCard } from "@/components/ui/OfferingCard";
import { Reveal, RevealGroup, revealItem } from "@/components/motion/Reveal";
import { internships } from "@/data/content";

/** Internship tracks — free, paid/mentored, and short certifications. */
export function Internships() {
  return (
    <section id="internships" className="section-pad section-dark scroll-mt-6">
      <div aria-hidden className="glow-amber pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal className="max-w-[62ch]">
          <p className="eyebrow text-amber-300">Internships</p>
          <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.02em] text-hero-ink">
            Work on real client products, not toy tasks.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-hero-soft">
            Skilled already? Apply straight to the free track. Still building up? The paid track
            mentors you one-on-one until you&apos;re ready — same real work, same duration.
          </p>
        </Reveal>

        <RevealGroup className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
          {internships.map((item) => (
            <motion.div key={item.id} variants={revealItem}>
              <OfferingCard item={item} />
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
