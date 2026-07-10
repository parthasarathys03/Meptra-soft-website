import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";
import "./index.css";

// Remove the build-time SSG <head> tags so react-helmet-async is the single
// owner client-side (prevents duplicate canonical/description/JSON-LD after
// hydration). Crawlers that don't run JS still read the static tags first.
document.querySelectorAll("[data-ssg-seo]").forEach((el) => el.remove());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <MotionConfig reducedMotion="user">
          <App />
          <Analytics />
        </MotionConfig>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
