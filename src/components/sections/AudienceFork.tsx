import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";

interface Card {
  id: string;
  order: string;
  accent: "teal" | "amber";
  eyebrow: string;
  title: string;
  sublabel: string;
  to: string;
  ctaLabel: string;
  icon: IconName;
  bg: string;
}

const cards: Card[] = [
  {
    id: "business",
    order: "md:order-1 order-2",
    accent: "teal",
    eyebrow: "For Business",
    title: "Ship an AI product",
    sublabel: "products · services · case studies",
    to: "/solutions",
    ctaLabel: "Explore Solutions",
    icon: "building",
    bg: "/assets/pillar-1-left.jpeg",
  },
  {
    id: "students",
    order: "md:order-2 order-1",
    accent: "amber",
    eyebrow: "For Students",
    title: "Learn on real products",
    sublabel: "courses · internships · projects",
    to: "/learn",
    ctaLabel: "Start Learning",
    icon: "graduation",
    bg: "/assets/pillar-2-right.jpeg",
  },
];

const accentHover: Record<Card["accent"], string> = {
  teal: "group-hover:border-aqua-400/50 group-hover:shadow-[0_14px_36px_-16px_rgba(0,180,174,0.26)]",
  amber: "group-hover:border-amber-400/50 group-hover:shadow-[0_14px_36px_-16px_rgba(245,166,35,0.22)]",
};
const accentGlow: Record<Card["accent"], string> = {
  teal: "bg-aqua-400/25",
  amber: "bg-amber-500/25",
};
const accentIconWrap: Record<Card["accent"], string> = {
  teal: "bg-aqua-400/12 text-aqua-300",
  amber: "bg-amber-500/15 text-amber-300",
};

export function AudienceFork() {
  return (
    <section className="section-dark-alt section-pad">
      <div aria-hidden className="glow-teal pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full" />
      <div aria-hidden className="glow-amber pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal>
          <p className="eyebrow text-aqua-300">Where do you fit</p>
          <h2 className="mt-3 max-w-[36ch] text-[clamp(24px,3.2vw,34px)] font-bold leading-tight tracking-[-0.02em] text-hero-ink">
            Two doors in. Pick the one that's yours.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cards.map((c, i) => {
            return (
              <Reveal key={c.id} delay={i * 0.08} className={c.order}>
                <div
                  className={cn(
                    "group relative flex h-full min-h-[380px] flex-col overflow-hidden glass rounded-[var(--radius-lg)] p-7 transition-all duration-300 hover:-translate-y-1.5",
                    accentHover[c.accent]
                  )}
                >
                  {/* background image */}
                  <img
                    src={c.bg}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* readability overlay — dark on the text side, image visible on the far side */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/85 to-ink-900/30"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/90 to-transparent"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
                      accentGlow[c.accent]
                    )}
                  />

                  {/* content */}
                  <div className="relative z-10 flex h-full flex-col">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)]",
                        accentIconWrap[c.accent]
                      )}
                    >
                      <Icon name={c.icon} size={24} />
                    </div>

                    <p
                      className={cn(
                        "eyebrow mt-5",
                        c.accent === "teal" ? "text-aqua-300" : "text-amber-300"
                      )}
                    >
                      {c.eyebrow}
                    </p>
                    <h3 className="mt-2 text-xl font-bold tracking-[-0.01em] text-hero-ink">{c.title}</h3>
                    <p className="mt-2 flex-1 font-mono text-[12.5px] uppercase tracking-[0.06em] text-hero-soft">
                      {c.sublabel}
                    </p>

                    <div className="mt-6">
                      <Button variant={c.accent === "teal" ? "outline-light" : "amber"} to={c.to}>
                        {c.ctaLabel}
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
