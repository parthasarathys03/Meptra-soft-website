import { Link } from "react-router-dom";
import type { Offering } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TiltCard } from "@/components/motion/TiltCard";
import { Icon, type IconName } from "@/components/ui/Icon";

const accentText: Record<string, string> = {
  teal: "text-aqua-300",
  amber: "text-amber-300",
  aqua: "text-aqua-300",
  navy: "text-aqua-300",
};
const accentIcon: Record<string, string> = {
  teal: "bg-aqua-400/12 text-aqua-300 ring-aqua-400/20",
  amber: "bg-amber-500/12 text-amber-300 ring-amber-400/20",
  aqua: "bg-aqua-400/12 text-aqua-300 ring-aqua-400/20",
  navy: "bg-white/8 text-hero-ink ring-white/15",
};
const durationBadge: Record<string, string> = {
  teal: "bg-aqua-400/15 text-aqua-200 ring-1 ring-aqua-400/30",
  amber: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/30",
  aqua: "bg-aqua-400/15 text-aqua-200 ring-1 ring-aqua-400/30",
  navy: "bg-white/10 text-hero-ink ring-1 ring-white/20",
};
const accentHover: Record<string, string> = {
  teal: "group-hover:border-aqua-400/50 group-hover:shadow-[0_14px_36px_-16px_rgba(0,180,174,0.26)]",
  amber: "group-hover:border-amber-400/50 group-hover:shadow-[0_14px_36px_-16px_rgba(245,166,35,0.22)]",
  aqua: "group-hover:border-aqua-400/50 group-hover:shadow-[0_14px_36px_-16px_rgba(0,180,174,0.26)]",
  navy: "group-hover:border-white/25",
};
const accentGlow: Record<string, string> = {
  teal: "bg-aqua-400/25",
  amber: "bg-amber-500/25",
  aqua: "bg-aqua-400/25",
  navy: "bg-white/10",
};

/** Reusable dark-glass card for courses, internships, services. */
export function OfferingCard({ item, className }: { item: Offering; className?: string }) {
  return (
    <TiltCard className={cn("h-full", className)}>
      <div
        className={cn(
          "group glass relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] p-6 transition-all duration-300 hover:-translate-y-1.5",
          accentHover[item.accent]
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100",
            accentGlow[item.accent]
          )}
        />

        {(item.icon || item.duration) && (
          <div className="relative mb-4 flex items-center justify-between gap-3">
            {item.icon && (
              <span
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-[14px] ring-1 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110",
                  accentIcon[item.accent]
                )}
              >
                <Icon name={item.icon as IconName} size={20} />
              </span>
            )}
            {item.duration && (
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em]", durationBadge[item.accent])}>
                <Icon name="gauge" size={12} />
                {item.duration}
              </span>
            )}
          </div>
        )}

        <h3 className="relative text-lg font-bold tracking-[-0.01em] text-hero-ink">{item.title}</h3>
        <p className="relative mt-2 text-sm leading-relaxed text-hero-soft">{item.summary}</p>

        {item.meta && (
          <ul className="relative mt-4 flex flex-wrap gap-1.5">
            {item.meta.map((m) => (
              <li
                key={m}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-hero-soft"
              >
                {m}
              </li>
            ))}
          </ul>
        )}

        {(item.price || item.cta) && (
          <div className="relative mt-5 flex items-center justify-between">
            {item.price && <span className="text-sm font-semibold text-hero-ink">{item.price}</span>}
            {item.cta && (
              <Link
                to={item.cta.href}
                className={cn("inline-flex items-center gap-1.5 text-sm font-semibold", accentText[item.accent])}
              >
                {item.cta.label}
                <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        )}
      </div>
    </TiltCard>
  );
}
