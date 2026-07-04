import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCTABar } from "@/components/layout/StickyCTABar";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // section may mount a frame after the route swaps — retry briefly
      const id = hash.slice(1);
      let tries = 0;
      const find = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (tries++ < 10) {
          requestAnimationFrame(find);
        }
      };
      requestAnimationFrame(find);
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  return (
    <div className="noise">
      <ScrollManager />
      <Header />
      <main className="min-h-screen pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <StickyCTABar />
    </div>
  );
}
