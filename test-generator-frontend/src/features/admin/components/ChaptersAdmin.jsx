"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import {
  addChapter,
  deleteChapter,
  selectAdminBooks,
  selectAdminChapters,
  selectAdminClasses,
  updateChapter,
} from "@/store/adminContentSlice";
import { AdminCrudPage } from "./AdminCrudPage";
import { AdminModal } from "./AdminModal";
import { Field, TextInput, TextSelect, TextTextarea } from "./AdminFormFields";

const EMPTY = {
  name: "",
  classId: "",
  bookId: "",
  order: 1,
  description: "",
};

export function ChaptersAdmin() {
  const dispatch = useDispatch();
  const chapters = useSelector(selectAdminChapters);
  const books = useSelector(selectAdminBooks);
  const classes = useSelector(selectAdminClasses);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const booksForClass = useMemo(
    () => books.filter((book) => book.classId === form.classId),
    [books, form.classId],
  );

  const labels = useMemo(() => {
    const classMap = Object.fromEntries(classes.map((c) => [c.id, c.name]));
    const bookMap = Object.fromEntries(books.map((b) => [b.id, b.name]));
    return { classMap, bookMap };
  }, [classes, books]);

  const rows = useMemo(
    () =>
      [...chapters]
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          ...item,
          onEdit: () => {
            setEditing(item);
            setForm({
              name: item.name,
              classId: item.classId,
              bookId: item.bookId,
              order: item.order,
              description: item.description || "",
            });
            setOpen(true);
          },
          onDelete: () => {
            if (!window.confirm(`Delete chapter “${item.name}”?`)) return;
            dispatch(deleteChapter(item.id));
            toast.success("Chapter deleted");
          },
        })),
    [chapters, dispatch],
  );

  const close = () => {
    setOpen(false);
    setEditing(null);
    setForm(EMPTY);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.classId || !form.bookId) {
      toast.error("Name, class, and book are required");
      return;
    }
    if (editing) {
      dispatch(updateChapter({ id: editing.id, ...form }));
      toast.success("Chapter updated");
    } else {
      dispatch(addChapter(form));
      toast.success("Chapter added");
    }
    close();
  };

  return (
    <>
      <AdminCrudPage
        title="Manage Chapters"
        description="Organize chapters under each book for question banks."
        addLabel="Add chapter"
        onAdd={() => {
          const firstClass = classes[0];
          const firstBook = books.find((b) => b.classId === firstClass?.id);
          setEditing(null);
          setForm({
            ...EMPTY,
            classId: firstClass?.id || "",
            bookId: firstBook?.id || "",
          });
          setOpen(true);
        }}
        columns={[
          { key: "order", label: "#" },
          { key: "name", label: "Chapter" },
          {
            key: "bookId",
            label: "Book",
            render: (row) => labels.bookMap[row.bookId] || row.bookId,
          },
          {
            key: "classId",
            label: "Class",
            render: (row) => labels.classMap[row.classId] || row.classId,
          },
        ]}
        rows={rows}
      />

      <AdminModal
        open={open}
        title={editing ? "Edit chapter" : "Add chapter"}
        onClose={close}
      >
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Chapter name">
            <TextInput
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </Field>
          <Field label="Class">
            <TextSelect
              value={form.classId}
              onChange={(e) => {
                const classId = e.target.value;
                const nextBook = books.find((b) => b.classId === classId);
                setForm((f) => ({
                  ...f,
                  classId,
                  bookId: nextBook?.id || "",
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
              onChange={(e) => setForm((f) => ({ ...f, bookId: e.target.value }))}
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
          <Field label="Order">
            <TextInput
              type="number"
              min="1"
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
            />
          </Field>
          <Field label="Description">
            <TextTextarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </Field>
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
