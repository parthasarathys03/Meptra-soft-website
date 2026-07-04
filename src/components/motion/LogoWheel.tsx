import { useEffect, useRef, useState } from "react";
import type { Tech } from "@/data/content";
import { prefersReducedMotion } from "@/lib/utils";

/** A 3D cylinder of logo cards. Auto-rotates, drag to spin (with momentum),
 *  and scrolling the page briefly speeds it up — inspired by Framer's
 *  ImageWheel. Rotation lives in a ref + rAF; React only renders the cards. */
export function LogoWheel({ items }: { items: Tech[] }) {
  const ringRef = useRef<HTMLDivElement>(null);
  const n = items.length;
  const step = 360 / n;
  // radius so cards sit edge-to-edge around the cylinder (extra padding widens it)
  const CARD = 150;
  const radius = Math.round(CARD / 2 / Math.tan(Math.PI / n)) + 160;

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const reduce = prefersReducedMotion();

    let angle = 0;
    let vel = reduce ? 0 : 0.08; // deg per frame idle spin
    let dragging = false;
    let lastX = 0;

    const IDLE = reduce ? 0 : 0.08;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      ring.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      vel = dx * 0.35;
      angle += vel;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try {
        ring.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
    };

    // scroll nudges the ring gently — kept subtle so speed stays steady
    let boost = 0;
    const onWheel = (e: WheelEvent) => {
      boost += Math.sign(e.deltaY) * 0.3;
      boost = Math.max(-1, Math.min(1, boost));
    };

    ring.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("wheel", onWheel, { passive: true });

    let raf: number;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!dragging) {
        vel += (IDLE - vel) * 0.04; // ease back to idle spin
        angle += vel + boost;
        boost *= 0.9; // decay the scroll boost
      }
      // tilt the whole cylinder back so it reads as an angled 3D ring
      ring.style.transform = `rotateX(16deg) translateZ(-${radius}px) rotateY(${angle}deg)`;
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ring.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("wheel", onWheel);
    };
  }, [n, radius]);

  const [broken, setBroken] = useState<Record<string, boolean>>({});

  return (
    <div
      className="relative mx-auto h-[320px] w-full max-w-[1280px] cursor-grab select-none [perspective:1200px] [perspective-origin:50%_38%] active:cursor-grabbing"
      role="list"
      aria-label="Technology stack"
    >
      <div
        ref={ringRef}
        style={{ width: CARD, height: CARD }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
      >
        {items.map((t, i) => (
          <div
            key={t.name}
            role="listitem"
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[18px] border border-black/5 bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.28)] [backface-visibility:hidden]"
            style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}
          >
            {broken[t.name] ? (
              <span className="text-center text-[13px] font-bold text-navy-800">{t.name}</span>
            ) : (
              <>
                <img
                  src={t.logo}
                  alt={t.name}
                  loading="lazy"
                  draggable={false}
                  className="h-11 w-11 object-contain"
                  onError={() => setBroken((b) => ({ ...b, [t.name]: true }))}
                />
                <span className="text-[11px] font-semibold text-slate-600">{t.name}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
