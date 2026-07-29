"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Button, EmptyState } from "@/components/ui";
import { AdminCrudPage } from "./AdminCrudPage";
import { AdminModal } from "./AdminModal";
import { Field, TextInput, TextSelect, TextTextarea } from "./AdminFormFields";
import { useGetClassesQuery } from "@/services/api/classes.api";
import { useGetBooksQuery, useAddBookMutation } from "@/services/api/books.api";

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

  const [addBookMutation, { isLoading: isAdding }] = useAddBookMutation();

  const {
    data: books = [],
    isLoading: booksLoading,
    isError: booksError,
    error: booksQueryError,
    refetch: refetchBooks,
  } = useGetBooksQuery();

  // Some backends return a 404 with message "There are no book" when the list is empty.
  // Treat that specific case as an empty list so the UI can show the Add flow.
  const backendNoBooks = Boolean(
    booksError &&
      (String(booksQueryError?.data?.message || "").toLowerCase().includes("no book") ||
        String(booksQueryError?.error || "").toLowerCase().includes("no book"))
  );

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
    () => books.map((item) => ({ ...item })),
    [books]
  );

  const close = () => {
    setOpen(false);
    setEditing(null);
    setForm(EMPTY);
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.classId) {
      toast.error("Name and class are required");
      return;
    }

    if (editing) {
      toast.error("Editing books is not supported yet.");
      return;
    }

    const selectedClass = classes.find((item) => item.id === form.classId);
    if (!selectedClass) {
      toast.error("Selected class is not available.");
      return;
    }

    try {
      await addBookMutation({
        book_name: form.name.trim(),
        class_name: selectedClass.name,
        description: form.description.trim(),
        edition: form.edition.trim(),
      }).unwrap();
      toast.success("Book added");
      close();
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || "Failed to add book",
      );
    }
  };

  const autoOpenedRef = useRef(false);

  useEffect(() => {
    // If fetch finished and there are no books (including backend 'no book' 404), open modal once
    const isEmpty = !booksLoading && (books.length === 0 || backendNoBooks);
    if (isEmpty && !open && !autoOpenedRef.current) {
      setForm((f) => ({ ...EMPTY, classId: classes[0]?.id || "" }));
      setOpen(true);
      autoOpenedRef.current = true;
    }
  }, [booksLoading, books, backendNoBooks, classes, open]);

  if (booksLoading) {
    return (
      <EmptyState title="Loading books…" description="Fetching books from the API." />
    );
  }

  if (booksError && !backendNoBooks) {
    const message =
      booksQueryError?.data?.message ||
      booksQueryError?.error ||
      "Could not reach the books API. Is the backend running on port 5000?";
    return (
      <EmptyState
        title="Failed to load books"
        description={String(message)}
        action={<Button type="button" onClick={() => refetchBooks()}>Retry</Button>}
      />
    );
  }

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
          { key: "edition", label: "Edition" },
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
              loading={isAdding}
              disabled={getClassesLoading || classes.length === 0 || isAdding}
            >
              {editing ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}