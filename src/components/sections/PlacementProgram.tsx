import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { placementProgram as pp, placementJourney } from "@/data/content";

/** Flagship placement-prep program — the recommended track for college students.
 *  The bundle is shown as an ordered journey: each step tells the student why it
 *  matters and what goes wrong without it. */
export function PlacementProgram() {
  return (
    <section id="placement" className="section-pad section-dark scroll-mt-6">
      <div aria-hidden className="glow-amber pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full" />
      <div aria-hidden className="glow-teal pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal className="max-w-[64ch]">
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

        {/* demo + logistics + tiers strip */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Reveal className="rounded-[var(--radius-lg)] border border-amber-400/25 bg-amber-500/[0.07] p-5 lg:col-span-2">
            <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-amber-300">
              <Icon name="check" size={14} /> Risk-free demo
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-hero-ink">{pp.demo}</p>
          </Reveal>
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

        {/* the journey roadmap */}
        <Reveal className="mt-14">
          <h3 className="text-[clamp(20px,2.6vw,28px)] font-bold tracking-[-0.02em] text-hero-ink">
            Your step-by-step placement journey
          </h3>
          <p className="mt-2 max-w-[60ch] text-[14px] text-hero-soft">
            Follow the exact order that gets freshers hired — and see what you risk by skipping each step.
          </p>
        </Reveal>

        <ol className="relative mt-9 space-y-4 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-amber-400/50 before:via-amber-400/25 before:to-transparent md:before:left-[23px]">
          {placementJourney.map((s, i) => (
            <motion.li
              key={s.n}
              className="relative flex gap-4 md:gap-6"
              initial={{ opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 0.9, 0.3, 1] }}
            >
              {/* node */}
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 font-mono text-[15px] font-bold text-[#20160a] shadow-[0_0_0_5px_rgba(245,166,35,0.12)] md:h-12 md:w-12 md:text-[17px]">
                {s.n}
              </span>

              {/* card */}
              <div className="group flex-1 rounded-[var(--radius-lg)] glass p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 md:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-[17px] font-bold tracking-[-0.01em] text-hero-ink">{s.title}</h4>
                  <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200">
                    {s.skills}
                  </span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <p className="flex items-start gap-2 text-[13.5px] leading-relaxed text-hero-soft">
                    <Icon name="check" size={15} className="mt-0.5 shrink-0 text-aqua-400" />
                    <span><span className="font-semibold text-hero-ink">Why:</span> {s.why}</span>
                  </p>
                  <p className="flex items-start gap-2 text-[13.5px] leading-relaxed text-hero-soft">
                    <span className="mt-0.5 shrink-0 text-amber-400">✕</span>
                    <span><span className="font-semibold text-amber-200">Without it:</span> {s.pain}</span>
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* ongoing support + CTA */}
        <div className="mt-10 flex flex-col items-start gap-5 rounded-[var(--radius-lg)] glass p-7 sm:flex-row sm:items-center sm:justify-between">
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
