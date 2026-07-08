import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/data/content";

/** Mobile-only persistent conversion bar — the #1 conversion lever. */
export function StickyCTABar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-900/85 backdrop-blur-md md:hidden">
      <div className="container-page flex items-center gap-2 py-2.5">
        <Button variant="amber" size="md" to="/contact" className="flex-1">
          Enroll / Enquire
        </Button>
        <a
          href={site.social.whatsapp}
          aria-label="Chat on WhatsApp"
          className="inline-flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border border-white/15 bg-transparent text-hero-soft transition-colors hover:border-aqua-400 hover:text-aqua-300"
        >
          <Icon name="whatsapp" size={20} />
        </a>
      </div>
    </div>
  );
}
