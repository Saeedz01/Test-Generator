import Link from "next/link";

import { EXTERNAL_LINKS, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        backgroundColor: "color-mix(in srgb, var(--tg-surface) 92%, transparent)",
        borderColor: "var(--tg-border)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-black tracking-tight"
            style={{
              borderColor: "var(--tg-border)",
              backgroundColor: "var(--tg-muted-bg)",
              color: "var(--tg-accent)",
            }}
          >
            PT
          </span>
          <div>
            <Link
              href="/generator"
              className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              {SITE_NAME}
            </Link>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
              {SITE_TAGLINE}
            </p>
          </div>
        </div>

        <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
          <Link
            href="/generator#pctb-grade-picker"
            className="text-zinc-700 transition hover:text-[color:var(--tg-accent)] dark:text-zinc-200"
          >
            Syllabus explorer
          </Link>
          <Link
            href="/generator"
            className="text-zinc-700 transition hover:text-[color:var(--tg-accent)] dark:text-zinc-200"
          >
            Worksheet builder
          </Link>
          <Link
            href={EXTERNAL_LINKS.pctb}
            className="text-zinc-700 transition hover:text-[color:var(--tg-accent)] dark:text-zinc-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            PCTB portal
          </Link>
          <Link
            href={EXTERNAL_LINKS.taleemCityCatalog}
            className="text-zinc-500 transition hover:text-[color:var(--tg-accent)] dark:text-zinc-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book index
          </Link>
        </nav>
      </div>
    </header>
  );
}
