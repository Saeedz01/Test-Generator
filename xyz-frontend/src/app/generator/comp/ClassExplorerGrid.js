"use client";

import Link from "next/link";
import { useMemo } from "react";

import { classPath } from "../utils/paths";

/**
 * @param {{ id: string, label: string, subtitle?: string, books: { chapters: { id: string }[] }[] }} grade
 */
function summarizeGrade(grade) {
  const books = grade.books.length;
  const chapters = grade.books.reduce((sum, book) => sum + book.chapters.length, 0);
  return { books, chapters };
}

/** @param {{ grades: { id: string, label: string, subtitle?: string, books: { chapters: unknown[] }[] }[] }} props */
export default function ClassExplorerGrid({ grades }) {
  const meta = useMemo(() => {
    return grades.map((grade) => ({
      id: grade.id,
      label: grade.label,
      subtitle: grade.subtitle,
      ...summarizeGrade(grade),
    }));
  }, [grades]);

  return (
    <section
      id="pctb-grade-picker"
      className="scroll-mt-24 px-6 py-14"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
              Step 1 · Pick a grade band
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Punjab textbook lanes (static preview data)
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Cards lift on hover, focus rings appear for keyboard users, and each tile shows how many
              official-style books and chapters ship in this build. Swap the JSON sources when your API
              is ready.
            </p>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Tip · press <kbd className="rounded border border-zinc-300 px-1 text-[0.65rem] dark:border-zinc-600">Tab</kbd>{" "}
            to explore
          </p>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {meta.map((grade, index) => (
            <li
              key={grade.id}
              className="tg-rise"
              style={{ animationDelay: `${index * 55}ms` }}
            >
              <Link
                href={classPath(grade.id)}
                className="group relative flex flex-col rounded-2xl border bg-[var(--tg-surface)] p-6 shadow-sm outline-none transition-[transform,box-shadow,border-color] duration-150 focus-visible:ring-2 focus-visible:ring-[color:var(--tg-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl"
                style={{ borderColor: "var(--tg-border)" }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.36em] text-zinc-500 dark:text-zinc-400">
                  Class / stream
                </span>
                <span className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 transition-colors duration-150 group-hover:text-[color:var(--tg-accent)] dark:text-white">
                  {grade.label}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 transition group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-200">
                  {grade.subtitle ?? "Aligned with Punjab board naming"}
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-zinc-600 dark:text-zinc-300">
                  <span className="rounded-full border border-zinc-200 px-3 py-1 dark:border-zinc-700">
                    {grade.books} books
                  </span>
                  <span className="rounded-full border border-zinc-200 px-3 py-1 dark:border-zinc-700">
                    {grade.chapters} chapters
                  </span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--tg-accent)]">
                  Open books
                  <span
                    aria-hidden
                    className="translate-x-0 transition-transform duration-150 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
