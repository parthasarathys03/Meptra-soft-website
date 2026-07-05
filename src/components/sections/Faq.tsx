import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { faqs } from "@/data/content";

/** FAQ — sticky intro column + single-open accordion, answers for both
 *  the business (Solutions) and student (Learn) audiences. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-pad section-dark-alt">
      <div aria-hidden className="glow-teal pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full" />
      <div className="container-page relative z-10 grid gap-10 md:grid-cols-[0.9fr_1.3fr] md:gap-16">
        <Reveal>
          <p className="eyebrow text-aqua-300">FAQ</p>
          <h2 className="mt-3 max-w-[16ch] text-[clamp(26px,3.4vw,38px)] font-bold leading-tight tracking-[-0.02em] text-hero-ink">
            Questions? Let&apos;s clear things up.
          </h2>
          <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-hero-soft">
            Answers for businesses hiring us and students training with us — the same team,
            two ways to work together.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col">
          {faqs.map((f, i) => {
            const expanded = open === i;
            return (
              <div key={f.question} className="border-b border-white/10 first:border-t">
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : i)}
                  aria-expanded={expanded}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span
                    className={`text-[15px] font-semibold transition-colors sm:text-base ${
                      expanded ? "text-white" : "text-hero-ink"
                    }`}
                  >
                    {f.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      expanded ? "border-aqua-400 text-aqua-300" : "border-white/15 text-hero-soft"
                    }`}
                  >
                    <Icon name={expanded ? "minus" : "plus"} size={12} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 0.9, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[62ch] pb-5 text-[14px] leading-relaxed text-hero-soft">
                        {f.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
