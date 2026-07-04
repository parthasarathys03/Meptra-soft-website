import { PageHeader } from "@/components/layout/PageHeader";
import { BentoProducts } from "@/components/sections/BentoProducts";
import { ServicesCatalog } from "@/components/sections/ServicesCatalog";
import { BusinessOutcomes } from "@/components/sections/BusinessOutcomes";
import { DataAI } from "@/components/sections/DataAI";
import { OurWork } from "@/components/sections/OurWork";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Solutions() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Technology services and AI products, built to ship."
        subtitle="We deliver AI, software, data, and cloud services for businesses — and build our own AI products on the same stack."
        accent="teal"
        image="/assets/aiandit.png"
        imageAlt="Meptrasoft AI ecosystem — cloud, data, security, software, and AI solutions"
      />
      <ServicesCatalog />
      <BusinessOutcomes />
      <DataAI />
      <BentoProducts />
      <OurWork />
      <FinalCTA />
    </>
  );
}
