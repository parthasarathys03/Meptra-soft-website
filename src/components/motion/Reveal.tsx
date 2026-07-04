import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 34, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** stagger children that are also motion items */
  as?: "div" | "section" | "li" | "span";
}

/** Scroll-in fade + slide. Respects reduced-motion via CSS override + Framer. */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 0.9, 0.3, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Container that staggers Reveal-like children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: stagger }}
    >
      {children}
    </motion.div>
  );
}

export const revealItem: Variants = variants;
