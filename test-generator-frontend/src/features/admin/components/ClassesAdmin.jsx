"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import {
  addClass,
  deleteClass,
  selectAdminClasses,
  updateClass,
} from "@/store/adminContentSlice";
import { AdminCrudPage } from "./AdminCrudPage";
import { AdminModal } from "./AdminModal";
import { Field, TextInput, TextTextarea } from "./AdminFormFields";

const EMPTY = {
  name: "",
  code: "",
  description: "",
  academicYear: "2025–26",
};

export function ClassesAdmin() {
  const dispatch = useDispatch();
  const classes = useSelector(selectAdminClasses);
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
            name: item.name,
            code: item.code,
            description: item.description,
            academicYear: item.academicYear,
          });
          setOpen(true);
        },
        onDelete: () => {
          if (!window.confirm(`Delete class “${item.name}” and related content?`)) {
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

  const submit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (editing) {
      dispatch(updateClass({ id: editing.id, ...form }));
      toast.success("Class updated");
    } else {
      dispatch(addClass(form));
      toast.success("Class added");
    }
    close();
  };

  return (
    <>
      <AdminCrudPage
        title="Manage Classes"
        description="Create, update, or remove academic classes. Changes stay in the browser until the API is connected."
        addLabel="Add class"
        onAdd={() => {
          setEditing(null);
          setForm(EMPTY);
          setOpen(true);
        }}
        columns={[
          { key: "name", label: "Name" },
          { key: "code", label: "Code" },
          { key: "academicYear", label: "Year" },
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
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </Field>
          <Field label="Code">
            <TextInput
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            />
          </Field>
          <Field label="Academic year">
            <TextInput
              value={form.academicYear}
              onChange={(e) =>
                setForm((f) => ({ ...f, academicYear: e.target.value }))
              }
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
