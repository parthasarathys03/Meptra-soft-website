import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon, type IconName } from "@/components/ui/Icon";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { nav, site } from "@/data/content";

const socials: { name: IconName; href: string; label: string }[] = [
  { name: "instagram", href: site.social.instagram, label: "Instagram" },
  { name: "linkedin", href: site.social.linkedin, label: "LinkedIn" },
  { name: "whatsapp", href: site.social.whatsapp, label: "WhatsApp" },
];

const companyLinks = [
  { label: "Careers", href: "/careers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1.5 text-sm text-hero-soft transition-colors hover:text-white">
      <span>{children}</span>
      <Icon
        name="arrow-right"
        size={10}
        className="-translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
      />
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-hero text-hero-ink">
      <div className="h-[2px] w-full bg-[linear-gradient(90deg,transparent,var(--color-aqua-400),var(--color-amber-500),var(--color-aqua-400),transparent)]" />

      <div className="container-page relative grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <Reveal>
          <Link to="/" aria-label="Meptrasoft AI Technologies — home" className="inline-block">
            <img
              src="/assets/logo.svg"
              alt="Meptrasoft AI Technologies"
              className="h-14 w-auto [filter:brightness(0)_invert(1)] md:h-20"
            />
          </Link>
          <p className="mt-4 max-w-[32ch] text-sm text-hero-soft">
            We build AI products for businesses — and train the engineers who build them.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <MagneticButton key={s.name} strength={0.4}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-hero-soft transition-colors hover:border-aqua-400 hover:text-aqua-300"
                >
                  <Icon name={s.name} size={16} />
                </a>
              </MagneticButton>
            ))}
          </div>
        </Reveal>

        {nav.filter((g) => g.children).map((group, i) => (
          <Reveal key={group.label} delay={0.08 * (i + 1)}>
            <h3 className="eyebrow text-aqua-300">{group.label}</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {group.children!.map((c) => (
                <li key={c.href}>
                  <FooterLink to={c.href}>{c.label}</FooterLink>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal delay={0.08 * (nav.filter((g) => g.children).length + 1)}>
          <h3 className="eyebrow text-aqua-300">Company</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {companyLinks.map((c) => (
              <li key={c.href}>
                <FooterLink to={c.href}>{c.label}</FooterLink>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-hero-faint sm:flex-row">
          <span>© {new Date().getFullYear()} {site.full}. All rights reserved.</span>
          <span className="font-mono">Built for businesses, students &amp; engineers.</span>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-hero-soft transition-colors hover:border-aqua-400 hover:text-aqua-300 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2"
          >
            <Icon name="arrow-right" size={13} className="-rotate-90" />
          </button>
        </div>
      </div>
    </footer>
  );
}
