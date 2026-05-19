"use client";

import { useCallback } from "react";

/** @typedef {{ classes: number, books: number, chapters: number, subjectBuckets: number, gradeSpan?: string, boardLabel?: string }} CatalogStatsPayload */

const DEFAULT_STATS = {
  classes: 0,
  books: 0,
  chapters: 0,
  subjectBuckets: 0,
  gradeSpan: "Grade VIII ⟶ 2nd year",
  boardLabel: "Punjab Curriculum & Textbook Board · practice UI",
};

/** @param {{ stats?: Partial<CatalogStatsPayload> }} props */
export default function GeneratorHero({ stats }) {
  const safe = /** @type {CatalogStatsPayload} */ ({ ...DEFAULT_STATS, ...stats });

  const ribbons = [
    { label: "Grades surfaced", value: safe.classes?.toString() ?? "–" },
    { label: "Official-style books", value: safe.books?.toString() ?? "–" },
    { label: "Named chapters", value: safe.chapters?.toString() ?? "–" },
    { label: "Subject lanes", value: safe.subjectBuckets?.toString() ?? "–" },
  ];

  const snapToBooks = useCallback(() => {
    document.getElementById("pctb-grade-picker")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      aria-labelledby="pctb-generator-title"
      className="relative flex h-[50vh] min-h-[292px] flex-col justify-center overflow-hidden border-b px-6"
      style={{
        backgroundColor: "var(--tg-hero-bg)",
        borderColor: "var(--tg-border)",
        color: "var(--tg-hero-fg)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-12 right-[8%] hidden w-48 skew-y-[-6deg] border border-dashed border-white/35 opacity-85 md:block lg:w-64 xl:right-[12%]"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl tg-rise">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/85">
            {safe.boardLabel}
          </p>
          <h1
            id="pctb-generator-title"
            className="mt-3 text-pretty text-3xl font-semibold tracking-tight sm:text-[2.4rem] lg:text-[2.85rem]"
          >
            Compose Punjab-board practice bundles in clicks
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90">
            Drill from{" "}
            <span className="font-semibold text-white">{safe.classes}</span>{" "}
            grade bands into books and chapters mirrored from common{" "}
            <abbr title="Punjab Curriculum and Textbook Board" className="no-underline">
              PCTB
            </abbr>{" "}
            streams — then prioritise MCQs, short cues, and long-form prompts before exporting.
          </p>
          <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/65">
            {safe.gradeSpan}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white outline-offset-4 transition-[transform] active:translate-y-[1px] motion-safe:hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--tg-accent)" }}
              onClick={snapToBooks}
            >
              Jump to class grid
              <span aria-hidden>↘</span>
            </button>
            <p className="text-xs uppercase tracking-[0.18em] text-white/65">
              Works offline-ready once loaded · PDF export client-side
            </p>
          </div>
        </div>

        <div className="w-full max-w-md rounded-xl border bg-black/35 p-4 text-sm text-white tg-rise motion-safe:tg-rise-delay lg:max-w-sm">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/65">
            Live syllabus footprint
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            {ribbons.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/30 bg-white/10 px-4 py-3 transition-[transform,border-color] motion-safe:hover:-translate-y-[2px]"
              >
                <dt className="text-[0.65rem] uppercase tracking-[0.16em] text-white/65">{item.label}</dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-md border border-dashed border-white/40 px-4 py-2 text-[0.74rem] text-white/85">
            Cross-check wording with{" "}
            <a href="https://www.pctb.pk/" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline">
              pctb.pk
            </a>{" "}
            before high-stakes exam use — pacing here is practice-first.
          </p>
        </div>
      </div>
    </section>
  );
}
