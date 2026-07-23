"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import {
  addBook,
  deleteBook,
  selectAdminBooks,
  selectAdminClasses,
  updateBook,
} from "@/store/adminContentSlice";
import { AdminCrudPage } from "./AdminCrudPage";
import { AdminModal } from "./AdminModal";
import { Field, TextInput, TextSelect, TextTextarea } from "./AdminFormFields";

const EMPTY = {
  name: "",
  classId: "",
  subject: "",
  author: "",
  description: "",
  edition: "",
};

export function BooksAdmin() {
  const dispatch = useDispatch();
  const books = useSelector(selectAdminBooks);
  const classes = useSelector(selectAdminClasses);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const classNameById = useMemo(() => {
    const map = {};
    classes.forEach((item) => {
      map[item.id] = item.name;
    });
    return map;
  }, [classes]);

  const rows = useMemo(
    () =>
      books.map((item) => ({
        ...item,
        onEdit: () => {
          setEditing(item);
          setForm({
            name: item.name,
            classId: item.classId,
            subject: item.subject || "",
            author: item.author || "",
            description: item.description || "",
            edition: item.edition || "",
          });
          setOpen(true);
        },
        onDelete: () => {
          if (!window.confirm(`Delete book “${item.name}”?`)) return;
          dispatch(deleteBook(item.id));
          toast.success("Book deleted");
        },
      })),
    [books, dispatch],
  );

  const close = () => {
    setOpen(false);
    setEditing(null);
    setForm(EMPTY);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.classId) {
      toast.error("Name and class are required");
      return;
    }
    if (editing) {
      dispatch(updateBook({ id: editing.id, ...form }));
      toast.success("Book updated");
    } else {
      dispatch(addBook(form));
      toast.success("Book added");
    }
    close();
  };

  return (
    <>
      <AdminCrudPage
        title="Manage Books"
        description="Attach books to classes and keep metadata up to date."
        addLabel="Add book"
        onAdd={() => {
          setEditing(null);
          setForm({ ...EMPTY, classId: classes[0]?.id || "" });
          setOpen(true);
        }}
        columns={[
          { key: "name", label: "Book" },
          {
            key: "classId",
            label: "Class",
            render: (row) => classNameById[row.classId] || row.classId,
          },
          { key: "subject", label: "Subject" },
          { key: "author", label: "Author" },
        ]}
        rows={rows}
      />

      <AdminModal open={open} title={editing ? "Edit book" : "Add book"} onClose={close}>
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Book name">
            <TextInput
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </Field>
          <Field label="Class">
            <TextSelect
              value={form.classId}
              onChange={(e) => setForm((f) => ({ ...f, classId: e.target.value }))}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Subject">
              <TextInput
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              />
            </Field>
            <Field label="Author">
              <TextInput
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              />
            </Field>
          </div>
          <Field label="Edition">
            <TextInput
              value={form.edition}
              onChange={(e) => setForm((f) => ({ ...f, edition: e.target.value }))}
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
