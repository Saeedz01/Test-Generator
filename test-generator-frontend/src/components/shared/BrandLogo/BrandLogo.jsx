import { cn } from "@/utils";
import { BRAND_NAME } from "@/constants";

/**
 * Testora tessera mark — three tiles assembled as a T.
 * badge: olive rounded square, white tiles (header / favicon).
 * plain: tiles only, inherits currentColor (mono / print).
 */
export function BrandMark({ className, variant = "badge", title }) {
  const isBadge = variant === "badge";
  const tile = isBadge ? "#ffffff" : "currentColor";

  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {isBadge ? (
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="8"
          fill="var(--color-primary-600)"
        />
      ) : null}
      <rect x="6" y="7.5" width="9" height="6" rx="1.75" fill={tile} />
      <rect x="17" y="7.5" width="9" height="6" rx="1.75" fill={tile} />
      <rect x="12.5" y="15.5" width="7" height="10" rx="1.75" fill={tile} />
    </svg>
  );
}

/**
 * Header / footer lockup: mark + Testora wordmark.
 */
export function BrandLogo({ className, showWordmark = true, markClassName }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BrandMark
        title={showWordmark ? undefined : BRAND_NAME}
        className={markClassName}
      />
      {showWordmark ? (
        <span className="text-h5 font-semibold tracking-[-0.03em] text-neutral-900">
          {BRAND_NAME}
        </span>
      ) : null}
    </span>
  );
}
