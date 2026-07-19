import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlacementProgram } from "@/components/sections/PlacementProgram";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Reveal } from "@/components/motion/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { RouteSeoTags } from "@/components/seo/Seo";
import { getRoute } from "@/seo/routes";
import {
  placementProgram as pp,
  placementFaqs,
  placementAudience,
  testimonials,
} from "@/data/content";

// Filter testimonials relevant to placement program.
const placementTestimonials = testimonials.filter(
  (t) =>
    t.role.toLowerCase().includes("placement") ||
    t.role.toLowerCase().includes("placement program")
);

// Animation variants for staggered lists.
const listWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 0.9, 0.3, 1] } },
};

/* ── Breadcrumbs ─────────────────────────────────────────────── */
function Breadcrumbs() {
  const items = [
    { name: "Home", to: "/" },
    { name: "Learn", to: "/learn" },
    { name: "Placement Training", to: "/placement-training" },
  ];
  return (
    <nav aria-label="Breadcrumb" className="container-page pt-24 md:pt-28">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-hero-soft">
        {items.map((it, i) => (
          <li key={it.to} className="inline-flex items-center gap-1.5">
            {i > 0 && <span aria-hidden className="opacity-40">/</span>}
            {i < items.length - 1 ? (
              <Link to={it.to} className="hover:text-aqua-300 transition-colors">
                {it.name}
              </Link>
            ) : (
              <span className="text-hero-ink" aria-current="page">
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ── Who Is This For? ────────────────────────────────────────── */
function AudienceSection() {
  return (
    <section className="section-pad section-dark" id="who-is-this-for">
      <div className="container-page relative z-10">
        <Reveal>
          <p className="eyebrow text-amber-300">Who Is This For?</p>
          <h2 className="mt-3 max-w-[50ch] text-[clamp(22px,3vw,32px)] font-bold tracking-[-0.02em] text-hero-ink">
            Built for students who want to get placed — not just trained
          </h2>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-hero-soft">
            Whether you're preparing for your first campus drive or recovering from a failed attempt, this program meets you where you are and gets you interview-ready.
          </p>
        </Reveal>

        <motion.div
          variants={listWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          {placementAudience.map((a) => (
            <motion.div
              key={a.title}
              variants={listItem}
              className="group rounded-[var(--radius-lg)] glass p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-amber-500/12 text-amber-300 ring-1 ring-amber-400/20 transition-transform duration-300 group-hover:scale-110">
                <Icon name={a.icon as IconName} size={18} />
              </span>
              <h3 className="mt-4 text-[16px] font-bold text-hero-ink">{a.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-hero-soft">{a.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Testimonials ────────────────────────────────────────────── */
function TestimonialsSection() {
  return (
    <section className="section-pad section-dark" id="placement-reviews">
      <div className="container-page relative z-10">
        <Reveal>
          <p className="eyebrow text-amber-300">What Our Graduates Say</p>
          <h2 className="mt-3 max-w-[50ch] text-[clamp(22px,3vw,32px)] font-bold tracking-[-0.02em] text-hero-ink">
            Real students. Real results.
          </h2>
        </Reveal>

        <motion.div
          variants={listWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {placementTestimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={listItem}
              className="rounded-[var(--radius-lg)] glass p-5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Icon key={i} name="star" size={13} className="text-amber-400" />
                ))}
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-hero-soft italic">
                "{t.quote}"
              </p>
              <div className="mt-4 border-t border-white/8 pt-3">
                <p className="text-[13.5px] font-semibold text-hero-ink">{t.name}</p>
                <p className="mt-0.5 text-[12px] text-amber-300/80">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── FAQ Accordion ───────────────────────────────────────────── */
function FaqItem({ faq, isOpen, onToggle }: { faq: { question: string; answer: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="glass rounded-[var(--radius-lg)] overflow-hidden transition-colors duration-300 hover:border-amber-400/25">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-[15px] font-semibold text-hero-ink">{faq.question}</span>
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-500/12 text-amber-300 transition-transform duration-300" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          <Icon name={isOpen ? "minus" : "plus"} size={12} />
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 0.9, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-5 text-[14px] leading-relaxed text-hero-soft">{faq.answer}</p>
      </motion.div>
    </div>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-pad section-dark" id="placement-faqs">
      <div className="container-page relative z-10">
        <Reveal>
          <p className="eyebrow text-amber-300">Frequently Asked Questions</p>
          <h2 className="mt-3 max-w-[50ch] text-[clamp(22px,3vw,32px)] font-bold tracking-[-0.02em] text-hero-ink">
            Everything you need to know about placement training
          </h2>
        </Reveal>

        <div className="mt-8 flex flex-col gap-3 max-w-[72ch]">
          {placementFaqs.map((faq, i) => (
            <Reveal key={faq.question} delay={i * 0.04}>
              <FaqItem
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Related Programs ────────────────────────────────────────── */
function RelatedPrograms() {
  const links = [
    { label: "AI Course", to: "/courses/ai" },
    { label: "Python Course", to: "/courses/python" },
    { label: "Online Internship", to: "/internships/online" },
    { label: "Free Internship", to: "/internships/free" },
    { label: "Final-Year Projects", to: "/final-year-projects" },
    { label: "All Courses & Internships", to: "/learn" },
  ];

  return (
    <section className="section-pad section-dark" id="related-programs">
      <div className="container-page relative z-10">
        <Reveal>
          <h2 className="text-[clamp(20px,2.4vw,26px)] font-bold text-hero-ink">
            Explore related programs
          </h2>
          <p className="mt-2 text-[14px] text-hero-soft">
            Complement your placement preparation with these programs.
          </p>
        </Reveal>
        <div className="mt-5 flex flex-wrap gap-3">
          {links.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-200 transition-colors hover:border-amber-400 hover:text-white"
            >
              {r.label}
              <Icon name="arrow-right" size={13} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Quick Stats Band ────────────────────────────────────────── */
function StatsBand() {
  const stats = [
    { value: "3 months", label: "Intensive Training" },
    { value: "4 Rounds", label: "Complete Coverage" },
    { value: "₹8,000", label: "All-Inclusive Fee" },
    { value: "Free Demo", label: "3-Day Trial" },
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-amber-500/[0.08] via-amber-500/[0.04] to-transparent">
      <div className="container-page py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <Reveal key={s.label}>
              <div className="text-center">
                <p className="text-[clamp(22px,3vw,30px)] font-bold text-amber-300">{s.value}</p>
                <p className="mt-1 text-[13px] text-hero-soft">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PLACEMENT TRAINING PAGE — dedicated, SEO-optimized standalone.
   ═══════════════════════════════════════════════════════════════ */
export default function PlacementTraining() {
  return (
    <>
      <RouteSeoTags route={getRoute("/placement-training")} />

      {/* ── Hero ── */}
      <PageHeader
        eyebrow="Placement Training"
        title={pp.title}
        subtitle={pp.tagline}
        accent="amber"
        breadcrumbs={<Breadcrumbs />}
        image="/assets/blogs images/3rd blog card .png"
        imageAlt="Placement Training"
      >
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1.5 text-[12px] font-semibold text-amber-300">
          <Icon name="star" size={13} />
          {pp.badge}
        </span>
        <div className="flex flex-wrap gap-3">
          <Button variant="amber" to="/contact">
            Book Your Free Demo
            <Icon name="arrow-right" size={14} />
          </Button>
          <Button variant="outline-light" to="/learn">
            Explore All Programs
          </Button>
        </div>
      </PageHeader>

      {/* ── Stats band ── */}
      <StatsBand />

      {/* ── Who is this for? ── */}
      <AudienceSection />

      {/* ── The full placement roadmap (reused component) ── */}
      <PlacementProgram />

      {/* ── Student testimonials ── */}
      <TestimonialsSection />

      {/* ── FAQ section (SEO: FAQPage schema) ── */}
      <FaqSection />

      {/* ── Related internal links ── */}
      <RelatedPrograms />

      {/* ── Final CTA with lead form ── */}
      <FinalCTA />
    </>
  );
}
