"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { EmptyState, Heading } from "@/components/ui";
import {
  Breadcrumb,
  ChapterSidebar,
  ChapterSwitcher,
  QuestionListSkeleton,
} from "@/components/shared";
import { ROUTES } from "@/constants";
import { groupQuestionsByType } from "@/utils/groupQuestionsByType";
import { useGetClassesQuery } from "@/services/api/classes.api";
import { useGetBooksQuery } from "@/services/api/books.api";
import { useGetChaptersQuery } from "@/services/api/chapters.api";
import { useGetQuestionsQuery } from "@/services/api/questions.api";
import {
  selectBook,
  selectChapter,
  selectClass,
} from "@/store/selectionSlice";
import { QuestionGroup } from "./QuestionGroup";
import { StickyGenerateBar } from "./StickyGenerateBar";

/**
 * Questions board — grouped MCQ → Short → Long with sticky generate CTA.
 */
export function QuestionsBoard({ classId, bookId, chapterId }) {
  const dispatch = useDispatch();
  const [language, setLanguage] = useState("en");
  const {
    data: classes = [],
    isLoading: classesLoading,
    isError: classesError,
    error: classesFetchError,
    refetch: refetchClasses,
  } = useGetClassesQuery();
  const {
    data: books = [],
    isLoading: booksLoading,
    isError: booksError,
    error: booksFetchError,
    refetch: refetchBooks,
  } = useGetBooksQuery(classId);
  const {
    data: chapters = [],
    isLoading: chaptersLoading,
    isError: chaptersError,
    error: chaptersFetchError,
    refetch: refetchChapters,
  } = useGetChaptersQuery({ bookId, classId });
  const {
    data: allQuestions = [],
    isLoading: questionsLoading,
    isError: questionsError,
    error: questionsFetchError,
    refetch: refetchQuestions,
  } = useGetQuestionsQuery(
    { chapterId },
    { skip: !chapterId },
  );

  const schoolClass = classes.find((item) => item.id === classId);
  const book = books.find((item) => item.id === bookId);
  const chapter = chapters.find((item) => item.id === chapterId);
  const questions = useMemo(
    () =>
      allQuestions.map((item) => ({
        ...item,
        chapterName: item.chapterName || chapter?.name || "",
        classId: item.classId || classId,
        bookId: item.bookId || bookId,
      })),
    [allQuestions, chapter?.name, classId, bookId],
  );
  const grouped = groupQuestionsByType(questions);

  const isLoading =
    classesLoading || booksLoading || chaptersLoading || questionsLoading;
  const isError =
    classesError || booksError || chaptersError || questionsError;
  const error =
    classesFetchError ||
    booksFetchError ||
    chaptersFetchError ||
    questionsFetchError;

  useEffect(() => {
    if (schoolClass) dispatch(selectClass(schoolClass));
    if (book) dispatch(selectBook(book));
    if (chapter) dispatch(selectChapter(chapter));
  }, [dispatch, schoolClass, book, chapter]);

  if (isLoading) {
    return <QuestionListSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Could not load questions"
        description={
          error?.data?.message ||
          error?.error ||
          "Check that the backend is running, then try again."
        }
        action={
          <button
            type="button"
            className="text-small font-semibold text-primary-700"
            onClick={() => {
              refetchClasses();
              refetchBooks();
              refetchChapters();
              refetchQuestions();
            }}
          >
            Retry
          </button>
        }
      />
    );
  }

  if (!schoolClass || !book || !chapter) {
    return (
      <EmptyState
        title="Chapter not found"
        description="Choose a valid class, book, and chapter path."
        action={
          <Link href={ROUTES.CLASSES} className="text-small font-semibold text-primary-700">
            Back to classes
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6 pb-4">
      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.HOME },
          { label: "Classes", href: ROUTES.CLASSES },
          { label: schoolClass.name, href: ROUTES.classBooks(classId) },
          { label: book.name, href: ROUTES.bookChapters(classId, bookId) },
          { label: chapter.name },
        ]}
      />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-caption font-medium tracking-wide break-words text-primary-700 uppercase">
            {schoolClass.name} · {book.name}
          </p>
          <Heading level="h1" className="mt-1 break-words">
            {chapter.name}
          </Heading>
          <p className="mt-2 text-body text-neutral-600">
            Select questions for your paper. Order is fixed: MCQs, then Short,
            then Long.
          </p>
        </div>
        <div
          className="inline-flex rounded-[var(--radius-md)] border border-neutral-200 bg-neutral-0 p-1"
          role="group"
          aria-label="Question language"
        >
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-caption font-semibold transition-colors ${
              language === "en"
                ? "bg-primary-600 text-neutral-0"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage("ur")}
            className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-caption font-semibold transition-colors ${
              language === "ur"
                ? "bg-primary-600 text-neutral-0"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            اردو
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)]">
        <ChapterSwitcher
          classId={classId}
          bookId={bookId}
          chapters={chapters}
          selectedChapterId={chapterId}
        />

        <ChapterSidebar
          classId={classId}
          bookId={bookId}
          chapters={chapters}
          selectedChapterId={chapterId}
          className="hidden lg:block lg:sticky lg:top-20 lg:self-start"
        />

        <div className="min-w-0 space-y-8">
          {questions.length === 0 ? (
            <EmptyState
              title="No questions in this chapter"
              description="Choose another chapter from the list above, or go back to this book’s chapters."
              action={
                <Link
                  href={ROUTES.bookChapters(classId, bookId)}
                  className="text-small font-semibold text-primary-700"
                >
                  Back to chapters
                </Link>
              }
            />
          ) : (
            <>
              <QuestionGroup
                title="MCQs"
                questions={grouped.mcq}
                language={language}
              />
              <QuestionGroup
                title="Short Questions"
                questions={grouped.short}
                language={language}
              />
              <QuestionGroup
                title="Long Questions"
                questions={grouped.long}
                language={language}
              />
            </>
          )}
          <StickyGenerateBar />
        </div>
      </div>
    </div>
  );
}
