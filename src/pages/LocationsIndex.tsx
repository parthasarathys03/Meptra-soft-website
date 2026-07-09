import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { RouteSeoTags } from "@/components/seo/Seo";
import { getRoute } from "@/seo/routes";
import { locations, zones } from "@/data/locations";

export default function LocationsIndex() {
  return (
    <>
      <RouteSeoTags route={getRoute("/locations")} />
      <PageHeader
        eyebrow="Areas We Serve"
        title="AI training & software across every Tamil Nadu district"
        subtitle="We work with students and businesses in all 38 districts of Tamil Nadu and Puducherry — online-first, so distance is never the barrier."
        accent="navy"
      />
      <section className="section-pad section-dark">
        <div className="container-page relative z-10 flex flex-col gap-12">
          {zones.map((zone) => {
            const cities = locations.filter((l) => l.zone === zone);
            if (!cities.length) return null;
            return (
              <div key={zone}>
                <h2 className="text-[clamp(18px,2.2vw,24px)] font-bold text-hero-ink">{zone}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {cities.map((c) => (
                    <Reveal key={c.slug}>
                      <Link
                        to={`/locations/${c.slug}`}
                        className="glass group flex items-center gap-2.5 rounded-[var(--radius-md)] p-3.5 transition-transform hover:-translate-y-0.5"
                      >
                        <Icon name="map-pin" size={15} className="shrink-0 text-aqua-300" />
                        <span className="text-sm font-semibold text-hero-ink">{c.city}</span>
                        <Icon
                          name="arrow-right"
                          size={12}
                          className="ml-auto text-aqua-300 transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
