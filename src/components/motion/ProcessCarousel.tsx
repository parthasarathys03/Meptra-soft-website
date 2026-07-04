import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconName } from "@/components/ui/Icon";

type Step = { n: string; title: string; body: string; icon?: string; points?: string[] };

/** Auto-advancing carousel for the "How we work" steps. Arrows + dots +
 *  a stepper track; pauses on hover. One slide at a time, engaging and clear. */
export function ProcessCarousel({ steps }: { steps: Step[] }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const n = steps.length;

  const go = (next: number) => {
    setDir(next > i || (i === n - 1 && next === 0) ? 1 : -1);
    setI((next + n) % n);
  };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setDir(1);
      setI((p) => (p + 1) % n);
    }, 4000);
    return () => clearInterval(id);
  }, [paused, n]);

  const step = steps[i];

  const slide = {
    enter: (d: number) => ({ opacity: 0, x: d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -40 }),
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* stepper track */}
      <div className="flex items-center gap-2">
        {steps.map((s, idx) => (
          <button
            key={s.n}
            onClick={() => go(idx)}
            className="group flex flex-1 flex-col gap-2 text-left"
            aria-label={`Go to step ${s.title}`}
          >
            <span className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <span
                className={`block h-full rounded-full bg-aqua-400 transition-all duration-500 ${
                  idx <= i ? "w-full" : "w-0"
                }`}
              />
            </span>
            <span
              className={`hidden text-[12px] font-semibold transition-colors sm:block ${
                idx === i ? "text-aqua-300" : "text-hero-faint group-hover:text-hero-soft"
              }`}
            >
              {s.n} {s.title}
            </span>
          </button>
        ))}
      </div>

      {/* slide */}
      <div className="relative mt-6 overflow-hidden rounded-[var(--radius-lg)] glass p-8 md:p-10">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-aqua-400/10 blur-3xl"
        />
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step.n}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 0.9, 0.3, 1] }}
            className="relative grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]"
          >
            <div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[52px] font-bold leading-none text-aqua-400/35">
                  {step.n}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-aqua-400/40 to-transparent" />
              </div>
              <h4 className="mt-4 text-[26px] font-bold tracking-[-0.01em] text-hero-ink">{step.title}</h4>
              <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-hero-soft">{step.body}</p>
            </div>

            <div className="relative rounded-[var(--radius-md)] border border-white/8 bg-white/[0.03] p-6">
              {step.icon && (
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-[16px] bg-aqua-400/12 text-aqua-300 ring-1 ring-aqua-400/20">
                  <Icon name={step.icon as IconName} size={26} />
                </span>
              )}
              {step.points && (
                <ul className="mt-5 space-y-3">
                  {step.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-[14px] text-hero-ink">
                      <Icon name="check" size={15} className="shrink-0 text-aqua-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* arrows */}
        <div className="relative mt-8 flex items-center gap-3">
          <button
            onClick={() => go(i - 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-hero-ink transition-colors hover:bg-white/10"
            aria-label="Previous step"
          >
            <Icon name="chevron-left" size={16} />
          </button>
          <button
            onClick={() => go(i + 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-hero-ink transition-colors hover:bg-white/10"
            aria-label="Next step"
          >
            <Icon name="arrow-right" size={16} />
          </button>
          <div className="ml-auto flex gap-1.5">
            {steps.map((s, idx) => (
              <button
                key={s.n}
                onClick={() => go(idx)}
                aria-label={`Step ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === i ? "w-6 bg-aqua-400" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
