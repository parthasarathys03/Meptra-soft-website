import { Button } from "@/components/ui/Button";
import { OfferingCard } from "@/components/ui/OfferingCard";
import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/data/content";

/** Technology Services catalog. `preview` (used on Home) shows a curated subset
 *  linking through to the full page; without it (the Solutions page) the whole
 *  catalog renders and the CTA points to contact. Teal lane. */
export function SolutionsPreview({ preview = false }: { preview?: boolean }) {
  const shown = preview ? services.slice(0, 8) : services;

  return (
    <section className="section-pad section-dark">
      <div aria-hidden className="glow-teal pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full" />
      <div aria-hidden className="glow-teal pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal className="max-w-[62ch]">
          <p className="eyebrow text-aqua-300">Technology Services</p>
          <h2 className="mt-3 text-[clamp(26px,3.4vw,38px)] font-bold tracking-[-0.02em] text-hero-ink">
            {preview
              ? "Engineering services from the team that ships our own products."
              : "Everything we build for businesses, in one place."}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-hero-soft">
            AI and generative AI, web and app development, data engineering, cloud, security, and
            more — scoped to your workflow, not a template.
          </p>
        </Reveal>

        {/* Mobile: horizontal swipe row */}
        <div className="mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
          {shown.map((service) => (
            <div key={service.id} className="w-[72%] shrink-0 snap-start">
              <OfferingCard item={service} />
            </div>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="mt-8 hidden grid-cols-2 gap-5 md:grid lg:grid-cols-4">
          {shown.map((service) => (
            <OfferingCard key={service.id} item={service} />
          ))}
        </div>

        <div className="mt-9 flex justify-center md:justify-start">
          {preview ? (
            <Button variant="outline-light" to="/solutions/services">
              See all services
            </Button>
          ) : (
            <Button variant="amber" to="/contact">
              Discuss your project
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
