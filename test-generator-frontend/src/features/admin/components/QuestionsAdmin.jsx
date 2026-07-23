"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Badge, Button, Card } from "@/components/ui";
import {
  addQuestion,
  deleteQuestion,
  selectAdminBooks,
  selectAdminChapters,
  selectAdminClasses,
  selectAdminQuestions,
  updateQuestion,
} from "@/store/adminContentSlice";
import { AdminCrudPage } from "./AdminCrudPage";
import { AdminModal } from "./AdminModal";
import { Field, TextInput, TextSelect, TextTextarea } from "./AdminFormFields";

const EMPTY = {
  statement: "",
  type: "mcq",
  classId: "",
  bookId: "",
  chapterId: "",
  difficulty: "easy",
  marks: 1,
  optionsText: "Option A\nOption B\nOption C\nOption D",
  correctOptionIndex: 0,
  sampleAnswer: "",
};

const EMPTY_FILTERS = {
  classId: "",
  bookId: "",
  chapterId: "",
  type: "",
};

const TYPE_LABEL = {
  mcq: "MCQ",
  short: "Short",
  long: "Long",
};

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
          <Card className="border-neutral-200 bg-neutral-0 p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-caption font-semibold tracking-wide text-neutral-500 uppercase">
                Filters
              </p>
              <div className="flex items-center gap-3">
                <p className="text-caption text-neutral-500">
                  Showing {rows.length} of {questions.length}
                </p>
                {hasActiveFilters ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters(EMPTY_FILTERS)}
                  >
                    Clear
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Field label="Class">
                <TextSelect
                  value={filters.classId}
                  onChange={(e) => {
                    const classId = e.target.value;
                    setFilters((prev) => ({
                      ...prev,
                      classId,
                      bookId: "",
                      chapterId: "",
                    }));
                  }}
                >
                  <option value="">All classes</option>
                  {classes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </TextSelect>
              </Field>

              <Field label="Book">
                <TextSelect
                  value={filters.bookId}
                  onChange={(e) => {
                    const bookId = e.target.value;
                    setFilters((prev) => ({
                      ...prev,
                      bookId,
                      chapterId: "",
                    }));
                  }}
                >
                  <option value="">All books</option>
                  {filterBooks.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </TextSelect>
              </Field>

              <Field label="Chapter">
                <TextSelect
                  value={filters.chapterId}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      chapterId: e.target.value,
                    }))
                  }
                >
                  <option value="">All chapters</option>
                  {filterChapters.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </TextSelect>
              </Field>

              <Field label="Question type">
                <TextSelect
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  <option value="">All types</option>
                  <option value="mcq">MCQs</option>
                  <option value="short">Short</option>
                  <option value="long">Long</option>
                </TextSelect>
              </Field>
            </div>
          </Card>
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
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Statement">
            <TextTextarea
              value={form.statement}
              onChange={(e) =>
                setForm((f) => ({ ...f, statement: e.target.value }))
              }
              required
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Type">
              <TextSelect
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              >
                <option value="mcq">MCQ</option>
                <option value="short">Short</option>
                <option value="long">Long</option>
              </TextSelect>
            </Field>
            <Field label="Difficulty">
              <TextSelect
                value={form.difficulty}
                onChange={(e) =>
                  setForm((f) => ({ ...f, difficulty: e.target.value }))
                }
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </TextSelect>
            </Field>
            <Field label="Marks">
              <TextInput
                type="number"
                min="1"
                value={form.marks}
                onChange={(e) => setForm((f) => ({ ...f, marks: e.target.value }))}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Class">
              <TextSelect
                value={form.classId}
                onChange={(e) => {
                  const classId = e.target.value;
                  const nextBook = books.find((b) => b.classId === classId);
                  const nextChapter = chapters.find(
                    (c) => c.bookId === nextBook?.id,
                  );
                  setForm((f) => ({
                    ...f,
                    classId,
                    bookId: nextBook?.id || "",
                    chapterId: nextChapter?.id || "",
                  }));
                }}
                required
              >
                <option value="">Select class</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </TextSelect>
            </Field>
            <Field label="Book">
              <TextSelect
                value={form.bookId}
                onChange={(e) => {
                  const bookId = e.target.value;
                  const nextChapter = chapters.find((c) => c.bookId === bookId);
                  setForm((f) => ({
                    ...f,
                    bookId,
                    chapterId: nextChapter?.id || "",
                  }));
                }}
                required
              >
                <option value="">Select book</option>
                {booksForClass.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </TextSelect>
            </Field>
            <Field label="Chapter">
              <TextSelect
                value={form.chapterId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, chapterId: e.target.value }))
                }
                required
              >
                <option value="">Select chapter</option>
                {chaptersForBook.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </TextSelect>
            </Field>
          </div>

          {form.type === "mcq" ? (
            <>
              <Field label="Options (one per line, 4 options)">
                <TextTextarea
                  value={form.optionsText}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, optionsText: e.target.value }))
                  }
                />
              </Field>
              <Field label="Correct option index (0–3)">
                <TextInput
                  type="number"
                  min="0"
                  max="3"
                  value={form.correctOptionIndex}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      correctOptionIndex: e.target.value,
                    }))
                  }
                />
              </Field>
            </>
          ) : (
            <Field label="Sample answer">
              <TextTextarea
                value={form.sampleAnswer}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sampleAnswer: e.target.value }))
                }
              />
            </Field>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">{editing ? "Save changes" : "Create"}</Button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
