"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/shared/ThemeProvider";
import { THEME_DARK } from "@/components/shared/ThemeProvider/themeBootScript";
import { cn } from "@/utils";

/**
 * Nav control for light/dark. Theme context hydrates as light, then matches
 * the stored preference (html class is already set by the boot script).
 */
export function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === THEME_DARK;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)]",
        "text-neutral-700 transition-colors duration-150",
        "hover:bg-neutral-100 hover:text-neutral-900",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0",
        className,
      )}
    >
      {isDark ? (
        <Sun className="size-5" aria-hidden="true" />
      ) : (
        <Moon className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}
