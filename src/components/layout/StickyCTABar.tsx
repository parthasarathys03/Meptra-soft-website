import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/data/content";

/** Mobile-only persistent conversion bar — the #1 conversion lever. */
export function StickyCTABar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-200 bg-surface/95 backdrop-blur-md md:hidden">
      <div className="container-page flex items-center gap-2 py-2.5">
        <Button variant="amber" size="md" to="/contact" className="flex-1">
          Enroll / Enquire
        </Button>
        <Button
          variant="teal"
          size="md"
          href={site.social.whatsapp}
          aria-label="Chat on WhatsApp"
          className="!px-4 !bg-[#25D366] !text-white shadow-[0_2px_10px_rgba(37,211,102,0.45)] hover:!bg-[#20bd5a]"
        >
          <Icon name="whatsapp" size={20} />
        </Button>
      </div>
    </div>
  );
}
