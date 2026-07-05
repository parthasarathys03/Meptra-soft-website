import { PageHeader } from "@/components/layout/PageHeader";
import { PillarSplit } from "@/components/sections/PillarSplit";
import { EcosystemLoop } from "@/components/sections/EcosystemLoop";
import { StatBand } from "@/components/sections/StatBand";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="One company bridging industry and education."
        subtitle="We build AI products for businesses and train the engineers who build them. The two sides feed each other — that's the whole idea."
        accent="navy"
        image="/assets/about.png"
        imageAlt="Meptrasoft AI Technologies"
      />
      <PillarSplit />
      <EcosystemLoop />
      <StatBand />
      <FinalCTA />
    </>
  );
}
