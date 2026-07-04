import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Image with a graceful fallback. If the src is missing or fails to load,
 * renders an on-brand gradient placeholder with a label — so temporary
 * remote images can never leave a broken box.
 */
export function SmartImage({
  src,
  alt,
  className,
  label = "Image",
  overlay = true,
}: {
  src?: string;
  alt: string;
  className?: string;
  label?: string;
  overlay?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-teal-600/10 to-navy-800/10",
          className
        )}
        aria-hidden
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.09em] text-slate-500">{label}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
      {overlay && (
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-navy-800/35 to-transparent mix-blend-multiply"
        />
      )}
    </div>
  );
}
