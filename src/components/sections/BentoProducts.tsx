import { Reveal } from "@/components/motion/Reveal";
import { ProductCarousel } from "@/components/motion/ProductCarousel";
import { products } from "@/data/content";

export function BentoProducts() {
  return (
    <section id="products" className="section-dark section-pad scroll-mt-6">
      <div aria-hidden className="glow-teal pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full" />
      <div aria-hidden className="glow-amber pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full" />
      <div className="container-page relative z-10">
        <Reveal>
          <p className="eyebrow text-aqua-300">Product-driven</p>
          <h2 className="mt-3 max-w-[20ch] text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.1] tracking-[-0.02em] text-hero-ink">
            Products we build
          </h2>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-hero-soft">
            Live SaaS and AI tools running in production for real clients — the same products our
            interns ship features on.
          </p>
        </Reveal>
      </div>

      {/* coverflow focus carousel — active card centered, neighbors dimmed */}
      <Reveal className="mt-10">
        <ProductCarousel items={products} />
      </Reveal>
    </section>
  );
}
