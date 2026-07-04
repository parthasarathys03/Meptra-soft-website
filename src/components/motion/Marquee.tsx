import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  /** seconds per loop */
  speed?: number;
  className?: string;
  reverse?: boolean;
}

/**
 * CSS-only infinite marquee (cheap, mobile-safe). Duplicates content for a
 * seamless loop, masks edges, pauses on hover + reduced-motion.
 */
export function Marquee({ children, speed = 26, className, reverse }: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        "[mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]",
        className
      )}
    >
      <div
        className="flex w-max gap-12 py-6 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center gap-12">{children}</div>
        <div className="flex shrink-0 items-center gap-12" aria-hidden>
          {children}
        </div>
      </div>
      <style>{`@keyframes marquee{to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
