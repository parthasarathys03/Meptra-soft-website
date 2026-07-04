import { useId } from "react";
import { motion } from "framer-motion";
import { prefersReducedMotion } from "@/lib/utils";

const strokes = [
  // open book
  "M200,338 L58,356 L58,420 L200,404 Z",
  "M200,338 L342,356 L342,420 L200,404 Z",
  "M200,342 L200,404",
  // trunk
  "M200,338 C200,300 200,286 200,262",
  // branches
  "M200,300 C168,286 150,278 122,258",
  "M200,294 C232,282 256,272 286,250",
  "M200,284 C186,262 176,246 168,222",
  "M200,282 C214,260 226,242 244,214",
  "M200,262 L200,150",
  // brain folds (left)
  "M150,236 C132,232 128,214 143,206 C154,200 149,188 136,190",
  "M162,258 C146,256 140,244 150,236",
  // circuit stubs
  "M200,238 C214,232 224,230 236,232",
  "M200,318 C188,314 182,312 172,314",
];

const nodes: Array<{ cx: number; cy: number; r: number; amber?: boolean }> = [
  { cx: 122, cy: 258, r: 7 },
  { cx: 286, cy: 250, r: 7 },
  { cx: 168, cy: 222, r: 6 },
  { cx: 244, cy: 214, r: 6, amber: true },
  { cx: 200, cy: 150, r: 8, amber: true },
  { cx: 236, cy: 232, r: 4 },
  { cx: 172, cy: 314, r: 4 },
  { cx: 136, cy: 190, r: 4 },
];

/**
 * The Meptrasoft signature: a brain-circuit tree growing from an open book.
 * `trigger="mount"` draws itself in immediately (hero centerpiece);
 * `trigger="inView"` waits until scrolled into view (footer reveal);
 * `trigger="none"` renders fully drawn with no animation (compact nav/footer mark,
 * so repeated mounts — e.g. the mobile menu opening — don't replay a 2.5s draw-in).
 * `light` swaps the book gradient to the teal family so it reads on dark backgrounds.
 */
export function BrainTreeMotif({
  className,
  light = false,
  trigger = "mount",
}: {
  className?: string;
  light?: boolean;
  trigger?: "mount" | "inView" | "none";
}) {
  const reduce = prefersReducedMotion() || trigger === "none";
  const uid = useId();
  const treeId = `mtree-${uid}`;
  const bookId = `mbook-${uid}`;
  const drawProps = trigger === "inView" ? { whileInView: "show", viewport: { once: true, margin: "-40px" } } : { animate: "show" };

  return (
    <svg viewBox="0 0 400 470" className={className} role="img" aria-label="Meptrasoft brain-tree emblem">
      <defs>
        <linearGradient id={treeId} x1="200" y1="440" x2="200" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={light ? "#5bc3b9" : "#0f2f50"} />
          <stop offset="0.4" stopColor="#008088" />
          <stop offset="0.8" stopColor="#00b4ae" />
          <stop offset="1" stopColor="#5bc3b9" />
        </linearGradient>
        <linearGradient id={bookId} x1="40" y1="400" x2="360" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={light ? "#5bc3b9" : "#0f2f50"} />
          <stop offset="0.5" stopColor={light ? "#bff2ea" : "#164761"} />
          <stop offset="1" stopColor={light ? "#5bc3b9" : "#0f2f50"} />
        </linearGradient>
      </defs>

      {strokes.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="none"
          stroke={i < 3 ? `url(#${bookId})` : `url(#${treeId})`}
          strokeWidth={i < 3 ? 3.4 : i > 8 ? 2 : 3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          variants={{ show: { pathLength: 1 } }}
          {...drawProps}
          transition={{ duration: 1.6, ease: "easeInOut", delay: reduce ? 0 : 0.1 + i * 0.11 }}
        />
      ))}

      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.cx}
          cy={n.cy}
          r={n.r}
          fill={n.amber ? "#e08a2b" : "#00b4ae"}
          initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          variants={{ show: { scale: 1, opacity: 1 } }}
          {...drawProps}
          style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}
          transition={{ duration: 0.5, ease: [0.3, 1.4, 0.5, 1], delay: reduce ? 0 : 1 + i * 0.08 }}
        />
      ))}
    </svg>
  );
}
