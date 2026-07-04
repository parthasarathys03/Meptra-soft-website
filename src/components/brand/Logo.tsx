import { Link } from "react-router-dom";
import { BrainTreeMotif } from "@/components/brand/BrainTreeMotif";
import { cn } from "@/lib/utils";

/** Brand lockup: the brain-tree-book mark plus wordmark, adapting to light/dark contexts. */
export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("inline-flex items-center gap-2.5", className)} aria-label="Meptrasoft AI Technologies — home">
      <BrainTreeMotif light={light} trigger="none" className="aspect-[400/470] h-8 w-auto shrink-0" />
      <span className="leading-none">
        <span className={cn("block text-[15px] font-bold tracking-[-0.01em]", light ? "text-white" : "text-navy-800")}>
          Meptrasoft <span className={light ? "text-aqua-300" : "text-teal-600"}>AI</span>
        </span>
        <span className={cn("mt-0.5 block font-mono text-[9px] tracking-[0.14em]", light ? "text-hero-soft" : "text-slate-500")}>
          TECHNOLOGIES
        </span>
      </span>
    </Link>
  );
}
