import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn, prefersReducedMotion } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { loopSteps } from "@/data/content";
import type { LoopStep } from "@/lib/types";

const ACCENT_TEXT: Record<LoopStep["accent"], string> = {
  teal: "text-aqua-300",
  amber: "text-amber-500",
  aqua: "text-aqua-400",
};

const ACCENT_BG: Record<LoopStep["accent"], string> = {
  teal: "bg-teal-500",
  amber: "bg-amber-500",
  aqua: "bg-aqua-400",
};

const ACCENT_BORDER: Record<LoopStep["accent"], string> = {
  teal: "border-teal-500",
  amber: "border-amber-500",
  aqua: "border-aqua-400",
};

const ACCENT_STROKE: Record<LoopStep["accent"], string> = {
  teal: "#2DD4BF",
  amber: "#F5A623",
  aqua: "#00B4AE",
};

/* Orbital geometry — all in ONE 420x420 SVG space (no HTML/% mismatch). */
const ORBIT = { cx: 210, cy: 210, r: 140 };
const CIRC = 2 * Math.PI * ORBIT.r;
// nodes evenly on the ring, clockwise from top: products, learners, projects
const NODE_ANGLES = [-90, 30, 150];
const nodeXY = (deg: number) => ({
  x: ORBIT.cx + ORBIT.r * Math.cos((deg * Math.PI) / 180),
  y: ORBIT.cy + ORBIT.r * Math.sin((deg * Math.PI) / 180),
});

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

  const useAuto = isDesktop && !reducedMotion;

  return (
    <section className="relative overflow-hidden bg-ink-900 text-hero-ink">
      <div className="circuit-grid pointer-events-none absolute inset-0 opacity-10" aria-hidden />

      <div className="container-page relative z-10 section-pad pb-0">
        <Reveal className="mx-auto max-w-[60ch] text-center">
          <p className="eyebrow inline-flex items-center gap-2.5 text-aqua-300 justify-center">
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

      {useAuto ? <AutoLoop /> : <StackedLoop />}
    </section>
  );
}

/* --------------- Desktop: auto-advancing orbital loop (no scroll gap) --------------- */

function AutoLoop() {
  const [activeIndex, setActiveIndex] = useState(0);

  // auto-cycle steps continuously (no hover-pause — it must always be moving)
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % loopSteps.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const activeStep = loopSteps[activeIndex];

  return (
    <div className="container-page pb-16 pt-10 md:pb-24">
      <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-[1fr_1fr]">
        <LoopDiagram activeIndex={activeIndex} />
        <StepPanel activeStep={activeStep} activeIndex={activeIndex} onSelect={setActiveIndex} />
      </div>
    </div>
  );
}

