"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { EmptyState, Heading } from "@/components/ui";
import { ROUTES } from "@/constants";
import {
  getBookById,
  getChaptersByBookId,
  getClassById,
} from "@/data/curriculum";
import {
  selectBook,
  selectChapter,
  selectClass,
  selectSelectedChapter,
} from "@/store/selectionSlice";
import { ChapterSidebar } from "./ChapterSidebar";

/**
 * Chapters page shell — sidebar + detail panel.
 */
export function ChaptersLayout({ classId, bookId, children }) {
  const dispatch = useDispatch();
  const selectedChapter = useSelector(selectSelectedChapter);
  const schoolClass = getClassById(classId);
  const book = getBookById(bookId);
  const chapters = getChaptersByBookId(bookId);

  useEffect(() => {
    if (schoolClass) dispatch(selectClass(schoolClass));
    if (book) dispatch(selectBook(book));
  }, [dispatch, schoolClass, book]);

  if (!schoolClass || !book) {
    return (
      <EmptyState
        title="Book not found"
        description="Return to classes and pick a valid path."
        action={
          <Link href={ROUTES.CLASSES} className="text-small font-semibold text-primary-700">
            Back to classes
          </Link>
        }
      />
    );
  }

  const activeId = selectedChapter?.id ?? chapters[0]?.id;

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <p className="text-caption font-medium tracking-wide text-primary-700 uppercase">
          {schoolClass.name} · {book.subject}
        </p>
        <Heading level="h1" className="mt-1">
          {book.name}
        </Heading>
        <p className="mt-2 text-body text-neutral-600">
          Browse chapters in the sidebar, then open a chapter to select questions.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)]">
        <ChapterSidebar
          classId={classId}
          bookId={bookId}
          chapters={chapters}
          selectedChapterId={activeId}
          className="lg:sticky lg:top-20 lg:self-start"
        />

        <div className="min-w-0 rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-5 sm:p-6">
          {children ?? (
            <ChapterOverview
              classId={classId}
              bookId={bookId}
              chapters={chapters}
              selectedChapterId={activeId}
              onSelect={(chapter) => dispatch(selectChapter(chapter))}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ChapterOverview({
  classId,
  bookId,
  chapters,
  selectedChapterId,
  onSelect,
}) {
  const chapter =
    chapters.find((item) => item.id === selectedChapterId) ?? chapters[0];

  if (!chapter) {
    return (
      <EmptyState
        title="No chapters yet"
        description="This book does not have chapters in the dummy dataset."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Heading level="h3">{chapter.name}</Heading>
      <p className="text-body text-neutral-600">{chapter.description}</p>
      <Link
        href={ROUTES.chapterQuestions(classId, bookId, chapter.id)}
        onClick={() => onSelect(chapter)}
        className="inline-flex h-10 items-center justify-center rounded-[var(--radius-button)] bg-primary-600 px-4 text-small font-semibold text-neutral-0 transition-colors duration-150 hover:bg-primary-700"
      >
        Open questions
      </Link>
    </div>
  );
}
