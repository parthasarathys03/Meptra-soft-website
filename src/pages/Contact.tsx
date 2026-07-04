import { Icon } from "@/components/ui/Icon";
import { LeadForm } from "@/components/ui/LeadForm";
import { site } from "@/data/content";

const directLines = [
  {
    href: site.social.whatsapp,
    icon: "whatsapp" as const,
    label: "Chat on WhatsApp",
    value: "+91 93459 84804",
  },
  {
    href: "tel:+919345984804",
    icon: "phone" as const,
    label: "Call us",
    value: "+91 93459 84804",
  },
  {
    href: `mailto:${site.email}`,
    icon: "mail" as const,
    label: "Email us",
    value: site.email,
  },
];

export default function Contact() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-hero text-hero-ink">
      <div aria-hidden className="circuit-grid pointer-events-none absolute inset-0 opacity-30" />
      <div aria-hidden className="glow-teal pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full" />
      <div aria-hidden className="glow-amber pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full" />

      <div className="container-page relative z-10 pb-10 pt-24 md:pb-14 md:pt-28">
        <p className="eyebrow inline-flex items-center gap-2.5 text-aqua-300">
          <span className="h-px w-6 bg-current opacity-70" />
          Contact
        </p>
        <h1 className="mt-3 max-w-[16ch] text-[clamp(26px,4vw,40px)] font-bold leading-[1.06] tracking-[-0.02em] text-balance">
          Let's talk.
        </h1>
        <p className="mt-3 max-w-[56ch] text-[clamp(14px,1.4vw,16px)] leading-relaxed text-hero-soft">
          Students, businesses, and job seekers — tell us what you need and we'll reach out fast.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-start">
          <div className="glass-panel flex flex-col gap-3 rounded-[var(--radius-lg)] p-6">
            <h2 className="text-lg font-bold tracking-[-0.01em]">Reach us directly</h2>
            <p className="text-sm text-hero-soft">
              Fastest for students is WhatsApp — we usually reply the same day.
            </p>
            <div className="mt-2 flex flex-col gap-3">
              {directLines.map((line) => (
                <a
                  key={line.label}
                  href={line.href}
                  className="neu-field group flex items-center gap-3 rounded-[var(--radius-md)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,180,174,0.18)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-aqua-400/15 text-aqua-300 transition-colors group-hover:bg-aqua-400/25">
                    <Icon name={line.icon} size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-hero-ink">{line.label}</span>
                    <span className="block truncate text-[13px] text-hero-soft">{line.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[var(--radius-lg)] p-6 md:p-7">
            <LeadForm variant="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
