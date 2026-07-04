import { Hero } from "@/components/sections/Hero";
import { AudienceFork } from "@/components/sections/AudienceFork";
import { PillarSplit } from "@/components/sections/PillarSplit";
import { BentoProducts } from "@/components/sections/BentoProducts";
import { EcosystemLoop } from "@/components/sections/EcosystemLoop";
import { StatBand } from "@/components/sections/StatBand";
import { LearnPreview } from "@/components/sections/LearnPreview";
import { SolutionsPreview } from "@/components/sections/SolutionsPreview";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { Vision } from "@/components/sections/Vision";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <AudienceFork />
      <PillarSplit />
      <BentoProducts />
      <EcosystemLoop />
      <StatBand />
      {/* Learn before Solutions — student-forward on every platform */}
      <LearnPreview />
      <SolutionsPreview preview />
      <TrustMarquee />
      <Vision />
      <FinalCTA />
    </>
  );
}
