import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn, prefersReducedMotion } from "@/lib/utils";

/**
 * Subtle 3D tilt toward the cursor (max ~6°) with an optional spotlight glow.
 * Desktop/fine-pointer only; flat on touch + reduced-motion.
 */
export function TiltCard({
  children,
  className,
  spotlight = true,
}: {
  children: ReactNode;
  className?: string;
  spotlight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  // Hooks must run unconditionally — build the spotlight gradient here, not
  // inline in conditionally-rendered JSX (rules-of-hooks).
  const spotlight_bg = useTransform(
    [gx, gy],
    ([x, y]) =>
      `radial-gradient(300px circle at ${x} ${y}, rgba(0,180,174,0.14), transparent 60%)`
  );

  const enabled =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer:fine)").matches &&
    !prefersReducedMotion();

  function onMove(e: React.PointerEvent) {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={enabled ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
      className={cn("relative", className)}
    >
      {spotlight && enabled && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{ background: spotlight_bg }}
        />
      )}
      {children}
    </motion.div>
  );
}
