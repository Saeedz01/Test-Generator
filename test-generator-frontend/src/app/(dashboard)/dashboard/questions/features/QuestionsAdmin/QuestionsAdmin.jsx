"use client";

import { useMemo, useState } from "react";
import { deleteWithToast } from "../../../features/deleteWithToast";
import toast from "react-hot-toast";
import { useGetBooksQuery } from "@/services/api/books.api";
import { useGetChaptersQuery } from "@/services/api/chapters.api";
import { useGetClassesQuery } from "@/services/api/classes.api";
import {
  useCreateLongQuestionMutation,
  useCreateMcqQuestionMutation,
  useCreateShortQuestionMutation,
  useDeleteLongQuestionMutation,
  useDeleteMcqQuestionMutation,
  useDeleteShortQuestionMutation,
  useGetQuestionsQuery,
  useUpdateLongQuestionMutation,
  useUpdateMcqQuestionMutation,
  useUpdateShortQuestionMutation,
} from "@/services/api/questions.api";
import { AdminCrudPage } from "../../../features/AdminCrudPage";
import { AdminModal } from "../../../features/AdminModal";
import { EMPTY, EMPTY_FILTERS } from "./questionsAdminData";
import { buildQuestionColumns } from "./QuestionsAdminColumns";
import { QuestionsFilters } from "./QuestionsFilters";
import { QuestionsFormFields } from "./QuestionsFormFields";
import {
  buildCreatePayload,
  buildMcqOptions,
  buildQuestionFormFromItem,
  normalizeChapter,
} from "./questionsAdminHelpers";
import { QuestionsAdminError, QuestionsAdminLoading } from "./QuestionsAdminStates";

export function QuestionsAdmin() {
  const {
    data: questions = [],
    isLoading: questionsLoading,
    isError: questionsError,
    error: questionsQueryError,
    refetch: refetchQuestions,
  } = useGetQuestionsQuery();

  const { data: classes = [], isLoading: classesLoading } = useGetClassesQuery();
  const { data: books = [], isLoading: booksLoading } = useGetBooksQuery();
  const { data: rawChapters = [], isLoading: chaptersLoading } = useGetChaptersQuery();

  const [createLongQuestion, { isLoading: creatingLong }] =
    useCreateLongQuestionMutation();
  const [createShortQuestion, { isLoading: creatingShort }] =
    useCreateShortQuestionMutation();
  const [createMcqQuestion, { isLoading: creatingMcq }] =
    useCreateMcqQuestionMutation();
  const [deleteLongQuestion] = useDeleteLongQuestionMutation();
  const [deleteShortQuestion] = useDeleteShortQuestionMutation();
  const [deleteMcqQuestion] = useDeleteMcqQuestionMutation();
  const [updateLongQuestion, { isLoading: updatingLong }] =
    useUpdateLongQuestionMutation();
  const [updateShortQuestion, { isLoading: updatingShort }] =
    useUpdateShortQuestionMutation();
  const [updateMcqQuestion, { isLoading: updatingMcq }] =
    useUpdateMcqQuestionMutation();

  const chapters = useMemo(
    () => rawChapters.map(normalizeChapter),
    [rawChapters],
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const isSaving =
    creatingLong ||
    creatingShort ||
    creatingMcq ||
    updatingLong ||
    updatingShort ||
    updatingMcq;
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

  const submit = async (event) => {
    event.preventDefault();

    if (!form.statement.trim() || !form.classId || !form.bookId || !form.chapterId) {
      toast.error("Statement, class, book, and chapter are required");
      return;
    }

    if (editing) {
      const payload = buildCreatePayload(form);

      try {
        if (editing.type === "mcq") {
          const options = buildMcqOptions(form.options);
          if (options.length !== 4 || options.some((option) => !option)) {
            toast.error("All four MCQ options are required");
            return;
          }

          await updateMcqQuestion({
            id: editing.id,
            ...payload,
            options,
          }).unwrap();
        } else if (editing.type === "short") {
          await updateShortQuestion({
            id: editing.id,
            ...payload,
          }).unwrap();
        } else {
          await updateLongQuestion({
            id: editing.id,
            ...payload,
          }).unwrap();
        }

        toast.success("Question updated");
        close();
      } catch (err) {
        toast.error(err?.data?.message || err?.error || "Failed to update question");
      }
      return;
    }

    const payload = buildCreatePayload(form);

    try {
      if (form.type === "mcq") {
        const options = buildMcqOptions(form.options);
        if (options.length !== 4 || options.some((option) => !option)) {
          toast.error("All four MCQ options are required");
          return;
        }

        await createMcqQuestion({
          ...payload,
          options,
        }).unwrap();
      } else if (form.type === "short") {
        await createShortQuestion(payload).unwrap();
      } else {
        await createLongQuestion(payload).unwrap();
      }

      toast.success("Question added");
      close();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to add question");
    }
  };

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
            setFilters={setFilters}
            classes={classes}
            filterBooks={filterBooks}
            filterChapters={filterChapters}
            shownCount={rows.length}
            totalCount={questions.length}
            hasActiveFilters={hasActiveFilters}
          />
        }
        columns={columns}
        rows={rows}
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
