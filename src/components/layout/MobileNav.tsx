import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { nav } from "@/data/content";

/** Full-screen mobile menu. Learn is listed first (student-forward). */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // student-forward ordering on mobile
  const ordered = [...nav].sort((a, b) => {
    const rank = (l: string) => (l === "Learn" ? 0 : l === "Solutions" ? 1 : 2);
    return rank(a.label) - rank(b.label);
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mesh-hero fixed inset-0 z-[60] overflow-hidden md:hidden"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.25, ease: [0.22, 0.9, 0.3, 1] }}
        >
          <div className="pointer-events-none absolute -inset-1/4 aurora opacity-40" aria-hidden />
          <div className="container-page relative z-10 flex h-16 items-center">
            <Logo light />
            <button
              className="neu ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full text-hero-ink"
              onClick={onClose}
              aria-label="Close menu"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <nav className="container-page relative z-10 mt-4 flex flex-col gap-3 overflow-y-auto pb-24">
            {ordered.map((group, i) => (
              <motion.div
                key={group.label}
                className="neu rounded-[var(--radius-lg)] p-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.35, ease: [0.22, 0.9, 0.3, 1] }}
              >
                <Link
                  to={group.href}
                  onClick={onClose}
                  className="block text-lg font-bold text-hero-ink"
                >
                  {group.label}
                </Link>
                {group.children && (
                  <div className="mt-3 flex flex-col gap-2">
                    {group.children.map((c) => (
                      <Link
                        key={c.href}
                        to={c.href}
                        onClick={onClose}
                        className="neu neu-pressed rounded-[var(--radius-md)] px-3 py-2.5 text-[14px] text-hero-soft transition-colors hover:text-hero-ink"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + ordered.length * 0.06, duration: 0.35 }}
            >
              <Link
                to="/contact"
                onClick={onClose}
                className="anim-border block rounded-[var(--radius-pill)] bg-amber-500 px-6 py-3.5 text-center text-lg font-bold text-[#20160a]"
              >
                Contact
              </Link>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
