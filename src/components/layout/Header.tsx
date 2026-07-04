import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "@/components/layout/MobileNav";
import { nav } from "@/data/content";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active route → default highlight when nothing is hovered
  const activeLabel =
    nav.find((g) => pathname === g.href || pathname.startsWith(g.href + "/"))?.label ?? null;
  const highlight = hovered ?? activeLabel;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="px-5 pt-2 md:px-8 md:pt-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-[var(--radius-pill)] border px-5 py-0.5 transition-all duration-300 md:px-6 md:py-1",
            // glassmorphism capsule
            "border-white/60 bg-white/70 shadow-[0_8px_30px_rgba(11,31,56,0.10)] backdrop-blur-xl",
            scrolled && "border-white/70 bg-white/85 shadow-[0_12px_36px_rgba(11,31,56,0.16)]"
          )}
        >
          <Link to="/" aria-label="Meptrasoft AI Technologies — home" className="shrink-0 pl-3">
            <img src="/assets/logo.svg" alt="Meptrasoft AI Technologies" className="h-11 w-auto md:h-[54px]" />
          </Link>

          {/* desktop nav with sliding indicator */}
          <nav
            className="ml-auto hidden items-center md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {nav.map((group) => (
              <div
                key={group.label}
                className="group relative"
                onMouseEnter={() => setHovered(group.label)}
              >
                {highlight === group.label && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-[var(--radius-pill)] bg-navy-800/[0.07]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Link
                  to={group.href}
                  className="relative z-10 inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium text-navy-800"
                >
                  {group.label}
                  {group.children && (
                    <Icon
                      name="chevron-down"
                      size={12}
                      className="opacity-55 transition-transform group-hover:rotate-180"
                    />
                  )}
                </Link>

                {group.children && (
                  <div className="invisible absolute left-1/2 top-full w-[420px] -translate-x-1/2 translate-y-1 pt-5 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="grid grid-cols-2 gap-1 rounded-[20px] border border-white/10 bg-[#081426] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                      {group.children.map((c) => (
                        <Link
                          key={c.href}
                          to={c.href}
                          className="block rounded-[var(--radius-sm)] p-2.5 transition-colors hover:bg-white/15"
                        >
                          <span className="block text-sm font-semibold text-white">{c.label}</span>
                          {c.desc && <span className="mt-1 block text-[13px] leading-snug text-white/50">{c.desc}</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <Button variant="teal" size="sm" to="/contact" className="anim-border ml-2 hidden md:inline-flex">
            Contact
          </Button>

          <button
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full text-navy-800 hover:bg-navy-800/5 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" size={20} />
          </button>
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
