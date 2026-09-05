"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Badge, Button, Card, EmptyState, Heading } from "@/components/ui";
import { ROUTES } from "@/constants";
import {
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useGetAdminsQuery,
  useSuspendAdminMutation,
} from "@/services/api/auth.api";
import { selectAuthUser } from "@/store/authSlice";
import { deleteWithToast } from "../../../features/deleteWithToast";
import { AdminModal } from "../../../features/AdminModal";
import { Field, TextInput } from "../../../features/AdminFormFields";

const EMPTY = { email: "", password: "", name: "" };

export function AdminsAdmin() {
  const router = useRouter();
  const currentUser = useSelector(selectAuthUser);
  const { data: admins = [], isLoading, isError, error, refetch } =
    useGetAdminsQuery(undefined, {
      skip: currentUser?.role !== "super_admin",
    });
  const [createAdmin, { isLoading: creating }] = useCreateAdminMutation();
  const [suspendAdmin] = useSuspendAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (currentUser && currentUser.role !== "super_admin") {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [currentUser, router]);

  if (currentUser?.role !== "super_admin") {
    return (
      <EmptyState
        title="Access denied"
        description="Only super admins can manage admin accounts."
      />
    );
  }

  if (isLoading) {
    return (
      <EmptyState
        title="Loading admins..."
        description="Fetching admin accounts from the database."
      />
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Could not load admins"
        description={error?.data?.message || error?.error || "Backend unavailable."}
        action={<Button type="button" onClick={() => refetch()}>Retry</Button>}
      />
    );
  }

  const close = () => {
    setOpen(false);
    setForm(EMPTY);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    try {
      await createAdmin({
        email: form.email.trim(),
        password: form.password.trim(),
        name: form.name.trim() || undefined,
      }).unwrap();
      toast.success("Admin created");
      close();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to create admin");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <Heading level="h1">Manage Admins</Heading>
            <p className="mt-2 text-body text-neutral-600">
              Create, suspend, or remove admin accounts for the platform.
            </p>
          </div>
          <Button type="button" onClick={() => setOpen(true)}>
            Add admin
          </Button>
        </div>

        {admins.length === 0 ? (
          <EmptyState
            title="No admins yet"
            description="Add your first admin account to delegate dashboard access."
            action={
              <Button type="button" onClick={() => setOpen(true)}>
                Add admin
              </Button>
            }
          />
        ) : (
          <Card padded={false} className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-small">
                <thead className="border-b border-neutral-200 bg-neutral-50 text-caption font-semibold tracking-wide text-neutral-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-neutral-50/80">
                      <td className="px-4 py-3">{admin.name}</td>
                      <td className="px-4 py-3">{admin.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={admin.isSuspended ? "outline" : "primary"}>
                          {admin.isSuspended ? "Suspended" : "Active"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={admin.isSuspended ? "primary" : "outline"}
                            onClick={async () => {
                              try {
                                await suspendAdmin(admin.id).unwrap();
                                toast.success(
                                  admin.isSuspended
                                    ? "Admin reactivated"
                                    : "Admin suspended",
                                );
                              } catch (err) {
                                toast.error(
                                  err?.data?.message ||
                                    err?.error ||
                                    "Failed to update admin",
                                );
                              }
                            }}
                          >
                            {admin.isSuspended ? "Reactivate" : "Suspend"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              deleteWithToast({
                                entityLabel: "Admin",
                                entityName: admin.email,
                                onDelete: () => deleteAdmin(admin.id).unwrap(),
                              })
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <AdminModal open={open} title="Add admin" onClose={close}>
        <form className="space-y-4" onSubmit={submit}>
          <Field label="Name">
            <TextInput
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Optional display name"
            />
          </Field>
          <Field label="Email">
            <TextInput
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </Field>
          <Field label="Password">
            <TextInput
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" loading={creating} disabled={creating}>
              Create admin
            </Button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
