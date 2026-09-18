"use client";

import { useMemo, useState } from "react";
import { deleteWithToast } from "../../../features/deleteWithToast";
import { useGetBooksQuery } from "@/services/api/books.api";
import { useGetChaptersQuery } from "@/services/api/chapters.api";
import { useGetClassesQuery } from "@/services/api/classes.api";
import {
  useDeleteLongQuestionMutation,
  useDeleteMcqQuestionMutation,
  useDeleteShortQuestionMutation,
  useGetQuestionsPageQuery,
} from "@/services/api/questions.api";
import { AdminCrudPage } from "../../../features/AdminCrudPage";
import { AdminModal } from "../../../features/AdminModal";
import { EMPTY, EMPTY_FILTERS, QUESTIONS_PAGE_SIZE } from "./questionsAdminData";
import { buildQuestionColumns } from "./QuestionsAdminColumns";
import { QuestionsFilters } from "./QuestionsFilters";
import { QuestionsFormFields } from "./QuestionsFormFields";
import { QuestionsPagination } from "./QuestionsPagination";
import { buildQuestionFormFromItem, normalizeChapter } from "./questionsAdminHelpers";
import { QuestionsAdminError, QuestionsAdminLoading } from "./QuestionsAdminStates";
import { useSaveQuestion } from "./useSaveQuestion";

const NO_QUESTIONS = [];

