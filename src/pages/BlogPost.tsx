import { Link, useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { RouteSeoTags } from "@/components/seo/Seo";
import { getRoute } from "@/seo/routes";
import { getPost } from "@/data/blog";
import type { BlogBlock } from "@/data/blog";
import NotFound from "@/pages/NotFound";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

function Block({ block }: { block: BlogBlock }) {
  if ("h2" in block) return <h2 className="mt-10 text-[clamp(20px,2.6vw,28px)] font-bold text-hero-ink">{block.h2}</h2>;
  if ("h3" in block) return <h3 className="mt-6 text-[clamp(17px,2vw,22px)] font-semibold text-aqua-300">{block.h3}</h3>;
  if ("p" in block) return <p className="mt-4 text-[15px] leading-relaxed text-hero-soft md:text-base">{block.p}</p>;
  if ("code" in block)
    return (
      <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-[#071322] p-4 text-xs sm:text-sm font-mono text-cyan-200">
        <pre className="whitespace-pre">{block.code}</pre>
      </div>
    );
  if ("ul" in block)
    return (
      <ul className="mt-4 flex flex-col gap-2.5">
        {block.ul.map((li) => (
          <li key={li} className="flex items-start gap-2.5 text-[15px] text-hero-soft">
            <Icon name="check" size={18} className="mt-0.5 shrink-0 text-aqua-300" />
            <span>{li}</span>
          </li>
        ))}
      </ul>
    );
  if ("cta" in block)
    return (
      <Link
        to={block.cta.to}
        className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-[#20160a] transition-transform hover:-translate-y-0.5"
      >
        {block.cta.label}
        <Icon name="arrow-right" size={14} />
      </Link>
    );
  return null;
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;
  if (!post) return <NotFound />;

  return (
    <>
      <RouteSeoTags route={getRoute(`/blog/${post.slug}`)} />
      <PageHeader eyebrow={post.tags.join(" · ")} title={post.title} subtitle={post.description} accent="amber" />

      <article className="section-pad section-dark">
        <div className="container-page relative z-10 max-w-[70ch]">
          <p className="text-[13px] text-hero-faint">
            {fmtDate(post.date)} · {post.author}
          </p>
          {post.body.map((block, i) => (
            <Reveal key={i}>
              <Block block={block} />
            </Reveal>
          ))}

          <div className="mt-12 border-t border-white/10 pt-8">
            <h2 className="text-lg font-bold text-hero-ink">Related</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {post.related.map((r) => (
                <Link
                  key={r.to}
                  to={r.to}
                  className="inline-flex items-center gap-1.5 rounded-full border border-aqua-400/25 bg-aqua-400/10 px-4 py-2 text-sm font-medium text-aqua-300 transition-colors hover:border-aqua-400 hover:text-white"
                >
                  {r.label}
                  <Icon name="arrow-right" size={13} />
                </Link>
              ))}
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-hero-ink transition-colors hover:border-aqua-400"
              >
                All posts
              </Link>
            </div>
          </div>
        </div>
      </article>

      <FinalCTA />
    </>
  );
}
