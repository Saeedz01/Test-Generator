"use client";

import { useCallback, useMemo, useState } from "react";

import QuestionBlock from "./QuestionBlock";
import QuizToolbar from "./QuizToolbar";
import { sortQuestionsForDisplay } from "../../../../utils/queries";
import { downloadChapterPdf } from "../utils/chapterPdfExport";

const SECTION_LABELS = {
  mcq: "Multiple choice",
  short: "Short answer",
  long: "Long answer",
};

/**
 * @param {{
 *   context: { classLabel: string, bookTitle: string, chapterTitle: string },
 *   grouped: {
 *     mcq: Array<{ id: string, kind: string, text: string, options?: string[] }>,
 *     short: Array<{ id: string, kind: string, text: string, options?: string[] }>,
 *     long: Array<{ id: string, kind: string, text: string, options?: string[] }>,
 *   },
 * }} props
 */
export default function ChapterQuizClient({ context, grouped }) {
  /** Display order flattened (MCQ → short → long). */
  const ordered = useMemo(() => {
    return sortQuestionsForDisplay([
      ...grouped.mcq,
      ...grouped.short,
      ...grouped.long,
    ]);
  }, [grouped]);

  const initial = useMemo(() => new Set(ordered.map((q) => q.id)), [ordered]);
  const [selected, setSelected] = useState(() => /** @type {Set<string>} */ (new Set()));
  const [downloading, setDownloading] = useState(false);

  const toggle = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const onSelectAll = useCallback(() => {
    setSelected(new Set(initial));
  }, [initial]);

  const onClear = useCallback(() => {
    setSelected(new Set());
  }, []);

  const onDownloadPdf = useCallback(async () => {
    const picked = ordered.filter((q) => selected.has(q.id));
    if (!picked.length) return;

    setDownloading(true);
    try {
      await downloadChapterPdf({
        headingLines: [
          "Test Generator — practice sheet",
          `${context.classLabel} · ${context.bookTitle}`,
          context.chapterTitle,
        ],
        questions: picked,
      });
    } finally {
      setDownloading(false);
    }
  }, [context, ordered, selected]);

  const renderSection = (kind, bucket) => {
    if (!bucket.length) return null;
    return (
      <div key={kind} className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
          {SECTION_LABELS[kind]}
        </h3>
        <div className="space-y-2">
          {bucket.map((q) => (
            <QuestionBlock
              key={q.id}
              accentNumber={ordered.findIndex((x) => x.id === q.id) + 1}
              label={SECTION_LABELS[kind]}
              checked={selected.has(q.id)}
              onToggle={() => toggle(q.id)}
            >
              <span>{q.text}</span>
              {q.options?.length ? (
                <ul className="mt-2 list-none space-y-1 pl-1 text-[13px] text-zinc-700 dark:text-zinc-300">
                  {q.options.map((opt, j) => (
                    <li key={String(j)}>
                      ({String.fromCharCode(65 + j)}) {opt}
                    </li>
                  ))}
                </ul>
              ) : null}
            </QuestionBlock>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-[40vh] flex-col pb-14" style={{ backgroundColor: "var(--background)" }}>
      <QuizToolbar
        selectedCount={selected.size}
        totalCount={ordered.length}
        onSelectAll={onSelectAll}
        onClear={onClear}
        onDownloadPdf={onDownloadPdf}
        downloading={downloading}
      />
      <div className="mx-auto mt-10 w-full max-w-3xl space-y-10 px-6">
        {renderSection("mcq", grouped.mcq)}
        {renderSection("short", grouped.short)}
        {renderSection("long", grouped.long)}
      </div>
    </div>
  );
}
