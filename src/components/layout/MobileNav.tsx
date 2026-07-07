import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { nav, site } from "@/data/content";
import { cn } from "@/lib/utils";

const accentText: Record<string, string> = {
  teal: "text-teal-300",
  amber: "text-amber-400",
  navy: "text-aqua-300",
  aqua: "text-aqua-300",
};

const accentDot: Record<string, string> = {
  teal: "bg-teal-400",
  amber: "bg-amber-400",
  navy: "bg-aqua-400",
  aqua: "bg-aqua-400",
};

const accentRing: Record<string, string> = {
  teal: "ring-teal-400/25",
  amber: "ring-amber-400/25",
  navy: "ring-aqua-400/25",
  aqua: "ring-aqua-400/25",
};

/** Full-screen mobile menu. Learn is listed first (student-forward). */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  // student-forward ordering on mobile
  const ordered = [...nav].sort((a, b) => {
    const rank = (l: string) => (l === "Learn" ? 0 : l === "Solutions" ? 1 : 2);
    return rank(a.label) - rank(b.label);
  });

  // primary section open by default so the most-used group needs zero taps
  const [openGroup, setOpenGroup] = useState<string | null>(ordered[0]?.label ?? null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) setOpenGroup(ordered[0]?.label ?? null);
    return () => {
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mesh-hero fixed inset-0 z-[60] flex flex-col md:hidden"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.25, ease: [0.22, 0.9, 0.3, 1] }}
        >
          <div className="pointer-events-none absolute -inset-1/4 aurora opacity-40" aria-hidden />

          <div className="container-page relative z-10 flex h-16 shrink-0 items-center">
            <Link to="/" aria-label="Meptrasoft AI Technologies — home" onClick={onClose}>
              <img
                src="/assets/logo.svg"
                alt="Meptrasoft AI Technologies"
                className="h-9 w-auto [filter:brightness(0)_invert(1)]"
              />
            </Link>
            <button
              className="neu ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full text-hero-ink"
              onClick={onClose}
              aria-label="Close menu"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <nav className="container-page relative z-10 flex-1 overflow-y-auto pb-4">
            <ul className="divide-y divide-white/10 border-b border-white/10">
              {ordered.map((group, i) => {
                const isOpen = openGroup === group.label;
                return (
                  <motion.li
                    key={group.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.3, ease: [0.22, 0.9, 0.3, 1] }}
                  >
                    {group.children ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setOpenGroup(isOpen ? null : group.label)}
                          className="flex w-full items-center gap-3 py-4 text-left"
                          aria-expanded={isOpen}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full ring-[3px] ring-offset-0",
                              accentDot[group.accent],
                              accentRing[group.accent]
                            )}
                            aria-hidden
                          />
                          <span className={cn("flex-1 text-[17px] font-bold", isOpen ? "text-white" : "text-hero-ink")}>
                            {group.label}
                          </span>
                          <Icon
                            name="chevron-down"
                            size={14}
                            className={cn(
                              "shrink-0 text-hero-soft transition-transform duration-200",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: [0.22, 0.9, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col gap-1 pb-3">
                                {group.children.map((c) => (
                                  <Link
                                    key={c.href}
                                    to={c.href}
                                    onClick={onClose}
                                    className="active:bg-white/5 flex flex-col gap-0.5 rounded-[var(--radius-md)] px-3 py-3 transition-colors"
                                  >
                                    <span className="text-[15px] font-semibold text-hero-ink">{c.label}</span>
                                    {c.desc && <span className="text-[12.5px] text-hero-faint">{c.desc}</span>}
                                  </Link>
                                ))}
                                <Link
                                  to={group.href}
                                  onClick={onClose}
                                  className={cn("mt-1 px-3 text-[13px] font-semibold", accentText[group.accent])}
                                >
                                  View all {group.label} →
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={group.href}
                        onClick={onClose}
                        className="active:bg-white/5 flex items-center gap-3 py-4 transition-colors"
                      >
                        <span className={cn("h-2 w-2 shrink-0 rounded-full", accentDot[group.accent])} aria-hidden />
                        <span className="text-[17px] font-bold text-hero-ink">{group.label}</span>
                      </Link>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <div className="container-page relative z-10 shrink-0 border-t border-white/10 bg-hero-ink/0 py-3 backdrop-blur-sm">
            <div className="flex gap-2">
              <Link
                to="/contact"
                onClick={onClose}
                className="flex-1 rounded-[var(--radius-pill)] bg-amber-500 px-6 py-3.5 text-center text-[16px] font-bold text-[#20160a] active:scale-[0.98] transition-transform"
              >
                Contact
              </Link>
              <a
                href={site.social.whatsapp}
                aria-label="Chat on WhatsApp"
                className="neu inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[var(--radius-pill)] text-hero-ink"
              >
                <Icon name="whatsapp" size={20} />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
