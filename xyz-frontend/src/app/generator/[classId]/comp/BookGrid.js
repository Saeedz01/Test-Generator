import Link from "next/link";

import { bookPath } from "../../utils/paths";
import { categorySurface } from "../../utils/categorySurface";

/**
 * @param {{
 *   schoolClass: {
 *     id: string,
 *     label: string,
 *     subtitle?: string,
 *     books: {
 *       id: string,
 *       title: string,
 *       category?: string,
 *       textbookNote?: string,
 *       chapters: { id: string }[],
 *     }[],
 *   },
 * }} props
 */
export default function BookGrid({ schoolClass }) {
  return (
    <section className="px-6 py-12" style={{ backgroundColor: "var(--background)" }}>
      <div className="mx-auto max-w-6xl space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
            Step 2 · Punjab textbook shelf
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-white">
            {schoolClass.label}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            {schoolClass.subtitle ??
              "Each tile mirrors naming used on pctb.pk download pages. Stripes encode subject lanes so you scan faster."}
          </p>
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {schoolClass.books.map((book, idx) => {
            const accent = categorySurface(book.category);

            return (
              <li
                key={book.id}
                className="tg-rise"
                style={{ animationDelay: `${idx * 42}ms` }}
              >
                <Link
                  href={bookPath(schoolClass.id, book.id)}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[var(--tg-surface)] text-left outline-none shadow-sm ring-offset-[var(--background)] transition-[transform,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-[color:var(--tg-accent)] focus-visible:ring-offset-2 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl"
                  style={{ borderColor: "var(--tg-border)" }}
                >
                  <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: accent.stripe }} />

                  <div className="flex flex-1 flex-col px-6 pb-6 pt-7">
                    <div className="flex items-center gap-3">
                      <span
                        className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]"
                        style={{
                          backgroundColor: accent.tagBg,
                          color: accent.tagText,
                        }}
                      >
                        {accent.label}
                      </span>
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {book.chapters.length} chapters
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold tracking-tight text-zinc-900 transition group-hover:text-[color:var(--tg-accent)] dark:text-white">
                      {book.title}
                    </h3>
                    {book.textbookNote ? (
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{book.textbookNote}</p>
                    ) : null}

                    <div className="mt-6 mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--tg-accent)]">
                      Open chapter atlas
                      <span className="translate-x-0 transition group-hover:translate-x-1" aria-hidden>
                        →
                      </span>
                    </div>
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
