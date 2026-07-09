import type { IconName } from "@/components/ui/Icon";

export interface LandingHighlight {
  icon: IconName;
  title: string;
  body: string;
}

export interface LandingContent {
  slug: string;
  path: string;
  accent: "teal" | "amber" | "navy";
  image: string;
  imageAlt: string;
  eyebrow: string;
  h1: string;
  subtitle: string;
  intro: string[];
  highlights: LandingHighlight[];
  checklist: string[];
  related: { label: string; to: string }[];
  faqs: { question: string; answer: string }[];
  cta: { title: string; body: string };
}

export const landings: LandingContent[];
export function getLanding(slug: string): LandingContent | undefined;
