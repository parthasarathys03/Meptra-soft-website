import { motion } from "framer-motion";
import { OfferingCard } from "@/components/ui/OfferingCard";
import { Reveal, RevealGroup, revealItem } from "@/components/motion/Reveal";
import { projectOfferings } from "@/data/content";

/** College projects — real IEEE / industry-standard, AI-powered, never recycled. */
export function Projects() {
  return (
    <section id="projects" className="section-pad section-dark-alt scroll-mt-6">
      <div aria-hidden className="glow-teal pointer-events-none absolute -left-32 bottom-10 h-96 w-96 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal className="max-w-[62ch]">
          <p className="eyebrow text-amber-300">College Projects</p>
          <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.02em] text-hero-ink">
            Real problems, real MVPs — never recycled dumps.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-hero-soft">
            Industry-standard IEEE and custom projects that solve current, real-world problems with
            AI — built fresh for you, not pulled from an old archive.
          </p>
        </Reveal>

        <RevealGroup className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
          {projectOfferings.map((item) => (
            <motion.div key={item.id} variants={revealItem}>
              <OfferingCard item={item} />
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
