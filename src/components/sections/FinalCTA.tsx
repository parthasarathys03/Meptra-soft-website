import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/ui/LeadForm";
import { Reveal } from "@/components/motion/Reveal";

export function FinalCTA() {
  return (
    <section className="section-pad relative overflow-hidden bg-gradient-hero text-hero-ink">
      <div className="circuit-grid pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(120%_100%_at_50%_40%,#000_40%,transparent_85%)]" />

      <div className="container-page relative grid gap-10 md:grid-cols-2 md:items-center md:gap-14">
        <Reveal>
          <p className="eyebrow text-aqua-300">Get in touch</p>
          <h2 className="mt-3 max-w-[20ch] text-[clamp(28px,4vw,42px)] font-bold leading-tight tracking-[-0.02em] text-hero-ink">
            Start building with us.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[clamp(15px,1.6vw,18px)] leading-relaxed text-hero-soft">
            Hiring a team to ship an AI product, or looking to learn on real ones — either way, the next step is
            the same: tell us where you're starting from and we'll take it from there.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="amber" size="lg" to="/learn">
              Start Learning
            </Button>
            <Button variant="outline-light" size="lg" to="/solutions">
              Explore Solutions
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <LeadForm variant="dark" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
