import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import { landings } from "@/data/landings";
import { locations } from "@/data/locations";

// Route-level code splitting (Home eager for fast first paint)
const Solutions = lazy(() => import("@/pages/Solutions"));
const Learn = lazy(() => import("@/pages/Learn"));
const PlacementTraining = lazy(() => import("@/pages/PlacementTraining"));
const Careers = lazy(() => import("@/pages/Careers"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Admin = lazy(() => import("@/pages/Admin"));
const LandingPage = lazy(() => import("@/pages/LandingPage"));
const InternshipsHub = lazy(() => import("@/pages/InternshipsHub"));
const LocationsIndex = lazy(() => import("@/pages/LocationsIndex"));
const LocationPage = lazy(() => import("@/pages/LocationPage"));
const BlogIndex = lazy(() => import("@/pages/BlogIndex"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const lazyEl = (el: React.ReactNode) => <Suspense fallback={null}>{el}</Suspense>;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/solutions/*" element={lazyEl(<Solutions />)} />
        <Route path="/learn/*" element={lazyEl(<Learn />)} />
        <Route path="/placement-training" element={lazyEl(<PlacementTraining />)} />
        <Route path="/careers/*" element={lazyEl(<Careers />)} />
        <Route path="/about" element={lazyEl(<About />)} />
        <Route path="/contact" element={lazyEl(<Contact />)} />

        {/* Internships hub (parent of /internships/*) */}
        <Route path="/internships" element={lazyEl(<InternshipsHub />)} />

        {/* Service / intent landing pages */}
        {landings.map((l) => (
          <Route key={l.path} path={l.path} element={lazyEl(<LandingPage slug={l.slug} />)} />
        ))}

        {/* Local SEO */}
        <Route path="/locations" element={lazyEl(<LocationsIndex />)} />
        {locations.map((c) => (
          <Route key={c.slug} path={`/locations/${c.slug}`} element={lazyEl(<LocationPage slug={c.slug} />)} />
        ))}

        {/* Blog */}
        <Route path="/blog" element={lazyEl(<BlogIndex />)} />
        <Route path="/blog/:slug" element={lazyEl(<BlogPost />)} />

        <Route path="*" element={lazyEl(<NotFound />)} />
      </Route>
      <Route path="/admin" element={lazyEl(<Admin />)} />
    </Routes>
  );
}
