import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { courses, courseCategories } from "@/data/content";
import type { Offering } from "@/lib/types";

const MotionLink = motion.create(Link);

const DOT_GRID =
  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)";

/** Branded local banner — one subtle slate tone, quiet amber accent. */
function CourseBanner({ course }: { course: Offering }) {
  return (
    <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: DOT_GRID, backgroundSize: "16px 16px" }}
      />
      {/* soft amber accent — noticeable, not loud */}
      <div aria-hidden className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-amber-400/10 blur-2xl" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      {/* watermark icon */}
      <Icon
        name={course.icon as IconName}
        size={104}
        className="pointer-events-none absolute -bottom-5 -right-3 text-amber-200/10"
      />
      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45">
            Meptrasoft · Learn
          </p>
          {course.premium && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#20160a] shadow-[0_4px_14px_-4px_rgba(245,166,35,0.7)]">
              <Icon name="star" size={10} /> Premium
            </span>
          )}
        </div>
        <h3 className="max-w-[85%] text-[22px] font-black leading-[1.05] tracking-[-0.02em] text-white drop-shadow">
          {course.title}
        </h3>
      </div>
    </div>
  );
}

/** One meta chip: icon + label. */
function Meta({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-hero-soft">
      <Icon name={icon} size={13} className="text-amber-300/80" />
      {children}
    </span>
  );
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

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
            who ship real products. Every course runs 3 months in Tamil &amp; English, with a limited-time
            offer price. Tap any course to enroll.
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
            {shown.map((c, i) => {
              const free = c.feeNow == null;
              return (
                <motion.article
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 0.9, 0.3, 1] }}
                  className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] glass transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/25 hover:shadow-[0_16px_38px_-24px_rgba(0,0,0,0.7)]"
                >
                  <CourseBanner course={c} />

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm leading-relaxed text-hero-soft">{c.summary}</p>

                    {/* meta: duration + language */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Meta icon="clock">{c.duration}</Meta>
                      {c.languages && <Meta icon="globe">{c.languages.join(", ")}</Meta>}
                    </div>

                    {/* stats: enrolled + rating */}
                    {(c.enrolled || c.rating != null) && (
                      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                        {c.enrolled && (
                          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-hero-soft">
                            <Icon name="users" size={13} className="text-amber-300/80" />
                            {c.enrolled} Enrolled
                          </span>
                        )}
                        {c.rating != null && (
                          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-hero-ink">
                            <Icon name="star" size={13} className="text-amber-300" />
                            {c.rating.toFixed(1)}/5.0
                          </span>
                        )}
                      </div>
                    )}

                    {/* fee + enroll */}
                    <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                      <div className="min-w-0">
                        {free ? (
                          <span className="text-xl font-black text-emerald-300">Free</span>
                        ) : (
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-amber-300">{inr(c.feeNow!)}</span>
                            {c.feeWas != null && (
                              <span className="text-sm font-medium text-hero-soft line-through decoration-1">
                                {inr(c.feeWas)}
                              </span>
                            )}
                          </div>
                        )}
                        {!free && c.feeWas != null && (
                          <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-300">
                            Save {inr(c.feeWas - c.feeNow!)}
                          </p>
                        )}
                        {c.offerNote && (
                          <p className="mt-0.5 text-[11px] font-semibold text-amber-300/90">{c.offerNote}</p>
                        )}
                      </div>

                      <MotionLink
                        to="/contact"
                        whileTap={{ scale: 0.95 }}
                        className="shrink-0 rounded-full bg-amber-500/15 px-5 py-2.5 text-[13px] font-bold text-amber-200 ring-1 ring-amber-400/30 transition-colors hover:bg-amber-500/25 hover:text-amber-100"
                      >
                        {free ? "Book Free" : "Enroll Now"}
                      </MotionLink>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
