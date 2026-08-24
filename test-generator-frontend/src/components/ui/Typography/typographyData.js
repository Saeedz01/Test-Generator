/**
 * Central typography variant map.
 * Visual styles live here — components must not invent ad-hoc text sizes.
 */

export const TYPOGRAPHY_VARIANTS = {
  display:
    "font-display text-display font-bold tracking-[-0.03em] leading-[1.15] text-neutral-900",
  h1: "font-display text-h1 font-bold tracking-[-0.025em] leading-[1.2] text-neutral-900",
  h2: "font-display text-h2 font-semibold tracking-[-0.02em] leading-[1.25] text-neutral-900",
  h3: "font-display text-h3 font-semibold tracking-[-0.015em] leading-[1.3] text-neutral-900",
  h4: "font-display text-h4 font-semibold tracking-[-0.01em] leading-[1.35] text-neutral-900",
  h5: "font-display text-h5 font-semibold tracking-[-0.01em] leading-[1.4] text-neutral-900",
  h6: "font-display text-h6 font-semibold leading-[1.4] text-neutral-900",
  body: "text-body font-normal leading-[1.625] text-neutral-700",
  bodyLarge: "text-body sm:text-h5 font-normal leading-[1.625] text-neutral-700",
  bodySmall: "text-small font-normal leading-[1.5] text-neutral-600",
  caption: "text-caption font-medium leading-[1.4] tracking-[0.02em] text-neutral-500",
  label: "text-caption font-medium text-neutral-600",
  navigation: "text-small font-medium text-neutral-600",
  buttonText: "text-small font-semibold",
};

/** Default HTML element for each variant (override with `as`). */
export const VARIANT_TAGS = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body: "p",
  bodyLarge: "p",
  bodySmall: "p",
  caption: "p",
  label: "span",
  navigation: "span",
  buttonText: "span",
};

export const ALIGN_CLASSES = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};
