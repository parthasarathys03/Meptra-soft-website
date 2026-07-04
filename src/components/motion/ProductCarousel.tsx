import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Product } from "@/lib/types";

/** Coverflow-style focus carousel: the active card is centered, full-size and
 *  full-color; neighbors shrink hard, dim, and desaturate. Auto-advances on a
 *  timer (pauses on hover); click any card or swipe to change focus. */
export function ProductCarousel({ items }: { items: Product[] }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const startX = useRef<number | null>(null);

  const CARD = 300;
  const GAP = 34;

  const go = (d: number) => setActive((p) => (p + d + n) % n);

  // one persistent timer; hovering flips a ref instead of resetting the timer
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setActive((p) => (p + 1) % n);
    }, 3500);
    return () => clearInterval(id);
  }, [n]);

  const onDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };
  const onUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (dx > 45) go(-1);
    else if (dx < -45) go(1);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div
        className="relative h-[440px] cursor-grab touch-pan-y select-none overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)] active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerUp={onUp}
      >
        {items.map((p, i) => {
          // shortest circular offset from the active card → seamless wrap
          let offset = i - active;
          if (offset > n / 2) offset -= n;
          if (offset < -n / 2) offset += n;
          const isActive = offset === 0;
          const dist = Math.abs(offset);
          const hidden = dist >= 3; // wraps happen while invisible

          return (
            <motion.button
              key={p.id}
              onClick={() => setActive(i)}
              style={{ width: CARD, height: 380, marginLeft: -CARD / 2, marginTop: -190, zIndex: n - dist }}
              animate={{
                x: offset * (CARD + GAP),
                scale: isActive ? 1 : 0.6,
                opacity: hidden ? 0 : isActive ? 1 : 0.4,
                filter: isActive ? "grayscale(0)" : "grayscale(1)",
              }}
              transition={{ type: "spring", stiffness: 240, damping: 30 }}
              className={`absolute left-1/2 top-1/2 origin-center overflow-hidden rounded-[var(--radius-lg)] border text-left ${
                isActive
                  ? "border-white/15 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]"
                  : "border-white/10"
              }`}
              aria-label={p.name}
            >
              <SmartImage
                src={p.image}
                alt={`${p.name} product interface`}
                label="Product UI"
                overlay={false}
                className="h-full w-full"
              />
              {/* readable info panel on the active card */}
              <motion.div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050d18] via-[#050d18]/85 to-transparent p-5 pt-14"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] text-aqua-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p.tag && (
                    <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-aqua-300">
                      {p.tag}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-[19px] font-bold tracking-[-0.01em] text-white">{p.name}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">{p.what}</p>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
