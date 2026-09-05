/**
 * Merges Tailwind class names safely (clsx + tailwind-merge).
 * Utility only — no business logic.
 *
 * Custom `--text-*` tokens (text-display, text-small, …) must be registered as
 * font sizes. Otherwise twMerge treats them as colors and drops real color
 * utilities like text-neutral-0 on primary buttons.
 */
import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const FONT_SIZE_TOKENS = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "body",
  "small",
  "caption",
];

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: FONT_SIZE_TOKENS,
    },
    classGroups: {
      "font-size": FONT_SIZE_TOKENS.map((token) => `text-${token}`),
    },
  },
});

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
