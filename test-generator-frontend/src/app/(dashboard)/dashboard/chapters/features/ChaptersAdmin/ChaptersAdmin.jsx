"use client";

import { useMemo, useState } from "react";
import { deleteWithToast } from "../../../features/deleteWithToast";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import { AdminCrudPage } from "../../../features/AdminCrudPage";
import { AdminModal } from "../../../features/AdminModal";
import { Field, TextInput, TextSelect, TextTextarea } from "../../../features/AdminFormFields";
import { useGetBooksQuery } from "@/services/api/books.api";
import { useGetClassesQuery } from "@/services/api/classes.api";
import {
  useAddChapterMutation,
  useDeleteChapterMutation,
  useGetChaptersQuery,
  useUpdateChapterMutation,
} from "@/services/api/chapters.api";

const EMPTY = {
  name: "",
  classId: "",
  bookId: "",
  order: 1,
  description: "",
};

export function ChaptersAdmin() {
  const {
    data: apiChapters = [],
    isLoading: chaptersLoading,
    isError: chaptersError,
    refetch: refetchChapters,
  } = useGetChaptersQuery();
  const { data: apiBooks = [], isLoading: apiBooksLoading } = useGetBooksQuery();
  const { data: apiClasses = [], isLoading: apiClassesLoading } = useGetClassesQuery();
  const [addChapterMutation, { isLoading: adding }] = useAddChapterMutation();
  const [updateChapterMutation, { isLoading: updating }] = useUpdateChapterMutation();
  const [deleteChapterMutation] = useDeleteChapterMutation();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const booksForClass = useMemo(
    () => apiBooks.filter((book) => book.classId === form.classId),
    [apiBooks, form.classId],
  );

  const labels = useMemo(() => {
    const classMap = Object.fromEntries(apiClasses.map((c) => [c.id, c.name]));
    const bookMap = Object.fromEntries(apiBooks.map((b) => [b.id, b.name]));
    return { classMap, bookMap };
  }, [apiClasses, apiBooks]);

  const rows = useMemo(
    () =>
      [...apiChapters]
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
          onDelete: () =>
            deleteWithToast({
              entityLabel: "Chapter",
              entityName: item.name,
              onDelete: () => deleteChapterMutation(item.id).unwrap(),
            }),
        })),
    [apiChapters, deleteChapterMutation],
  );

  const close = () => {
    setOpen(false);
    setEditing(null);
    setForm(EMPTY);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.classId || !form.bookId) {
      toast.error("Name, class, and book are required");
      return;
    }

    const payload = {
      chapter_name: form.name.trim(),
      classId: form.classId,
      bookId: form.bookId,
      order: Number(form.order),
      description: form.description || "",
    };

    try {
      if (editing) {
        await updateChapterMutation({ id: editing.id, ...payload }).unwrap();
        toast.success("Chapter updated");
      } else {
        await addChapterMutation(payload).unwrap();
        toast.success("Chapter added");
      }
      close();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to save chapter");
    }
  };

  if (chaptersLoading) {
    return (
      <AdminCrudPage
        title="Manage Chapters"
        description="Organize chapters under each book for question banks."
        addLabel="Add chapter"
        onAdd={() => {}}
        hideAdd
        emptyAction={null}
        columns={[]}
        rows={[]}
        emptyTitle="Loading chapters..."
        emptyDescription="Fetching chapters from the database."
      />
    );
  }

  if (chaptersError) {
    return (
      <AdminCrudPage
        title="Manage Chapters"
        description="Organize chapters under each book for question banks."
        addLabel="Add chapter"
        onAdd={() => refetchChapters()}
        hideAdd
        emptyAction={
          <Button type="button" onClick={() => refetchChapters()}>
            Retry
          </Button>
        }
        columns={[]}
        rows={[]}
        emptyTitle="Failed to load chapters"
        emptyDescription="Could not reach the chapters API."
      />
    );
  }

  return (
    <>
      <AdminCrudPage
        title="Manage Chapters"
        description="Organize chapters under each book for question banks."
        addLabel="Add chapter"
        onAdd={() => {
          const firstClass = apiClasses[0];
          const firstBook = apiBooks.find((b) => b.classId === firstClass?.id);
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
                const nextBook = apiBooks.find((b) => b.classId === classId);
                setForm((f) => ({
                  ...f,
                  classId,
                  bookId: nextBook?.id || "",
                }));
              }}
              required
              disabled={apiClassesLoading}
            >
              <option value="">{apiClassesLoading ? "Loading classes..." : "Select class"}</option>
              {apiClasses.map((item) => (
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
              disabled={apiBooksLoading}
            >
              <option value="">{apiBooksLoading ? "Loading books..." : "Select book"}</option>
              {booksForClass.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </TextSelect>
          </Field>
          <Field label="Chapter No">
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
            <Button type="submit" loading={adding || updating} disabled={adding || updating}>
              {editing ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
