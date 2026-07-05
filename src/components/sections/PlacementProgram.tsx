import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import {
  placementProgram as pp,
  placementJourney,
  placementIncludes,
  communicationRound as comm,
  placementOrder as order,
} from "@/data/content";

// Stagger container + item used for the "What You'll Learn" maps. The list stays
// hidden until its step scrolls into view, then the chips fade in live one by one.
const listWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.12 } },
};
const chip: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.22, 0.9, 0.3, 1] } },
};

/** Flagship placement-prep program — the recommended track for college students.
 *  The curriculum is shown as the real campus-placement sequence: an ordered,
 *  scroll-animated roadmap where each round reveals what you'll learn, why it
 *  matters, and what goes wrong without it. */
export function PlacementProgram() {
  // Scroll-linked progress for the vertical timeline. The bright fill + comet
  // track the reader's position through the roadmap ("live" as they scroll).
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 78%", "end 55%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const cometTop = useTransform(fill, (v) => `${v * 100}%`);

  return (
    <section id="placement" className="section-pad section-dark scroll-mt-6">
      <div aria-hidden className="glow-amber pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full" />
      <div aria-hidden className="glow-teal pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full" />
      <div className="container-page relative z-10">
        {/* ── header ── */}
        <Reveal className="max-w-[66ch]">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1.5 text-[12px] font-semibold text-amber-300">
            <Icon name="star" size={13} />
            {pp.badge}
          </span>
          <p className="eyebrow mt-4 text-amber-300">{pp.eyebrow}</p>
          <h2 className="mt-3 text-[clamp(28px,3.8vw,42px)] font-bold leading-[1.08] tracking-[-0.02em] text-hero-ink">
            {pp.title}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-hero-soft">{pp.tagline}</p>
        </Reveal>

        {/* ── risk-free demo + tiers ── */}
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Reveal className="rounded-[var(--radius-lg)] border border-amber-400/25 bg-amber-500/[0.06] p-6 md:p-7">
            <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-amber-300">
              <Icon name="check" size={14} /> Risk-Free Demo
            </p>
            <h3 className="mt-2 text-[20px] font-bold tracking-[-0.01em] text-hero-ink">{pp.demo.headline}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-hero-soft">
              Attend our{" "}
              <span className="font-semibold text-amber-200">FREE 3-day live demo classes</span>.
            </p>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {pp.demo.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-hero-soft">
                  <Icon name="check" size={15} className="mt-0.5 shrink-0 text-aqua-400" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-4 py-1.5 text-[13px] font-bold text-amber-200">
              {pp.demo.tagline}
            </p>
          </Reveal>

          <div className="grid gap-4">
            {pp.tiers.map((t, i) => (
              <Reveal key={t.name} delay={0.06 + i * 0.06} className="flex items-start gap-3 rounded-[var(--radius-lg)] glass p-5">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-amber-500/12 text-amber-300 ring-1 ring-amber-400/20">
                  <Icon name={t.icon as IconName} size={18} />
                </span>
                <div>
                  <p className="text-[14px] font-bold text-hero-ink">{t.name}</p>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-hero-soft">{t.summary}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── everything you need to get placed ── */}
        <Reveal className="mt-14 max-w-[60ch]">
          <h3 className="text-[clamp(20px,2.6vw,28px)] font-bold tracking-[-0.02em] text-hero-ink">
            Everything you need to get placed
          </h3>
          <p className="mt-2 text-[14px] text-hero-soft">
            One program, every skill and support a fresher needs — from your first class to your first offer.
          </p>
        </Reveal>
        <motion.ul
          variants={listWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {placementIncludes.map((f) => (
            <motion.li
              key={f.label}
              variants={chip}
              className="group flex items-center gap-3 rounded-[var(--radius-md)] glass px-4 py-3 transition-colors duration-300 hover:border-amber-400/40"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-amber-500/12 text-amber-300 ring-1 ring-amber-400/20 transition-transform duration-300 group-hover:scale-110">
                <Icon name={f.icon as IconName} size={16} />
              </span>
              <span className="text-[13.5px] font-medium text-hero-ink">{f.label}</span>
              <Icon name="check" size={15} className="ml-auto shrink-0 text-aqua-400" />
            </motion.li>
          ))}
        </motion.ul>

        {/* ── the journey roadmap ── */}
        <Reveal className="mt-16 max-w-[62ch]">
          <h3 className="text-[clamp(20px,2.6vw,28px)] font-bold tracking-[-0.02em] text-hero-ink">
            Your step-by-step placement journey
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-hero-soft">
            Our curriculum follows the same sequence used in real IT campus placements — each round depends on
            the one before it. You can't skip a step, so every stage gets equal focus. Scroll to see what you'll
            learn, why it matters, and what you risk by skipping it.
          </p>
        </Reveal>

        {/* timeline: dim track + scroll-linked bright fill + comet */}
        <div ref={timelineRef} className="relative mt-9">
          <div className="pointer-events-none absolute left-[19px] top-2 bottom-2 w-[2px] rounded-full bg-white/8 md:left-[23px]" />
          <motion.div
            style={{ scaleY: fill }}
            className="pointer-events-none absolute left-[19px] top-2 bottom-2 w-[2px] origin-top rounded-full bg-gradient-to-b from-amber-300 via-amber-500 to-amber-500/40 md:left-[23px]"
          />
          <motion.span
            style={{ top: cometTop }}
            aria-hidden
            className="pointer-events-none absolute left-[16px] h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_14px_4px_rgba(245,166,35,0.55)] md:left-[20px]"
          />

          <ol className="relative space-y-4">
            {placementJourney.map((s, i) => (
              <StepRow key={s.n} step={s} index={i}>
                {/* branch: optional communication round after Round 2 */}
                {comm.afterStep === s.n && <CommunicationBranch />}
              </StepRow>
            ))}
          </ol>
        </div>

        {/* ── why we follow this order ── */}
        <Reveal className="mt-16 rounded-[var(--radius-lg)] glass-panel p-7 md:p-9">
          <p className="eyebrow text-amber-300">Why we follow this order</p>
          <p className="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-hero-ink">{order.intro}</p>

          {/* the flow */}
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3">
            {order.flow.map((stage, i) => (
              <span key={stage} className="flex items-center gap-2">
                <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-3.5 py-1.5 text-[13px] font-semibold text-amber-100">
                  {stage}
                </span>
                {i < order.flow.length - 1 && (
                  <Icon name="arrow-right" size={13} className="text-amber-400/60" />
                )}
              </span>
            ))}
          </div>

          <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-hero-soft">
            How we make sure it sticks
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {order.methods.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-hero-soft"
              >
                <Icon name="check" size={12} className="text-aqua-400" />
                {m}
              </span>
            ))}
          </div>

          <p className="mt-7 border-l-2 border-amber-400/60 pl-4 text-[15px] font-semibold leading-relaxed text-hero-ink">
            {order.goal}
          </p>
        </Reveal>

        {/* ── ongoing support + CTA ── */}
        <div className="mt-8 flex flex-col items-start gap-5 rounded-[var(--radius-lg)] glass p-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-hero-soft">
            <span className="flex items-center gap-2 text-hero-ink">
              <Icon name="graduation" size={16} className="text-amber-300" />
              <span className="font-semibold">{pp.duration}</span>
            </span>
            <span className="flex items-center gap-2">
              <Icon name="chat" size={15} className="text-amber-300" /> Unlimited live doubts
            </span>
            <span className="flex items-center gap-2">
              <Icon name="star" size={14} className="text-amber-300" /> Weekly calls with placed engineers
            </span>
          </div>
          <Button variant="amber" to="/contact" className="shrink-0">
            Book your free demo
          </Button>
        </div>
      </div>
    </section>
  );
}

/** One numbered round on the roadmap. Node lights up when it enters view; the
 *  "What You'll Learn" map fades in live on scroll. */
function StepRow({
  step,
  index,
  children,
}: {
  step: (typeof placementJourney)[number];
  index: number;
  children?: React.ReactNode;
}) {
  return (
    <li className="relative">
      <motion.div
        className="relative flex gap-4 md:gap-6"
        initial={{ opacity: 0, x: -14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 0.9, 0.3, 1] }}
      >
        {/* node */}
        <motion.span
          initial={{ scale: 0.6, opacity: 0.4 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-45% 0px -45% 0px" }}
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
          className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 font-mono text-[15px] font-bold text-[#20160a] shadow-[0_0_0_5px_rgba(245,166,35,0.14)] md:h-12 md:w-12 md:text-[17px]"
        >
          {step.n}
        </motion.span>

        {/* card */}
        <div className="group flex-1 rounded-[var(--radius-lg)] glass p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 md:p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h4 className="text-[18px] font-bold tracking-[-0.01em] text-hero-ink">{step.title}</h4>
            <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200">
              {step.tag}
            </span>
          </div>
          <p className="mt-1 text-[13.5px] font-medium text-amber-100/90">{step.subtitle}</p>

          {/* what you'll learn — scroll-revealed map */}
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.08em] text-hero-soft">
            What you'll learn
          </p>
          <motion.ul
            variants={listWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-2 flex flex-wrap gap-2"
          >
            {step.learn.map((item) => (
              <motion.li
                key={item}
                variants={chip}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-hero-ink"
              >
                {item}
              </motion.li>
            ))}
          </motion.ul>

          {/* why / without it */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p className="flex items-start gap-2 rounded-[var(--radius-md)] bg-aqua-400/[0.06] p-3 text-[13px] leading-relaxed text-hero-soft">
              <Icon name="check" size={15} className="mt-0.5 shrink-0 text-aqua-400" />
              <span><span className="font-semibold text-hero-ink">Why:</span> {step.why}</span>
            </p>
            <p className="flex items-start gap-2 rounded-[var(--radius-md)] bg-amber-500/[0.06] p-3 text-[13px] leading-relaxed text-hero-soft">
              <span className="mt-0.5 shrink-0 font-bold text-amber-400">✕</span>
              <span><span className="font-semibold text-amber-200">Without this:</span> {step.pain}</span>
            </p>
          </div>
        </div>
      </motion.div>

      {children}
    </li>
  );
}

/** Optional Communication & GD round — a highlighted branch off the main line. */
function CommunicationBranch() {
  return (
    <motion.div
      className="relative mt-4 flex gap-4 md:gap-6"
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.5, ease: [0.22, 0.9, 0.3, 1] }}
    >
      {/* dashed star node — distinct from the numbered rounds */}
      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-amber-400/60 bg-[#0d1b30] text-amber-300 md:h-12 md:w-12">
        <Icon name="star" size={16} />
      </span>

      <div className="flex-1 rounded-[var(--radius-lg)] border border-dashed border-amber-400/40 bg-amber-500/[0.05] p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h4 className="text-[17px] font-bold tracking-[-0.01em] text-hero-ink">{comm.title}</h4>
          <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200">
            {comm.tag}
          </span>
        </div>
        <p className="mt-2 text-[13.5px] leading-relaxed text-hero-soft">{comm.intro}</p>

        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.08em] text-hero-soft">
          {comm.prepareLabel}
        </p>
        <motion.ul
          variants={listWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-2 flex flex-wrap gap-2"
        >
          {comm.prepare.map((item) => (
            <motion.li
              key={item}
              variants={chip}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-hero-ink"
            >
              {item}
            </motion.li>
          ))}
        </motion.ul>

        <p className="mt-4 flex items-start gap-2 text-[13px] leading-relaxed text-hero-soft">
          <Icon name="check" size={15} className="mt-0.5 shrink-0 text-aqua-400" />
          <span><span className="font-semibold text-hero-ink">Why:</span> {comm.why}</span>
        </p>
        <p className="mt-3 text-[13px] font-semibold text-amber-100">{comm.note}</p>
      </div>
    </motion.div>
  );
}
