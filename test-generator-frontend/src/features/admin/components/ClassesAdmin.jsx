"use client";

import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Button, EmptyState } from "@/components/ui";
import { deleteClass, updateClass } from "@/store/adminContentSlice";
import { AdminCrudPage } from "./AdminCrudPage";
import { AdminModal } from "./AdminModal";
import { Field, TextInput, TextTextarea } from "./AdminFormFields";
import {
  useAddClassMutation,
  useGetClassesQuery,
} from "@/services/api/classes.api";

const EMPTY = {
  name: "",
  code: "",
  description: "",
};

export function ClassesAdmin() {
  const [addClassMutation, { isLoading }] = useAddClassMutation();
  const dispatch = useDispatch();
  const {
    data: classes = [],
    isLoading: classesLoading,
    isError: classesError,
    error: classesQueryError,
    refetch,
  } = useGetClassesQuery();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const rows = useMemo(
    () =>
      classes.map((item) => ({
        ...item,
        onEdit: () => {
          setEditing(item);
          setForm({
            name: item.name || "",
            code: item.code || "",
            description: item.description || "",
          });
          setOpen(true);
        },
        onDelete: () => {
          if (
            !window.confirm(
              `Delete class “${item.name}” and related content?`,
            )
          ) {
            return;
          }
          dispatch(deleteClass(item.id));
          toast.success("Class deleted");
        },
      })),
    [classes, dispatch],
  );

  const close = () => {
    setOpen(false);
    setEditing(null);
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

    if (editing) {
      dispatch(updateClass({ id: editing.id, ...form }));
      toast.success("Class updated");
      close();
      return;
    }

    try {
      await addClassMutation({
        name: form.name.trim(),
        code: form.code.trim(),
        description: form.description.trim(),
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
        description="Create, update, or remove academic classes."
        addLabel="Add class"
        onAdd={() => {
          setEditing(null);
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

      <AdminModal
        open={open}
        title={editing ? "Edit class" : "Add class"}
        onClose={close}
      >
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Name">
            <TextInput
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              required
            />
          </Field>
          <Field label="Code">
            <TextInput
              value={form.code}
              onChange={(e) =>
                setForm((f) => ({ ...f, code: e.target.value }))
              }
              required
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
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {editing ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
