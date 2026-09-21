"use client";

import { useMemo, useState } from "react";
import { deleteWithToast } from "../../../features/deleteWithToast";
import toast from "react-hot-toast";
import { Button, EmptyState } from "@/components/ui";
import { AdminCrudPage } from "../../../features/AdminCrudPage";
import { AdminModal } from "../../../features/AdminModal";
import { Field, TextInput, TextSelect, TextTextarea } from "../../../features/AdminFormFields";
import { useGetClassesQuery } from "@/services/api/classes.api";
import {
  useGetBooksQuery,
  useGetDeletedBooksQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useRestoreBookMutation,
} from "@/services/api/books.api";

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
  const [updateBookMutation, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBookMutation] = useDeleteBookMutation();
  const [restoreBookMutation] = useRestoreBookMutation();
  const [showDeleted, setShowDeleted] = useState(false);

  const {
    data: books = [],
    isLoading: booksLoading,
    isError: booksError,
    error: booksQueryError,
    refetch: refetchBooks,
  } = useGetBooksQuery();

  // Deleting a book is a soft delete, so its chapters and questions survive
  // and it can be brought back from here.
  const { data: deletedBooks = [], isFetching: deletedLoading } =
    useGetDeletedBooksQuery(undefined, { skip: !showDeleted });

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
        onDelete: () =>
          deleteWithToast({
            entityLabel: "Book",
            entityName: item.name,
            confirmMessage: `Delete "${item.name}"? It is hidden from teachers along with its chapters and questions, and nothing is erased — you can bring it back from "Show deleted books".`,
            successMessage: "Book deleted — restore it any time from Show deleted books",
            onDelete: () => deleteBookMutation(item.id).unwrap(),
          }),
      })),
    [books, deleteBookMutation],
  );

  const deletedRows = useMemo(
    () =>
      deletedBooks.map((item) => ({
        ...item,
        onRestore: () =>
          restoreBookMutation(item.id)
            .unwrap()
            .then(() => toast.success(`"${item.name}" restored`))
            .catch((error) =>
              toast.error(
                error?.data?.message || error?.error || "Failed to restore book",
              ),
            ),
      })),
    [deletedBooks, restoreBookMutation],
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
      try {
        await updateBookMutation({
          id: editing.id,
          book_name: form.name.trim(),
          classId: form.classId,
          description: form.description.trim(),
          edition: form.edition.trim(),
        }).unwrap();
        toast.success("Book updated");
        close();
      } catch (error) {
        toast.error(
          error?.data?.message || error?.error || "Failed to update book",
        );
      }
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
        description="Attach books to classes and keep metadata up to date. A book name can be used once per class."
        addLabel="Add book"
        emptyTitle="No books yet"
        emptyDescription="Add a book and attach it to a class."
        onAdd={() => {
          setEditing(null);
          setForm({
            ...EMPTY,
            classId: classes[0]?.id || "",
          });
          setOpen(true);
        }}
        toolbar={
          <label className="inline-flex items-center gap-2 text-small text-neutral-600">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
            />
            Show deleted books
          </label>
        }
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
        footer={
          showDeleted ? (
            <section className="space-y-3">
              <div>
                <h2 className="text-h6 font-semibold text-neutral-900">
                  Deleted books
                </h2>
                <p className="mt-1 text-small text-neutral-600">
                  Hidden from teachers. Their chapters and questions are kept
                  and come back with the book.
                </p>
              </div>
              {deletedLoading ? (
                <p className="text-small text-neutral-500">Loading…</p>
              ) : deletedRows.length === 0 ? (
                <p className="text-small text-neutral-500">
                  No deleted books.
                </p>
              ) : (
                <ul className="divide-y divide-neutral-100 rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0">
                  {deletedRows.map((row) => (
                    <li
                      key={row.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                    >
                      <span className="min-w-0">
                        <span className="block text-small font-medium text-neutral-900">
                          {row.name}
                        </span>
                        <span className="block text-caption text-neutral-500">
                          {row.className || classNameById[row.classId] || "—"} ·{" "}
                          {row.chaptersCount} chapter
                          {row.chaptersCount === 1 ? "" : "s"}
                        </span>
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={row.onRestore}
                      >
                        Restore
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null
        }
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
              <p className="mt-1 text-small text-error-600">
                Failed to load classes.
              </p>
            )}
          </Field>

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
              loading={isAdding || isUpdating}
              disabled={getClassesLoading || classes.length === 0 || isAdding || isUpdating}
            >
              {editing ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
