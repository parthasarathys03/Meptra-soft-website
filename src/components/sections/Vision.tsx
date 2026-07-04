import { Reveal } from "@/components/motion/Reveal";

export function Vision() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-hero-ink section-pad">
      <div className="circuit-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden />

      <div className="container-page relative z-10">
        <Reveal className="mx-auto max-w-[60ch] text-center">
          <p className="eyebrow inline-flex items-center gap-2.5 text-aqua-300">
            <span className="h-px w-6 bg-aqua-400" />
            Why we exist
          </p>
          <p className="mt-5 text-[clamp(18px,2.2vw,24px)] leading-relaxed text-hero-soft">
            We sit between industry and education, not on either side alone. Our engineers
            build real AI products for paying clients, and our students learn by working
            inside those same codebases — not case studies written after the fact.
          </p>
          <div className="mx-auto mt-6 h-px w-16 bg-teal-500/60" aria-hidden />
        </Reveal>
      </div>
    </section>
  );
}
