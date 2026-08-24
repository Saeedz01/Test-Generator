"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui";
import {
  addQuestion,
  deleteQuestion,
  selectAdminBooks,
  selectAdminChapters,
  selectAdminClasses,
  selectAdminQuestions,
  updateQuestion,
} from "@/store/adminContentSlice";
import { AdminCrudPage } from "../../../features/AdminCrudPage";
import { AdminModal } from "../../../features/AdminModal";
import { EMPTY, EMPTY_FILTERS, TYPE_LABEL } from "./questionsAdminData";
import { QuestionsFilters } from "./QuestionsFilters";
import { QuestionsFormFields } from "./QuestionsFormFields";

export function QuestionsAdmin() {
  const dispatch = useDispatch();
  const questions = useSelector(selectAdminQuestions);
  const classes = useSelector(selectAdminClasses);
  const books = useSelector(selectAdminBooks);
  const chapters = useSelector(selectAdminChapters);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

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
          setForm({
            statement: item.statement,
            type: item.type,
            classId: item.classId,
            bookId: item.bookId,
            chapterId: item.chapterId,
            difficulty: item.difficulty || "easy",
            marks: item.marks || 1,
            optionsText: Array.isArray(item.options)
              ? item.options.join("\n")
              : EMPTY.optionsText,
            correctOptionIndex: item.correctOptionIndex ?? 0,
            sampleAnswer: item.sampleAnswer || "",
          });
          setOpen(true);
        },
        onDelete: () => {
          if (!window.confirm("Delete this question?")) return;
          dispatch(deleteQuestion(item.id));
          toast.success("Question deleted");
        },
      })),
    [filteredQuestions, dispatch],
  );

  const hasActiveFilters = Boolean(
    filters.classId || filters.bookId || filters.chapterId || filters.type,
  );

  const close = () => {
    setOpen(false);
    setEditing(null);
    setForm(EMPTY);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.statement.trim() || !form.classId || !form.bookId || !form.chapterId) {
      toast.error("Statement, class, book, and chapter are required");
      return;
    }
    if (editing) {
      dispatch(updateQuestion({ id: editing.id, ...form }));
      toast.success("Question updated");
    } else {
      dispatch(addQuestion(form));
      toast.success("Question added");
    }
    close();
  };

  return (
    <>
      <AdminCrudPage
        title="Manage Questions"
        description="Maintain MCQs, short, and long questions for each chapter."
        addLabel="Add question"
        emptyTitle={hasActiveFilters ? "No questions match these filters" : "No items yet"}
        emptyDescription={
          hasActiveFilters
            ? "Try clearing or changing filters to see more questions."
            : "Add your first item to get started."
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
        columns={[
          {
            key: "type",
            label: "Type",
            render: (row) => (
              <Badge variant="outline">{TYPE_LABEL[row.type] ?? row.type}</Badge>
            ),
          },
          {
            key: "statement",
            label: "Statement",
            render: (row) => (
              <span className="line-clamp-2 max-w-sm">{row.statement}</span>
            ),
          },
          {
            key: "classId",
            label: "Class",
            render: (row) => classNameById[row.classId] || "—",
          },
          {
            key: "bookId",
            label: "Book",
            render: (row) => bookNameById[row.bookId] || "—",
          },
          {
            key: "chapterId",
            label: "Chapter",
            render: (row) => chapterNameById[row.chapterId] || "—",
          },
          { key: "marks", label: "Marks" },
          { key: "difficulty", label: "Level" },
        ]}
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
        />
      </AdminModal>
    </>
  );
}
