import { PageHeader } from "@/components/layout/PageHeader";
import { PlacementProgram } from "@/components/sections/PlacementProgram";
import { CoursesCatalog } from "@/components/sections/CoursesCatalog";
import { TechRing } from "@/components/sections/TechRing";
import { Internships } from "@/components/sections/Internships";
import { Projects } from "@/components/sections/Projects";
import { EcosystemLoop } from "@/components/sections/EcosystemLoop";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Learn() {
  return (
    <>
      <PageHeader
        eyebrow="Learn & Grow"
        title="Learn by building on real products."
        subtitle="Placement prep, job-focused courses, internships, and real projects — designed for college students who want to get hired."
        accent="amber"
        image="/assets/courses.png"
        imageAlt="Meptrasoft courses — AI, data science, and full stack training"
      />
      <PlacementProgram />
      <CoursesCatalog />
      <TechRing />
      <Internships />
      <Projects />
      <EcosystemLoop />
      <FinalCTA />
    </>
  );
}
