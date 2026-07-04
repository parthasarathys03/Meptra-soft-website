/** Shared content-model types. New offerings = new data, not new pages. */

export type Pillar = "solutions" | "learn" | "careers";
export type Accent = "teal" | "amber" | "aqua" | "navy";

export interface NavChild {
  label: string;
  href: string;
  desc?: string;
}

export interface NavGroup {
  label: string;
  href: string;
  accent: Accent;
  children?: NavChild[];
}

export interface Offering {
  id: string;
  title: string;
  summary: string;
  /** meta chips e.g. ["12 weeks", "Beginner", "Certificate"] */
  meta?: string[];
  price?: string;
  cta?: { label: string; href: string };
  accent: Accent;
  icon?: string;
  /** filter grouping for the services catalog */
  category?: string;
  /** concrete deliverables shown as a checklist on rich cards */
  points?: string[];
  /** prominent duration/label badge, e.g. "2–4 months" or "Free" */
  duration?: string;
}

export interface Product {
  id: string;
  name: string;
  what: string;
  /** bento span: 1 = 1x1, 2 = wide/tall feature */
  span?: 1 | 2;
  tag?: string;
  image?: string;
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

export interface LoopStep {
  id: string;
  node: "products" | "learners" | "projects";
  eyebrow: string;
  title: string;
  body: string;
  accent: Extract<Accent, "teal" | "amber" | "aqua">;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Role {
  id: string;
  title: string;
  type: string;
  location: string;
}
