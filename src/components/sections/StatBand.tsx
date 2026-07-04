import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { proofStats } from "@/data/content";

export function StatBand() {
  return (
    <section className="section-pad relative overflow-hidden bg-ink-900 text-hero-ink">
      <div className="circuit-grid pointer-events-none absolute inset-0 opacity-10" aria-hidden />

      <div className="container-page relative z-10">
        <Reveal>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {proofStats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <dd className="text-[clamp(32px,4.4vw,48px)] font-bold leading-none tracking-[-0.02em]" style={{ fontVariantNumeric: "tabular-nums" }}>
                  <CountUp to={s.value} />
                  <span className="text-aqua-400">{s.suffix}</span>
                </dd>
                <dt className="mt-3 font-mono text-[11px] uppercase tracking-[0.09em] text-hero-soft">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
