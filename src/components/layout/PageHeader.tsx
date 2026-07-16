import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const accentText: Record<string, string> = {
  teal: "text-aqua-300",
  amber: "text-amber-300",
  navy: "text-aqua-300",
};

/** Compact top band for inner pages (not the full home hero). Pass `image`
 *  to render a graphic on the right in a two-column layout. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  accent = "navy",
  image,
  imageAlt = "",
  imageWide = false,
  children,
  breadcrumbs,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  accent?: "teal" | "amber" | "navy";
  image?: string;
  imageAlt?: string;
  /** Give the image column more room, extending it toward the text column. */
  imageWide?: boolean;
  children?: ReactNode;
  breadcrumbs?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-hero-ink">
      <div className="circuit-grid pointer-events-none absolute inset-0 opacity-30" />
      {breadcrumbs}
      <div
        className={cn(
          "container-page relative z-10",
          breadcrumbs ? "pb-16 pt-6 md:pb-24 md:pt-8" : compact ? "pb-16 pt-16 md:pb-24 md:pt-20" : "pb-16 pt-28 md:pb-24 md:pt-36",
          image && (imageWide ? "grid items-center gap-6 md:grid-cols-[0.85fr_1.15fr]" : "grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]")
        )}
      >
        <div>
          <p className={cn("eyebrow inline-flex items-center gap-2.5", accentText[accent])}>
            <span className="h-px w-6 bg-current opacity-70" />
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-[18ch] text-[clamp(30px,5vw,52px)] font-bold leading-[1.06] tracking-[-0.02em] text-balance">
            {title}
          </h1>
          {subtitle && <p className="mt-4 max-w-[52ch] text-[clamp(15px,1.6vw,18px)] leading-relaxed text-hero-soft">{subtitle}</p>}
          {children && <div className="mt-7">{children}</div>}
        </div>

        {image && (
          <div className={cn("relative md:flex md:justify-end", imageWide && "md:-ml-16")}>
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,180,174,0.22),transparent_66%)] blur-2xl"
            />
            <img
              src={image}
              alt={imageAlt}
              loading="eager"
              className={cn(
                "relative block mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.35)] md:mx-0",
                imageWide ? "max-w-[90%] -translate-x-[15%] md:max-w-none md:w-[min(90%,620px)] md:translate-x-[3%]" : "w-[min(130%,780px)]"
              )}
            />
          </div>
        )}
      </div>
    </section>
  );
}
