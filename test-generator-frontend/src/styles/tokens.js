/**
 * Design-system token map (JSDoc) — mirrors CSS variables in design-tokens.css.
 * Use for docs, Storybook, or future theme tooling. Not runtime business logic.
 *
 * @typedef {'primary'|'secondary'|'outline'|'ghost'|'destructive'} ButtonVariant
 * @typedef {'default'|'hover'|'selected'} CardState
 */

/**
 * Primary olive scale (brand).
 * Fresh Verdant Olive — premium, slightly vibrant, not muddy khaki.
 */
export const primary = {
  50: "#f3f7eb",
  100: "#e4eed4",
  200: "#c9ddaa",
  300: "#a7c675",
  400: "#88b04e",
  500: "#6f9a35",
  600: "#587b2a",
  700: "#446022",
  800: "#374c1e",
  900: "#2e401b",
};

/** Warm-stone neutrals complementary to olive. */
export const neutral = {
  0: "#ffffff",
  50: "#f7f7f5",
  100: "#f1f1ee",
  200: "#e3e3de",
  300: "#cfcfc8",
  400: "#a8a89f",
  500: "#78786f",
  600: "#5c5c55",
  700: "#44443e",
  800: "#2f2f2b",
  900: "#1a1a18",
  950: "#111110",
};

/** Semantic colors — restrained, adult, WCAG-minded. */
export const semantic = {
  success: { 50: "#ecf7f2", 100: "#d2ebe0", 500: "#2f9a6a", 600: "#247a53", 700: "#1c5f41" },
  warning: { 50: "#fbf5e8", 100: "#f5e6c4", 500: "#c48a1a", 600: "#9a6c14", 700: "#785410" },
  error: { 50: "#fbf0f0", 100: "#f5d6d6", 500: "#d14545", 600: "#b13434", 700: "#8f2a2a" },
  info: { 50: "#eef5fb", 100: "#d6e7f5", 500: "#3b7cb8", 600: "#2f6699", 700: "#25507a" },
};

/**
 * Typography roles — Plus Jakarta Sans.
 * Weights / tracking / leading defined for Display → Caption.
 */
export const typography = {
  fontFamily: {
    sans: 'var(--font-plus-jakarta), "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    display: 'var(--font-plus-jakarta), "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    mono: 'var(--font-geist-mono), ui-monospace, monospace',
  },
  roles: {
    display: { size: "48px", weight: 700, lineHeight: 1.15, letterSpacing: "-0.03em" },
    h1: { size: "36px", weight: 700, lineHeight: 1.2, letterSpacing: "-0.025em" },
    h2: { size: "30px", weight: 600, lineHeight: 1.25, letterSpacing: "-0.02em" },
    h3: { size: "24px", weight: 600, lineHeight: 1.3, letterSpacing: "-0.015em" },
    h4: { size: "20px", weight: 600, lineHeight: 1.35, letterSpacing: "-0.01em" },
    h5: { size: "18px", weight: 600, lineHeight: 1.4, letterSpacing: "-0.01em" },
    h6: { size: "16px", weight: 600, lineHeight: 1.4, letterSpacing: "0" },
    body: { size: "16px", weight: 400, lineHeight: 1.625, letterSpacing: "0" },
    small: { size: "14px", weight: 400, lineHeight: 1.5, letterSpacing: "0" },
    caption: { size: "12px", weight: 500, lineHeight: 1.4, letterSpacing: "0.02em" },
  },
};

/** 4px-base spacing scale (rem). */
export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
};

/** Subtle radii — cards 12px, buttons 10px, inputs 8px. */
export const radius = {
  sm: "6px",
  md: "8px",
  lg: "10px",
  xl: "12px",
  button: "10px",
  input: "8px",
  card: "12px",
};

/** Prefer borders; shadows only for transient elevation. */
export const shadows = {
  none: "none",
  xs: "0 1px 2px rgb(26 26 24 / 0.04)",
  sm: "0 1px 2px rgb(26 26 24 / 0.05), 0 1px 3px rgb(26 26 24 / 0.04)",
  md: "0 2px 6px rgb(26 26 24 / 0.06), 0 1px 2px rgb(26 26 24 / 0.04)",
};

/** Motion: opacity, translateY, micro-scale, color — 150–250ms. */
export const motion = {
  duration: { fast: "150ms", normal: "200ms", slow: "250ms" },
  easing: { standard: "cubic-bezier(0.2, 0, 0, 1)" },
  hoverTranslateY: "-1px",
  activeScale: 0.98,
};

/**
 * Button variant contract for future UI primitives.
 * States: default → hover → active → disabled + focus-visible ring.
 */
export const buttons = {
  primary: {
    bg: "primary.600",
    hover: "primary.700",
    active: "primary.800",
    text: "neutral.0",
  },
  secondary: {
    bg: "neutral.100",
    hover: "neutral.200",
    active: "neutral.300",
    text: "neutral.900",
    border: "neutral.200",
  },
  outline: {
    bg: "transparent",
    hover: "neutral.50",
    active: "neutral.100",
    text: "neutral.900",
    border: "neutral.300",
  },
  ghost: {
    bg: "transparent",
    hover: "neutral.100",
    active: "neutral.200",
    text: "neutral.600",
  },
  destructive: {
    bg: "error.600",
    hover: "error.700",
    active: "error.700",
    text: "neutral.0",
  },
  disabledOpacity: 0.45,
  focusRing: "brand olive / info blue 3px soft ring",
};

/** Card surface contract. */
export const cards = {
  background: "neutral.0",
  border: "neutral.200",
  hover: { border: "neutral.300", shadow: "xs", translateY: "-1px" },
  selected: { background: "primary.50", border: "primary.400" },
  radius: "12px",
};
