import { Reveal } from "@/components/motion/Reveal";
import { LogoWheel } from "@/components/motion/LogoWheel";
import { techStack } from "@/data/content";

/** "Technologies you'll master" — the interactive 3D logo ring on the Learn page. */
export function TechRing() {
  return (
    <section className="section-pad section-dark scroll-mt-6">
      <div aria-hidden className="glow-amber pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal className="mx-auto max-w-[60ch] text-center">
          <p className="eyebrow text-amber-300">Tools & Stack</p>
          <h2 className="mt-3 text-[clamp(24px,3vw,34px)] font-bold tracking-[-0.02em] text-hero-ink">
            Technologies you&apos;ll master.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-hero-soft">
            Drag the ring — these are the tools you&apos;ll actually build with across our courses.
          </p>
        </Reveal>
      </div>
      <div className="relative z-10 mt-6">
        <LogoWheel items={techStack} />
      </div>
    </section>
  );
}
