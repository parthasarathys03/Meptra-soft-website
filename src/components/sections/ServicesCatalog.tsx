import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { ProcessCarousel } from "@/components/motion/ProcessCarousel";
import { services, serviceCategories, processSteps } from "@/data/content";

/** Rich, filterable Technology Services catalog for the Solutions page.
 *  Tabs filter by category with animated reflow; each card shows an animated
 *  icon, summary, and concrete deliverables. Followed by a process strip. */
export function ServicesCatalog() {
  const [active, setActive] = useState<string>("All");
  const shown = active === "All" ? services : services.filter((s) => s.category === active);

  return (
    <section id="services" className="section-pad section-dark scroll-mt-6">
      <div aria-hidden className="glow-teal pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full" />
      <div aria-hidden className="glow-amber pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal className="max-w-[62ch]">
          <p className="eyebrow text-aqua-300">Technology Services</p>
          <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.02em] text-hero-ink">
            Everything we build for businesses, in one place.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-hero-soft">
            From AI and data to web, cloud, and growth — one team that scopes to your workflow, not a
            template. Filter by what you need.
          </p>
        </Reveal>

        {/* filter tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {serviceCategories.map((cat) => {
            const on = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`relative rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                  on ? "text-[#08131f]" : "text-hero-soft hover:text-hero-ink"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="svc-tab"
                    className="absolute inset-0 rounded-full bg-aqua-400"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* cards */}
        <motion.div layout className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((s) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.22, 0.9, 0.3, 1] }}
                className="group relative overflow-hidden rounded-[var(--radius-lg)] glass p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-aqua-400/50 hover:shadow-[0_14px_36px_-16px_rgba(0,180,174,0.26)]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-aqua-400/25 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative flex items-start justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-aqua-400/12 text-aqua-300 ring-1 ring-aqua-400/20 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon name={s.icon as IconName} size={22} />
                  </span>
                  {s.category && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-aqua-300">
                      {s.category}
                    </span>
                  )}
                </div>

                <h3 className="relative mt-4 text-lg font-bold tracking-[-0.01em] text-hero-ink">{s.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-hero-soft">{s.summary}</p>

                {s.points && (
                  <ul className="relative mt-4 space-y-2 border-t border-white/8 pt-4">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-[13px] text-hero-ink">
                        <Icon name="check" size={14} className="shrink-0 text-aqua-400" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* process strip */}
        <Reveal className="mt-20">
          <p className="eyebrow text-aqua-300">How we work</p>
          <h3 className="mt-3 text-[clamp(22px,2.8vw,30px)] font-bold tracking-[-0.02em] text-hero-ink">
            A simple, transparent path from idea to shipped.
          </h3>
        </Reveal>
        <div className="mt-8">
          <ProcessCarousel steps={processSteps} />
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 rounded-[var(--radius-lg)] glass p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-hero-ink">Not sure which service fits?</h3>
            <p className="mt-1 text-[14px] text-hero-soft">Tell us the problem — we&apos;ll scope the right approach.</p>
          </div>
          <Button variant="amber" to="/contact" className="shrink-0">
            Discuss your project
          </Button>
        </div>
      </div>
    </section>
  );
}
