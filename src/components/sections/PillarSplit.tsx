import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";

interface Panel {
  id: string;
  accent: "teal" | "amber";
  eyebrow: string;
  title: string;
  intro: string;
  bullets: string[];
  cta: { label: string; href: string };
}

const panels: Panel[] = [
  {
    id: "solutions",
    accent: "teal",
    eyebrow: "Technology Services",
    title: "AI & engineering for business",
    intro: "We design, build, and run software that ships — not slideware.",
    bullets: ["AI & Generative AI", "Web & App Development", "Data Engineering & BI", "Cloud, Security & DevOps"],
    cta: { label: "Explore services", href: "/solutions/services" },
  },
  {
    id: "learn",
    accent: "amber",
    eyebrow: "Learn & Grow",
    title: "Engineers trained on real work",
    intro: "Students learn by building on the same products we ship to clients.",
    bullets: ["Courses", "Internships", "Final-year projects", "Certifications"],
    cta: { label: "Start learning", href: "/learn" },
  },
];

const dotColor: Record<Panel["accent"], string> = {
  teal: "bg-aqua-400",
  amber: "bg-amber-400",
};
const eyebrowColor: Record<Panel["accent"], string> = {
  teal: "text-aqua-300",
  amber: "text-amber-300",
};

export function PillarSplit() {
  return (
    <section className="section-dark section-pad">
      <div aria-hidden className="glow-teal pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full" />
      <div aria-hidden className="glow-amber pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal>
          <h2 className="max-w-[24ch] text-[clamp(26px,3.4vw,36px)] font-bold leading-tight tracking-[-0.02em] text-hero-ink">
            One company, two pillars.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {panels.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <Link
                to={p.cta.href}
                className="group flex h-full flex-col glass rounded-[var(--radius-lg)] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_36px_-16px_rgba(0,180,174,0.20)]"
              >
                <p className={cn("eyebrow", eyebrowColor[p.accent])}>{p.eyebrow}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.01em] text-hero-ink">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-hero-soft">{p.intro}</p>

                <ul className="mt-6 space-y-3">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-[15px] text-hero-ink">
                      <span
                        className={cn("h-2 w-2 shrink-0 rounded-full", dotColor[p.accent])}
                        aria-hidden
                      />
                      {b}
                    </li>
                  ))}
                </ul>

                <span
                  className={cn(
                    "mt-7 inline-flex items-center gap-1.5 text-sm font-semibold",
                    eyebrowColor[p.accent]
                  )}
                >
                  {p.cta.label}
                  <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
