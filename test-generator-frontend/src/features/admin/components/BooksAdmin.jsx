"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import {
  addBook,
  deleteBook,
  selectAdminBooks,
  updateBook,
} from "@/store/adminContentSlice";
import { AdminCrudPage } from "./AdminCrudPage";
import { AdminModal } from "./AdminModal";
import { Field, TextInput, TextSelect, TextTextarea } from "./AdminFormFields";
import { useGetClassesQuery } from "@/services/api/classes.api";

const EMPTY = {
  name: "",
  classId: "",
  description: "",
  edition: "",
};

export function BooksAdmin() {
  const {
    data: classes = [],
    isLoading: getClassesLoading,
    error: getClassesError,
  } = useGetClassesQuery();

  const dispatch = useDispatch();
  const books = useSelector(selectAdminBooks);

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
            description: item.description || "",
            edition: item.edition || "",
          });
          setOpen(true);
        },
        onDelete: () => {
          if (!window.confirm(`Delete book "${item.name}"?`)) return;

          dispatch(deleteBook(item.id));
          toast.success("Book deleted");
        },
      })),
    [books, dispatch]
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
          setForm({
            ...EMPTY,
            classId: classes[0]?.id || "",
          });
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

      <AdminModal
        open={open}
        title={editing ? "Edit book" : "Add book"}
        onClose={close}
      >
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Book name">
            <TextInput
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              required
            />
          </Field>

          <Field label="Class">
            <TextSelect
              value={form.classId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  classId: e.target.value,
                }))
              }
              required
              disabled={getClassesLoading}
            >
              <option value="">
                {getClassesLoading ? "Loading classes..." : "Select class"}
              </option>

              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </TextSelect>

            {getClassesError && (
              <p className="mt-1 text-sm text-red-500">
                Failed to load classes.
              </p>
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* <Field label="Subject">
              <TextInput
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              />
            </Field> */}

            {/* <Field label="Author">
              <TextInput
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              />
            </Field> */}
          </div>

          <Field label="Edition">
            <TextInput
              value={form.edition}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  edition: e.target.value,
                }))
              }
            />
          </Field>

          <Field label="Description">
            <TextTextarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={getClassesLoading || classes.length === 0}
            >
              {editing ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}