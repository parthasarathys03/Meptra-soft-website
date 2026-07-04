import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { courses, courseCategories } from "@/data/content";

const MotionLink = motion(Link);

/** Filterable course catalog for the Learn page. Amber lane. */
export function CoursesCatalog() {
  const [active, setActive] = useState<string>("All");
  const shown = active === "All" ? courses : courses.filter((c) => c.category === active);

  return (
    <section id="courses" className="section-pad section-dark-alt scroll-mt-6">
      <div aria-hidden className="glow-amber pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full" />
      <div aria-hidden className="glow-teal pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal className="max-w-[62ch]">
          <p className="eyebrow text-amber-300">Courses</p>
          <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.02em] text-hero-ink">
            Learn the skill, build the project, get the job.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-hero-soft">
            Job-focused courses in AI, programming, data, cloud, and design — taught by the engineers
            who ship real products. Durations run 1–6 months, tailored to your goals. Tap any course
            to talk to us.
          </p>
        </Reveal>

        {/* filter tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {courseCategories.map((cat) => {
            const on = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`relative rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                  on ? "text-[#20160a]" : "text-hero-soft hover:text-hero-ink"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="course-tab"
                    className="absolute inset-0 rounded-full bg-amber-400"
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
            {shown.map((c, i) => (
              <MotionLink
                key={c.id}
                to="/contact"
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 0.9, 0.3, 1] }}
                className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] glass p-6 transition-all duration-300 hover:-translate-y-2 hover:border-amber-400/50 hover:shadow-[0_18px_44px_-18px_rgba(245,166,35,0.32)]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-amber-500/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="relative flex items-center justify-between gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-amber-500/25 to-amber-500/5 text-amber-300 ring-1 ring-amber-400/25 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon name={c.icon as IconName} size={22} />
                  </span>
                  {c.duration && (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] ring-1 ${
                        c.duration === "Free"
                          ? "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30"
                          : "bg-amber-500/15 text-amber-200 ring-amber-400/30"
                      }`}
                    >
                      <Icon name="gauge" size={12} />
                      {c.duration}
                    </span>
                  )}
                </div>

                <h3 className="relative mt-4 text-lg font-bold tracking-[-0.01em] text-hero-ink">{c.title}</h3>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-hero-soft">{c.summary}</p>

                <span className="relative mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-amber-300">
                  More info
                  <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </MotionLink>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
