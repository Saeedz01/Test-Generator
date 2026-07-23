/**
 * Merges Tailwind class names safely (clsx + tailwind-merge).
 * Utility only — no business logic.
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
