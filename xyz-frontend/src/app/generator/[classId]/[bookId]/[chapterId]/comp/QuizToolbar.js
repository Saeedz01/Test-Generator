"use client";

/**
 * Selection + export actions pinned under breadcrumbs.
 *
 * @param {{
 *   selectedCount: number,
 *   totalCount: number,
 *   onSelectAll: () => void,
 *   onClear: () => void,
 *   onDownloadPdf: () => void,
 *   downloading: boolean,
 * }} props
 */
export default function QuizToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClear,
  onDownloadPdf,
  downloading,
}) {
  return (
    <div
      className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b px-6 py-3"
      style={{
        backgroundColor: "var(--tg-surface)",
        borderColor: "var(--tg-border)",
      }}
    >
      <p className="text-sm" style={{ color: "var(--tg-muted-text)" }}>
        Selected <strong className="text-zinc-900 dark:text-zinc-50">{selectedCount}</strong>{" "}
        of {totalCount} questions · order: MCQ → Short → Long
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSelectAll}
          className="rounded-md border px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
          style={{ borderColor: "var(--tg-border)" }}
        >
          Select all
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
          style={{ borderColor: "var(--tg-border)" }}
        >
          Clear
        </button>
        <button
          type="button"
          disabled={selectedCount === 0 || downloading}
          onClick={onDownloadPdf}
          className="rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-95 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: "var(--tg-accent)",
          }}
        >
          {downloading ? "Preparing PDF…" : "Download PDF"}
        </button>
      </div>
    </div>
  );
}
