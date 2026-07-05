import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { loopSteps } from "@/data/content";
import type { LoopStep } from "@/lib/types";

type Accent = LoopStep["accent"];

const ACCENT: Record<Accent, { text: string; bg: string; border: string; hex: string }> = {
  teal: { text: "text-teal-300", bg: "bg-teal-500", border: "border-teal-500", hex: "#2DD4BF" },
  amber: { text: "text-amber-300", bg: "bg-amber-500", border: "border-amber-500", hex: "#F5A623" },
  aqua: { text: "text-aqua-300", bg: "bg-aqua-400", border: "border-aqua-400", hex: "#00B4AE" },
};

const NODE_ICON: Record<LoopStep["node"], IconName> = {
  products: "rocket",
  learners: "graduate",
  projects: "briefcase",
};

/* Node placement on the ring — clockwise from top. Percent of the square. */
const RADIUS = 42;
const NODE_ANGLES = [-90, 30, 150];
const nodePos = (deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { left: `${50 + RADIUS * Math.cos(rad)}%`, top: `${50 + RADIUS * Math.sin(rad)}%` };
};

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

export function EcosystemLoop() {
  const isDesktop = useIsDesktop();
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink-900 text-hero-ink">
      <div className="circuit-grid pointer-events-none absolute inset-0 opacity-10" aria-hidden />

      <div className="container-page relative z-10 section-pad pb-0">
        <Reveal className="mx-auto max-w-[60ch] text-center">
          <p className="eyebrow inline-flex items-center justify-center gap-2.5 text-aqua-300">
            <span className="h-px w-6 bg-aqua-400" />
            How it works
          </p>
          <h2 className="mt-4 text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.1] tracking-[-0.02em] text-hero-ink">
            The Meptrasoft loop
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-hero-soft">
            One closed system: products fund learning, learners ship real work, and their work
            flows back into the products.
          </p>
        </Reveal>
      </div>

      {isDesktop && !reducedMotion ? <CircleWidget /> : <StackedLoop />}
    </section>
  );
}

/* --------------- Desktop: interactive circular widget --------------- */

function CircleWidget() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((p) => (p + 1) % loopSteps.length), 3200);
    return () => clearInterval(id);
  }, [paused]);

  const step = loopSteps[active];
  const accent = ACCENT[step.accent];

  return (
    <div className="container-page pb-20 pt-12 md:pb-28">
      <div
        className="relative mx-auto aspect-square w-full max-w-[520px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* outer ambient dashed ring */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[93%] w-[93%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-slate-500/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 70, ease: "linear", repeat: Infinity }}
        />
        {/* gradient track the nodes sit on — same aqua→amber gradient as the header Contact button */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[84%] w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "conic-gradient(from 90deg, var(--color-aqua-400), var(--color-amber-500), var(--color-aqua-400))",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 2.5px))",
            opacity: 0.7,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, ease: "linear", repeat: Infinity }}
        />
        {/* glow that follows the active accent */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          animate={{ backgroundColor: accent.hex, opacity: 0.14 }}
          transition={{ duration: 0.6 }}
        />

        {/* center hub */}
        <div className="absolute left-1/2 top-1/2 flex h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/10 bg-navy-800/70 p-6 text-center backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 0.9, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <span className={cn("text-[11px] font-bold uppercase tracking-[0.18em]", accent.text)}>
                {step.eyebrow}
              </span>
              <h3 className="mt-2 text-[clamp(16px,2vw,20px)] font-bold leading-[1.2] tracking-[-0.01em] text-hero-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-hero-soft [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] overflow-hidden">
                {step.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* orbiting nodes */}
        {loopSteps.map((s, i) => {
          const isActive = i === active;
          const a = ACCENT[s.accent];
          const pos = nodePos(NODE_ANGLES[i]);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${s.node}: ${s.title}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={pos}
            >
              <motion.span
                className={cn(
                  "flex flex-col items-center gap-2",
                )}
                animate={{ scale: isActive ? 1.08 : 1 }}
                transition={{ duration: 0.35, ease: [0.22, 0.9, 0.3, 1] }}
              >
                <motion.span
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full border-2 bg-navy-800 transition-colors md:h-[72px] md:w-[72px]",
                    isActive ? cn(a.border, a.text) : "border-slate-500/40 text-slate-400"
                  )}
                  animate={{
                    boxShadow: isActive
                      ? `0 0 0 6px ${a.hex}22, 0 10px 30px -8px ${a.hex}88`
                      : "0 0 0 0px rgba(0,0,0,0)",
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <Icon name={NODE_ICON[s.node]} size={26} />
                </motion.span>
                <span
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-[0.14em] transition-colors",
                    isActive ? a.text : "text-slate-500"
                  )}
                >
                  {s.node}
                </span>
              </motion.span>
            </button>
          );
        })}
      </div>

      {/* pager */}
      <div className="mt-2 flex items-center justify-center gap-2">
        {loopSteps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Go to step ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? cn("w-8", ACCENT[s.accent].bg) : "w-4 bg-slate-500/30 hover:bg-slate-500/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Mobile / reduced-motion: stacked cards ----------------------------- */

function StackedLoop() {
  return (
    <div className="container-page section-pad pt-12">
      <div className="relative mx-auto max-w-[560px]">
        {loopSteps.map((step, i) => {
          const a = ACCENT[step.accent];
          return (
            <Reveal key={step.id} delay={i * 0.08} className="relative pb-10 pl-16 last:pb-0">
              {i < loopSteps.length - 1 && (
                <span
                  className="absolute bottom-0 left-[23px] top-12 w-px bg-gradient-to-b from-slate-500/40 to-slate-500/10"
                  aria-hidden
                />
              )}
              <span
                className={cn(
                  "absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-navy-800",
                  a.border,
                  a.text
                )}
              >
                <Icon name={NODE_ICON[step.node]} size={18} />
              </span>

              <p className={cn("eyebrow", a.text)}>{step.eyebrow}</p>
              <h3 className="mt-2 text-[19px] font-bold leading-[1.2] tracking-[-0.01em] text-hero-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-hero-soft">{step.body}</p>
            </Reveal>
          );
        })}

        <Reveal delay={loopSteps.length * 0.08} className="relative pl-16">
          <span
            className="absolute left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-aqua-400/50 text-aqua-400"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 12a9 9 0 1 1 3 6.7" strokeLinecap="round" />
              <path d="M3 18v-5h5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="font-mono text-[11px] uppercase tracking-[0.09em] text-aqua-300">
            Loops back to products — closed system
          </p>
        </Reveal>
      </div>
    </div>
  );
}
