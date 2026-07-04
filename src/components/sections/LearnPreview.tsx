import { Button } from "@/components/ui/Button";
import { OfferingCard } from "@/components/ui/OfferingCard";
import { Reveal } from "@/components/motion/Reveal";
import { courses } from "@/data/content";

/** Learn pillar preview: course catalog teaser. Amber lane. */
export function LearnPreview() {
  return (
    <section className="section-pad section-dark-alt">
      <div aria-hidden className="glow-amber pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full" />
      <div aria-hidden className="glow-teal pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal className="max-w-[60ch]">
          <p className="eyebrow text-amber-300">Learn &amp; Grow</p>
          <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.02em] text-hero-ink">
            Courses that end in a shipped project, not a slide deck.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-hero-soft">
            3–8 week programs in AI, data, and full stack — built by the same engineers who ship
            our products.
          </p>
        </Reveal>

        {/* Mobile: horizontal swipe row */}
        <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
          {courses.slice(0, 8).map((course) => (
            <div key={course.id} className="w-[72%] shrink-0 snap-start">
              <OfferingCard item={course} />
            </div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="mt-8 hidden grid-cols-2 gap-5 md:grid lg:grid-cols-4">
          {courses.slice(0, 8).map((course) => (
            <OfferingCard key={course.id} item={course} />
          ))}
        </div>

        <div className="mt-9 flex justify-center md:justify-start">
          <Button variant="amber" to="/learn#courses">
            See all courses
          </Button>
        </div>
      </div>
    </section>
  );
}
