import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/motion/CountUp";
import { heroStats } from "@/data/content";

// three.js is ~129 kB gzip. The globe is decorative (aria-hidden) and not the
// LCP element, so defer its chunk off the critical path and only mount it once
// the browser is idle after first paint. The container below reserves its box
// so the late mount causes no layout shift.
const Globe = lazy(() =>
  import("@/components/brand/Globe").then((m) => ({ default: m.Globe }))
);

const HEADLINE = ["We", "build", "AI products—", "and", "the", "engineers", "who", "build", "them."];

export function Hero() {
  const [showGlobe, setShowGlobe] = useState(false);
  useEffect(() => {
    const ric =
      window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(() => setShowGlobe(true));
    return () => cancel(id as number);
  }, []);

  return (
    <section className="mesh-hero relative flex flex-col overflow-hidden text-hero-ink md:min-h-screen">
      <div className="container-page relative z-10 grid flex-1 items-center gap-6 pt-24 pb-6 md:grid-cols-[1.05fr_0.95fr] md:content-center md:pt-28 md:pb-10">
        <div>
          <motion.p
            className="eyebrow mb-5 inline-flex items-center gap-2.5 text-aqua-300"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <span className="h-px w-6 bg-aqua-400" />
            AI Products × Engineering Education
          </motion.p>

          <h1 className="max-w-[15ch] text-[clamp(28px,4.2vw,46px)] font-bold leading-[1.06] tracking-[-0.028em] text-balance">
            {HEADLINE.map((w, i) => (
              <motion.span
                key={i}
                className={`inline-block ${w.startsWith("AI") ? "text-gradient-brand" : ""}`}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 0.9, 0.3, 1] }}
              >
                {w}&nbsp;
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-5 max-w-[46ch] text-[clamp(15px,1.6vw,18px)] leading-relaxed text-hero-soft"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
          >
            One company, two pillars. We ship AI products for businesses — and our students learn
            by building on those same products.
          </motion.p>

          <motion.div
            className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.7 }}
          >
            <Button
              variant="outline-light"
              size="lg"
              to="/solutions"
              className="w-full whitespace-nowrap px-3 text-[13px] sm:w-auto sm:px-7 sm:text-base"
            >
              Explore Solutions
            </Button>
            <Button
              variant="amber"
              size="lg"
              to="/learn"
              className="w-full whitespace-nowrap px-3 text-[13px] sm:w-auto sm:px-7 sm:text-base"
            >
              Start Learning
            </Button>
          </motion.div>

          <motion.dl
            className="mt-9 grid grid-cols-2 gap-x-6 gap-y-6 sm:flex sm:flex-wrap sm:gap-7"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.7 }}
          >
            {heroStats.map((s) => (
              <div key={s.label}>
                <dd className="text-[26px] font-bold tracking-tight">
                  <CountUp to={s.value} />
                  <span className="text-aqua-400">{s.suffix}</span>
                </dd>
                <dt className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.09em] text-hero-soft">
                  {s.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        <div
          className="relative flex min-h-[min(88vw,340px)] items-center justify-center md:min-h-[min(42vw,460px)]"
          aria-hidden
        >
          {/* soft pulsing glow behind the globe */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,180,174,0.30),transparent_66%)] blur-3xl"
            animate={{ opacity: [0.45, 0.8, 0.45], scale: [0.9, 1.06, 0.9] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          {showGlobe && (
            <Suspense fallback={null}>
              <Globe className="relative aspect-square w-[min(88vw,340px)] cursor-grab [will-change:transform] active:cursor-grabbing md:w-[min(42vw,460px)]" />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  );
}
