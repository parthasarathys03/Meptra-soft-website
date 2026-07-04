import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";

// Route-level code splitting (Home eager for fast first paint)
const Solutions = lazy(() => import("@/pages/Solutions"));
const Learn = lazy(() => import("@/pages/Learn"));
const Careers = lazy(() => import("@/pages/Careers"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="/solutions/*"
          element={
            <Suspense fallback={null}>
              <Solutions />
            </Suspense>
          }
        />
        <Route
          path="/learn/*"
          element={
            <Suspense fallback={null}>
              <Learn />
            </Suspense>
          }
        />
        <Route
          path="/careers/*"
          element={
            <Suspense fallback={null}>
              <Careers />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={null}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={null}>
              <Contact />
            </Suspense>
          }
        />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
