"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ROUTES } from "@/constants";
import { selectChapter } from "@/store/selectionSlice";

/**
 * Compact chapter picker for small screens (sidebar is desktop-only).
 */
export function ChapterSwitcher({
  classId,
  bookId,
  chapters,
  selectedChapterId,
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  if (!chapters?.length) return null;

  return (
    <label className="block lg:hidden">
      <span className="text-caption font-semibold tracking-wide text-neutral-500 uppercase">
        Chapter
      </span>
      <select
        className="mt-1.5 h-11 w-full rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-3 text-small text-neutral-900 outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-500/30"
        value={selectedChapterId ?? ""}
        onChange={(event) => {
          const nextId = event.target.value;
          const next = chapters.find((item) => item.id === nextId);
          if (next) dispatch(selectChapter(next));
          router.push(ROUTES.chapterQuestions(classId, bookId, nextId));
        }}
      >
        {chapters.map((chapter) => (
          <option key={chapter.id} value={chapter.id}>
            {String(chapter.order ?? "").padStart(2, "0")} · {chapter.name}
          </option>
        ))}
      </select>
    </label>
  );
}