function LoopDiagram({ activeIndex }: { activeIndex: number }) {
  const activeStep = loopSteps[activeIndex];
  const accent = ACCENT_STROKE[activeStep.accent];

  // fraction of the ring "travelled" by the current step (leading edge / comet)
  const f = (activeIndex + 1) / loopSteps.length;
  const headAngle = -90 + 360 * f;
  const head = nodeXY(headAngle);

  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <svg viewBox="0 0 420 420" className="h-full w-full" aria-hidden>
        <defs>
          <filter id="loop-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* slow ambient outer ring */}
        <motion.circle
          cx={ORBIT.cx}
          cy={ORBIT.cy}
          r={ORBIT.r + 22}
          fill="none"
          stroke="#5c7085"
          strokeOpacity={0.18}
          strokeWidth={1}
          strokeDasharray="2 10"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          style={{ transformOrigin: `${ORBIT.cx}px ${ORBIT.cy}px` }}
        />

        {/* base track */}
        <circle
          cx={ORBIT.cx}
          cy={ORBIT.cy}
          r={ORBIT.r}
          fill="none"
          stroke="#5c7085"
          strokeOpacity={0.22}
          strokeWidth={2}
        />

        {/* progress arc (starts at top, grows clockwise) */}
        <motion.circle
          cx={ORBIT.cx}
          cy={ORBIT.cy}
          r={ORBIT.r}
          fill="none"
          stroke={accent}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          transform={`rotate(-90 ${ORBIT.cx} ${ORBIT.cy})`}
          animate={{ strokeDashoffset: CIRC * (1 - f) }}
          transition={{ duration: 0.7, ease: [0.22, 0.9, 0.3, 1] }}
        />

        {/* comet head at the leading edge */}
        <motion.circle
          r={6}
          fill={accent}
          filter="url(#loop-glow)"
          animate={{ cx: head.x, cy: head.y }}
          transition={{ duration: 0.7, ease: [0.22, 0.9, 0.3, 1] }}
        />

        {/* nodes on the ring */}
        {loopSteps.map((step, i) => {
          const p = nodeXY(NODE_ANGLES[i]);
          const isActive = i === activeIndex;
          const c = ACCENT_STROKE[step.accent];
          return (
            <g key={step.id}>
              {isActive && (
                <circle cx={p.x} cy={p.y} r={30} fill={c} opacity={0.16} filter="url(#loop-glow)" />
              )}
              <motion.circle
                cx={p.x}
                cy={p.y}
                fill="#0f2f50"
                animate={{ r: isActive ? 26 : 20, stroke: isActive ? c : "#5c7085" }}
                strokeWidth={isActive ? 2.5 : 1.5}
                transition={{ duration: 0.4, ease: [0.22, 0.9, 0.3, 1] }}
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                letterSpacing={0.5}
                fill={isActive ? c : "#9fb3c6"}
                style={{ transition: "fill 0.4s ease" }}
              >
                {String(i + 1).padStart(2, "0")}
              </text>
              <text
                x={p.x}
                y={p.y + (i === 0 ? -40 : 46)}
                textAnchor="middle"
                fontSize={12}
                letterSpacing={1.5}
                fill={isActive ? c : "#5c7085"}
                style={{ transition: "fill 0.4s ease", textTransform: "uppercase" }}
              >
                {step.node.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* center label */}
        <text x={ORBIT.cx} y={ORBIT.cy - 6} textAnchor="middle" fontSize={44} fontWeight={800} fill="#eaf1f7">
          {String(activeIndex + 1).padStart(2, "0")}
        </text>
        <text x={ORBIT.cx} y={ORBIT.cy + 20} textAnchor="middle" fontSize={12} letterSpacing={2} fill="#5c7085">
          / {String(loopSteps.length).padStart(2, "0")}
        </text>
      </svg>
    </div>
  );
}

function StepPanel({
  activeStep,
  activeIndex,
  onSelect,
}: {
  activeStep: LoopStep;
  activeIndex: number;
  onSelect?: (i: number) => void;
}) {
  return (
    <div className="relative min-h-[220px]">
      {loopSteps.map((step, i) => (
        <motion.div
          key={step.id}
          className="absolute inset-0"
          animate={{
            opacity: i === activeIndex ? 1 : 0,
            y: i === activeIndex ? 0 : 12,
          }}
          transition={{ duration: 0.45, ease: [0.22, 0.9, 0.3, 1] }}
          style={{ pointerEvents: i === activeIndex ? "auto" : "none" }}
        >
          <p className={cn("eyebrow", ACCENT_TEXT[step.accent])}>{step.eyebrow}</p>
          <h3 className="mt-4 text-[clamp(22px,2.8vw,32px)] font-bold leading-[1.15] tracking-[-0.02em] text-hero-ink">
            {step.title}
          </h3>
          <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-hero-soft">{step.body}</p>
        </motion.div>
      ))}

      <div className="absolute -bottom-2 left-0 flex items-center gap-2">
        {loopSteps.map((step, i) => (
          <button
            key={step.id}
            type="button"
            onClick={() => onSelect?.(i)}
            aria-label={`Go to step ${i + 1}: ${step.node}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              onSelect && "cursor-pointer",
              i === activeIndex ? cn("w-8", ACCENT_BG[activeStep.accent]) : "w-4 bg-slate-500/30 hover:bg-slate-500/50"
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
        {loopSteps.map((step, i) => (
          <Reveal key={step.id} delay={i * 0.08} className="relative pl-16 pb-10 last:pb-0">
            {i < loopSteps.length - 1 && (
              <span
                className="absolute left-[23px] top-12 bottom-0 w-px bg-gradient-to-b from-slate-500/40 to-slate-500/10"
                aria-hidden
              />
            )}
            <span
              className={cn(
                "absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-navy-800 font-mono text-[10px] font-bold",
                ACCENT_BORDER[step.accent],
                ACCENT_TEXT[step.accent]
              )}
            >
              {i + 1}
            </span>

            <p className={cn("eyebrow", ACCENT_TEXT[step.accent])}>{step.eyebrow}</p>
            <h3 className="mt-2 text-[19px] font-bold leading-[1.2] tracking-[-0.01em] text-hero-ink">
              {step.title}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-hero-soft">{step.body}</p>
          </Reveal>
        ))}

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