export function QuestionsAdmin() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  // Any filter change starts again from the first page.
  const updateFilters = (update) => {
    setFilters(update);
    setPage(1);
  };

  const questionScope = useMemo(() => {
    const paging = {
      type: filters.type || undefined,
      page,
      limit: QUESTIONS_PAGE_SIZE,
    };
    if (filters.chapterId) return { chapterId: filters.chapterId, ...paging };
    if (filters.bookId) return { bookId: filters.bookId, ...paging };
    if (filters.classId) return { classId: filters.classId, ...paging };
    return paging;
  }, [filters.chapterId, filters.bookId, filters.classId, filters.type, page]);

  const {
    data: questionPage,
    isLoading: questionsLoading,
    isFetching: questionsFetching,
    isError: questionsError,
    error: questionsQueryError,
    refetch: refetchQuestions,
  } = useGetQuestionsPageQuery(questionScope);
  const questions = questionPage?.items ?? NO_QUESTIONS;
  const questionsMeta = questionPage?.meta;

  const { data: classes = [], isLoading: classesLoading } = useGetClassesQuery();
  const { data: books = [], isLoading: booksLoading } = useGetBooksQuery();
  const { data: rawChapters = [], isLoading: chaptersLoading } = useGetChaptersQuery();

  const [deleteLongQuestion] = useDeleteLongQuestionMutation();
  const [deleteShortQuestion] = useDeleteShortQuestionMutation();
  const [deleteMcqQuestion] = useDeleteMcqQuestionMutation();

  const chapters = useMemo(
    () => rawChapters.map(normalizeChapter),
    [rawChapters],
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const isLoading = questionsLoading || classesLoading || booksLoading || chaptersLoading;

  const classNameById = useMemo(
    () => Object.fromEntries(classes.map((item) => [item.id, item.name])),
    [classes],
  );
  const bookNameById = useMemo(
    () => Object.fromEntries(books.map((item) => [item.id, item.name])),
    [books],
  );
  const chapterNameById = useMemo(
    () => Object.fromEntries(chapters.map((item) => [item.id, item.name])),
    [chapters],
  );

  const filterBooks = useMemo(() => {
    if (!filters.classId) return books;
    return books.filter((book) => book.classId === filters.classId);
  }, [books, filters.classId]);

  const filterChapters = useMemo(() => {
    let list = chapters;
    if (filters.bookId) {
      list = list.filter((chapter) => chapter.bookId === filters.bookId);
    } else if (filters.classId) {
      list = list.filter((chapter) => chapter.classId === filters.classId);
    }
    return [...list].sort((a, b) => a.order - b.order);
  }, [chapters, filters.bookId, filters.classId]);

  const booksForClass = useMemo(
    () => books.filter((book) => book.classId === form.classId),
    [books, form.classId],
  );

  const chaptersForBook = useMemo(
    () =>
      chapters
        .filter((chapter) => chapter.bookId === form.bookId)
        .sort((a, b) => a.order - b.order),
    [chapters, form.bookId],
  );

  const filteredQuestions = useMemo(() => {
    return questions.filter((item) => {
      if (filters.classId && item.classId !== filters.classId) return false;
      if (filters.bookId && item.bookId !== filters.bookId) return false;
      if (filters.chapterId && item.chapterId !== filters.chapterId) return false;
      if (filters.type && item.type !== filters.type) return false;
      return true;
    });
  }, [questions, filters]);

  const rows = useMemo(
    () =>
      filteredQuestions.map((item) => ({
        ...item,
        onEdit: () => {
          setEditing(item);
          setForm(buildQuestionFormFromItem(item));
          setOpen(true);
        },
        onDelete: () =>
          deleteWithToast({
            entityLabel: "Question",
            entityName: item.statement,
            confirmMessage: "Delete this question? This cannot be undone.",
            onDelete: async () => {
              if (item.type === "long") {
                await deleteLongQuestion(item.id).unwrap();
              } else if (item.type === "short") {
                await deleteShortQuestion(item.id).unwrap();
              } else {
                await deleteMcqQuestion(item.id).unwrap();
              }
            },
          }),
      })),
    [
      filteredQuestions,
      deleteLongQuestion,
      deleteShortQuestion,
      deleteMcqQuestion,
    ],
  );

  const hasActiveFilters = Boolean(
    filters.classId || filters.bookId || filters.chapterId || filters.type,
  );

  const close = () => {
    setOpen(false);
    setEditing(null);
    setForm(EMPTY);
  };

  const { submit, isSaving } = useSaveQuestion({ form, editing, onSaved: close });

  const columns = useMemo(
    () =>
      buildQuestionColumns({
        classNameById,
        bookNameById,
        chapterNameById,
      }),
    [classNameById, bookNameById, chapterNameById],
  );

  if (isLoading) {
    return <QuestionsAdminLoading />;
  }

  if (questionsError) {
    return (
      <QuestionsAdminError
        error={questionsQueryError}
        onRetry={() => refetchQuestions()}
      />
    );
  }

  return (
    <>
      <AdminCrudPage
        title="Manage Questions"
        description="Maintain MCQs, short, and long questions for each chapter."
        addLabel="Add question"
        emptyTitle={hasActiveFilters ? "No questions match these filters" : "No questions yet"}
        emptyDescription={
          hasActiveFilters
            ? "Try clearing or changing filters to see more questions."
            : "The database has no questions yet. Add your first question to get started."
        }
        onAdd={() => {
          const firstClass = classes[0];
          const firstBook = books.find((b) => b.classId === firstClass?.id);
          const firstChapter = chapters.find((c) => c.bookId === firstBook?.id);
          setEditing(null);
          setForm({
            ...EMPTY,
            classId: firstClass?.id || "",
            bookId: firstBook?.id || "",
            chapterId: firstChapter?.id || "",
          });
          setOpen(true);
        }}
        toolbar={
          <QuestionsFilters
            filters={filters}
            setFilters={updateFilters}
            classes={classes}
            filterBooks={filterBooks}
            filterChapters={filterChapters}
            shownCount={rows.length}
            totalCount={questionsMeta?.total ?? questions.length}
            hasActiveFilters={hasActiveFilters}
          />
        }
        columns={columns}
        rows={rows}
        footer={
          <QuestionsPagination
            page={page}
            totalPages={questionsMeta?.totalPages ?? 1}
            isFetching={questionsFetching}
            onPageChange={setPage}
          />
        }
      />

      <AdminModal
        open={open}
        title={editing ? "Edit question" : "Add question"}
        onClose={close}
        className="max-w-2xl"
      >
        <QuestionsFormFields
          form={form}
          setForm={setForm}
          classes={classes}
          books={books}
          chapters={chapters}
          booksForClass={booksForClass}
          chaptersForBook={chaptersForBook}
          editing={editing}
          onClose={close}
          onSubmit={submit}
          isSubmitting={isSaving}
        />
      </AdminModal>
    </>
  );
}
