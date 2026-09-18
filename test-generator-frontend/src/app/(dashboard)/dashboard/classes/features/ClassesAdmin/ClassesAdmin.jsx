"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button, EmptyState } from "@/components/ui";
import { deleteWithToast } from "../../../features/deleteWithToast";
import { AdminCrudPage } from "../../../features/AdminCrudPage";
import { AdminModal } from "../../../features/AdminModal";
import { Field, TextInput, TextTextarea } from "../../../features/AdminFormFields";
import {
  useAddClassMutation,
  useArchiveClassMutation,
  useDeleteClassMutation,
  useGetClassesQuery,
  useUnarchiveClassMutation,
  useUpdateClassMutation,
} from "@/services/api/classes.api";
import { selectIsSuperAdmin } from "@/store/authSlice";

const EMPTY = {
  name: "",
  code: "",
  description: "",
};

export function ClassesAdmin() {
  const [addClassMutation, { isLoading: isAdding }] = useAddClassMutation();
  const [updateClassMutation, { isLoading: isUpdating }] =
    useUpdateClassMutation();
  const [deleteClassMutation] = useDeleteClassMutation();
  const [archiveClassMutation] = useArchiveClassMutation();
  const [unarchiveClassMutation] = useUnarchiveClassMutation();
  const [showArchived, setShowArchived] = useState(false);
  // Deleting a class cascades to its books/chapters/questions; the API only
  // allows super admins (others get 403), so only they see the action.
  const canDelete = useSelector(selectIsSuperAdmin);

  const {
    data: classes = [],
    isLoading: classesLoading,
    isError: classesError,
    error: classesQueryError,
    refetch,
  } = useGetClassesQuery(showArchived);

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
        onDelete: canDelete
          ? () =>
              deleteWithToast({
                entityLabel: "Class",
                entityName: item.name,
                onDelete: () => deleteClassMutation(item.id).unwrap(),
              })
          : undefined,
        onArchive: () => {
          const run = item.isArchived
            ? () => unarchiveClassMutation(item.id).unwrap()
            : () => archiveClassMutation(item.id).unwrap();
          run()
            .then(() =>
              toast.success(
                item.isArchived ? "Class restored" : "Class archived",
              ),
            )
            .catch((error) =>
              toast.error(
                error?.data?.message ||
                  error?.error ||
                  "Failed to update archive state",
              ),
            );
        },
      })),
    [
      classes,
      canDelete,
      deleteClassMutation,
      archiveClassMutation,
      unarchiveClassMutation,
    ],
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

    const payload = {
      name: form.name.trim(),
      code: form.code.trim(),
      description: form.description.trim(),
    };

    try {
      if (editing) {
        await updateClassMutation({ id: editing.id, ...payload }).unwrap();
        toast.success("Class updated");
      } else {
        await addClassMutation(payload).unwrap();
        toast.success("Class added");
      }
      close();
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          (editing ? "Failed to update class" : "Failed to add class"),
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
        description="Create, edit, archive, or delete academic classes."
        addLabel="Add class"
        emptyTitle="No classes yet"
        emptyDescription="Add your first class to start the library."
        onAdd={() => {
          setEditing(null);
          setForm(EMPTY);
          setOpen(true);
        }}
        toolbar={
          <label className="inline-flex items-center gap-2 text-small text-neutral-600">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            Show archived
          </label>
        }
        columns={[
          { key: "name", label: "Name" },
          { key: "code", label: "Code" },
          {
            key: "isArchived",
            label: "Status",
            render: (row) => (row.isArchived ? "Archived" : "Active"),
          },
          {
            key: "description",
            label: "Description",
            render: (row) => (
              <span className="line-clamp-2 max-w-xs text-neutral-600">
                {row.description || "—"}
              </span>
            ),
          },
          {
            key: "archiveAction",
            label: "Archive",
            render: (row) => (
              <button
                type="button"
                className="text-small font-medium text-primary-700 hover:underline"
                onClick={row.onArchive}
              >
                {row.isArchived ? "Restore" : "Archive"}
              </button>
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
              disabled={isAdding || isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isAdding || isUpdating}>
              {editing ? "Save changes" : "Create"}
            </Button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
