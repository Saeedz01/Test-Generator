import Link from "next/link";

import { chapterPath } from "../../../utils/paths";

/**
 * @param {{ schoolClassId: string, schoolClassLabel: string, book: { id: string, title: string, chapters: { id: string, title: string }[] } }} props
 */
export default function ChapterList({ schoolClassId, schoolClassLabel, book }) {
  const total = book.chapters.length.toString().padStart(2, "0");

  return (
    <section className="px-6 py-12" style={{ backgroundColor: "var(--background)" }}>
      <div className="mx-auto max-w-6xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
          Step 3 · Chapter checkpoints
        </p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-zinc-900 dark:text-white">{book.title}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{schoolClassLabel}</p>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Grid follows the Punjab textbook numbering you see printed on the margins. Selecting a chapter opens the mixed
              item bank sorted MCQ ▸ short ▸ long exactly like the exporter layout.
            </p>
          </div>
          <span className="rounded-full border border-dashed px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500 dark:border-zinc-600 dark:text-zinc-300">
            Total {total} chapters
          </span>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {book.chapters.map((ch, idx) => {
            const number = String(idx + 1).padStart(2, "0");

            return (
              <li
                key={ch.id}
                className="tg-rise"
                style={{ animationDelay: `${idx * 48}ms` }}
              >
                <Link
                  href={chapterPath(schoolClassId, book.id, ch.id)}
                  className="group flex h-full min-h-[7.75rem] items-start gap-4 rounded-2xl border bg-[var(--tg-surface)] p-5 text-left outline-none ring-offset-[var(--background)] transition-[transform,border-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-[color:var(--tg-accent)] focus-visible:ring-offset-2 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg"
                  style={{ borderColor: "var(--tg-border)" }}
                >
                  <span
                    aria-hidden
                    className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border font-mono text-lg font-semibold text-zinc-900 transition-colors group-hover:border-transparent group-hover:bg-[color:var(--tg-accent)] group-hover:text-white dark:border-zinc-700 dark:text-white"
                    style={{
                      borderColor: "var(--tg-border)",
                    }}
                  >
                    {number}
                  </span>

                  <div className="flex flex-1 flex-col gap-2">
                    <p className="text-xs uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">Chapter dossier</p>
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-900 transition group-hover:text-[color:var(--tg-accent)] dark:text-white">
                      {ch.title}
                    </h3>
                    <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--tg-accent)]">
                      Compose worksheet
                      <span className="translate-x-0 transition group-hover:translate-x-1" aria-hidden>
                        ↗
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
