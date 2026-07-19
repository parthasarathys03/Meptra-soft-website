import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { RouteSeoTags } from "@/components/seo/Seo";
import { getRoute } from "@/seo/routes";
import { posts } from "@/data/blog";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

export default function BlogIndex() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <>
      <RouteSeoTags route={getRoute("/blog")} />
      <PageHeader
        eyebrow="Blog"
        title="Guides for students & job seekers"
        subtitle="Practical, no-fluff guides on internships, AI and Python courses, final-year projects, and IT placement preparation."
        accent="amber"
        image="/assets/blogs images/hero-section-rightside-blogs.png"
        imageAlt="Meptrasoft AI Blog Guides"
      />
      <section className="section-pad section-dark">
        <div className="container-page relative z-10">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((p) => (
              <Reveal key={p.slug}>
                <Link
                  to={`/blog/${p.slug}`}
                  className="glass group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] transition-transform hover:-translate-y-0.5"
                >
                  <img src={p.image} alt="" loading="lazy" className="h-40 w-full object-cover" />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-full bg-aqua-400/10 px-2.5 py-0.5 text-[11px] font-medium text-aqua-300">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="mt-3 text-base font-bold leading-snug text-hero-ink">{p.title}</h2>
                    <p className="mt-2 text-[13px] leading-relaxed text-hero-soft">{p.description}</p>
                    <span className="mt-auto flex items-center justify-between pt-4 text-[12px] text-hero-faint">
                      <span>{fmtDate(p.date)}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-aqua-300">
                        Read <Icon name="arrow-right" size={12} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
