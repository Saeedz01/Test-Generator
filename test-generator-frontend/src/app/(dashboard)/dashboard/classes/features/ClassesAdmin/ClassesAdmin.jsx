"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button, EmptyState } from "@/components/ui";
import { AdminCrudPage } from "../../../features/AdminCrudPage";
import { AdminModal } from "../../../features/AdminModal";
import { Field, TextInput, TextTextarea } from "../../../features/AdminFormFields";
import {
  useAddClassMutation,
  useGetClassesQuery,
} from "@/services/api/classes.api";

const EMPTY = {
  name: "",
  nameUr: "",
  code: "",
  description: "",
  descriptionUr: "",
};

export function ClassesAdmin() {
  const [addClassMutation, { isLoading }] = useAddClassMutation();
  const {
    data: classes = [],
    isLoading: classesLoading,
    isError: classesError,
    error: classesQueryError,
    refetch,
  } = useGetClassesQuery();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const rows = useMemo(() => classes.map((item) => ({ ...item })), [classes]);

  const close = () => {
    setOpen(false);
    setForm(EMPTY);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.code.trim()) {
      toast.error("Code is required");
      return;
    }

    try {
      await addClassMutation({
        name: form.name.trim(),
        nameUr: form.nameUr.trim() || undefined,
        code: form.code.trim(),
        description: form.description.trim(),
        descriptionUr: form.descriptionUr.trim() || undefined,
      }).unwrap();
      toast.success("Class added");
      close();
    } catch (error) {
      toast.error(
        error?.data?.message || error?.error || "Failed to add class",
      );
    }
  };

  if (classesLoading) {
    return (
      <EmptyState
        title="Loading classes…"
        description="Fetching classes from the API."
      />
    );
  }

  if (classesError) {
    const message =
      classesQueryError?.data?.message ||
      classesQueryError?.error ||
      "Could not reach the classes API. Is the backend running on port 5000?";
    return (
      <EmptyState
        title="Failed to load classes"
        description={String(message)}
        action={
          <Button type="button" onClick={() => refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <>
      <AdminCrudPage
        title="Manage Classes"
        description="Create academic classes. Editing and deleting will appear here when those APIs are wired."
        addLabel="Add class"
        emptyTitle="No classes yet"
        emptyDescription="Add your first class to start the library."
        onAdd={() => {
          setForm(EMPTY);
          setOpen(true);
        }}
        columns={[
          { key: "name", label: "Name" },
          { key: "code", label: "Code" },
          {
            key: "description",
            label: "Description",
            render: (row) => (
              <span className="line-clamp-2 max-w-xs text-neutral-600">
                {row.description || "—"}
              </span>
            ),
          },
        ]}
        rows={rows}
      />

      <AdminModal open={open} title="Add class" onClose={close}>
        <form className="space-y-4" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name (English)">
              <TextInput
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </Field>
            <Field label="Name (Urdu)">
              <TextInput
                value={form.nameUr}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nameUr: e.target.value }))
                }
                dir="rtl"
              />
            </Field>
          </div>
          <Field label="Code">
            <TextInput
              value={form.code}
              onChange={(e) =>
                setForm((f) => ({ ...f, code: e.target.value }))
              }
              required
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Description (English)">
              <TextTextarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </Field>
            <Field label="Description (Urdu)">
              <TextTextarea
                value={form.descriptionUr}
                onChange={(e) =>
                  setForm((f) => ({ ...f, descriptionUr: e.target.value }))
                }
                dir="rtl"
              />
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Create
            </Button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
