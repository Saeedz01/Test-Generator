"use client";

import { Search } from "lucide-react";
import { cn } from "@/utils";

/**
 * Search input for filtering books.
 */
export function BooksSearch({ value, onChange, placeholder = "Search books…", className }) {
  return (
    <label className={cn("relative block w-full max-w-md", className)}>
      <span className="sr-only">Search books</span>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-11 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0",
          "pr-4 pl-10 text-small text-neutral-900 placeholder:text-neutral-400",
          "transition-[border-color,box-shadow] duration-150",
          "focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:outline-none",
        )}
      />
    </label>
  );
}
