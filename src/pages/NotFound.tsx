import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";

const links = [
  { to: "/solutions", label: "AI & Software Solutions" },
  { to: "/learn", label: "Internships & Courses" },
  { to: "/internships", label: "Internships" },
  { to: "/final-year-projects", label: "Final-Year Projects" },
  { to: "/contact", label: "Contact us" },
];

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-hero text-hero-ink">
      <Seo
        title="Page not found (404) | Meptrasoft AI Technologies"
        description="The page you were looking for doesn't exist. Explore Meptrasoft AI Technologies' internships, courses, projects, and AI solutions."
        path="/404"
        noindex
      />
      <div aria-hidden className="circuit-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="container-page relative z-10 py-24 text-center">
        <p className="eyebrow text-aqua-300">Error 404</p>
        <h1 className="mt-4 text-[clamp(30px,6vw,60px)] font-bold tracking-[-0.02em]">
          This page took a wrong turn.
        </h1>
        <p className="mx-auto mt-4 max-w-[52ch] text-hero-soft">
          The page you were looking for doesn't exist or has moved. Try one of these instead:
        </p>
        <nav className="mt-8 flex flex-wrap justify-center gap-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full border border-aqua-400/30 bg-aqua-400/10 px-5 py-2.5 text-sm font-semibold text-aqua-300 transition-colors hover:border-aqua-400 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-[#20160a] transition-transform hover:-translate-y-0.5"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
