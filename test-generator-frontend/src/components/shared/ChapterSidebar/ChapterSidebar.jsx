"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { ListTree } from "lucide-react";
import { ROUTES } from "@/constants";
import { selectChapter } from "@/store/selectionSlice";
import { cn } from "@/utils";

/**
 * Sidebar chapter list with selected highlighting.
 */
export function ChapterSidebar({
  classId,
  bookId,
  chapters,
  selectedChapterId,
  className,
}) {
  const dispatch = useDispatch();

  return (
    <aside
      className={cn(
        "rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-3",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2 px-2 pt-1">
        <ListTree className="size-4 text-primary-700" aria-hidden="true" />
        <p className="text-caption font-semibold tracking-wide text-neutral-500 uppercase">
          Chapters
        </p>
      </div>

      <nav aria-label="Chapters">
        <ul className="space-y-1">
          {chapters.map((chapter) => {
            const active = chapter.id === selectedChapterId;
            return (
              <li key={chapter.id}>
                <Link
                  href={ROUTES.chapterQuestions(classId, bookId, chapter.id)}
                  onClick={() => dispatch(selectChapter(chapter))}
                  className={cn(
                    "block rounded-[var(--radius-md)] px-3 py-2.5 text-small transition-[background-color,color,transform] duration-150",
                    active
                      ? "bg-primary-50 font-semibold text-primary-800"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="text-caption text-neutral-400">
                    {String(chapter.order).padStart(2, "0")}
                  </span>
                  <span className="mt-0.5 block leading-snug">{chapter.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
