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
    <Link to={to} className="group inline-flex items-center gap-1.5 text-[13px] leading-snug text-hero-soft transition-colors hover:text-white sm:text-sm">
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
    <footer className="relative overflow-hidden bg-gradient-hero text-hero-ink pb-20 md:pb-0">
      <div className="h-[2px] w-full bg-[linear-gradient(90deg,transparent,var(--color-aqua-400),var(--color-amber-500),var(--color-aqua-400),transparent)]" />

      <div className="container-page relative grid grid-cols-2 gap-x-5 gap-y-9 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10 md:gap-y-10 md:py-16">
        <Reveal className="col-span-2 flex flex-col items-center text-center md:col-span-1 md:items-start md:text-left">
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
          <div className="mt-5 flex justify-center gap-3 md:justify-start">
            {socials.map((s) => (
              <MagneticButton key={s.name} strength={0.4}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
          <Reveal key={group.label} delay={0.08 * (i + 1)} className="min-w-0 text-left">
            <h3 className="eyebrow text-aqua-300 text-left">{group.label}</h3>
            <ul className="mt-3.5 flex flex-col items-start gap-3">
              {group.children!.map((c) => (
                <li key={c.href} className="min-w-0 max-w-full">
                  <FooterLink to={c.href}>{c.label}</FooterLink>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal
          delay={0.08 * (nav.filter((g) => g.children).length + 1)}
          className="col-span-2 text-center md:col-span-1 md:text-left"
        >
          <h3 className="eyebrow text-aqua-300">Company</h3>
          <ul className="mt-4 flex flex-col items-center gap-2.5 md:items-start">
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
