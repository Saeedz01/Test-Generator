"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { EmptyState, Heading } from "@/components/ui";
import { ROUTES } from "@/constants";
import { groupQuestionsByType } from "@/data/curriculum";
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
import { ChapterSidebar } from "@/components/shared";

/**
 * Questions board — grouped MCQ → Short → Long with sticky generate CTA.
 */
export function QuestionsBoard({ classId, bookId, chapterId }) {
  const dispatch = useDispatch();
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
  } = useGetQuestionsQuery();

  const schoolClass = classes.find((item) => item.id === classId);
  const book = books.find((item) => item.id === bookId);
  const chapter = chapters.find((item) => item.id === chapterId);
  const questions = useMemo(
    () => allQuestions.filter((item) => item.chapterId === chapterId),
    [allQuestions, chapterId],
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
    return (
      <EmptyState
        title="Loading questions..."
        description="Fetching chapter questions from the database."
      />
    );
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
      <div className="max-w-3xl">
        <p className="text-caption font-medium tracking-wide text-primary-700 uppercase">
          {schoolClass.name} · {book.name}
        </p>
        <Heading level="h1" className="mt-1">
          {chapter.name}
        </Heading>
        <p className="mt-2 text-body text-neutral-600">
          Select questions for your paper. Order is fixed: MCQs, then Short,
          then Long.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)]">
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
              description="Try another chapter from the sidebar."
            />
          ) : (
            <>
              <QuestionGroup title="MCQs" questions={grouped.mcq} />
              <QuestionGroup title="Short Questions" questions={grouped.short} />
              <QuestionGroup title="Long Questions" questions={grouped.long} />
            </>
          )}
          <StickyGenerateBar />
        </div>
      </div>
    </div>
  );
}
