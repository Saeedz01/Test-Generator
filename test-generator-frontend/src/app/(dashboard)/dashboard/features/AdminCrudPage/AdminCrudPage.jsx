"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Card, EmptyState, Heading } from "@/components/ui";

/**
 * Reusable admin list + actions shell.
 */
export function AdminCrudPage({
  title,
  description,
  onAdd,
  addLabel = "Add new",
  columns,
  rows,
  toolbar,
  emptyTitle = "No items yet",
  emptyDescription = "Add your first item to get started.",
  emptyAction,
  hideAdd = false,
}) {
  const showActions = rows.some(
    (row) => typeof row.onEdit === "function" || typeof row.onDelete === "function",
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <Heading level="h1">{title}</Heading>
          {description ? (
            <p className="mt-2 text-body text-neutral-600">{description}</p>
          ) : null}
        </div>
        {hideAdd ? null : (
          <Button type="button" onClick={onAdd}>
            <Plus className="size-4" aria-hidden="true" />
            {addLabel}
          </Button>
        )}
      </div>

      {toolbar ? <div>{toolbar}</div> : null}

      {rows.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={
            emptyAction === null
              ? undefined
              : (emptyAction ?? (
                  <Button type="button" onClick={onAdd}>
                    <Plus className="size-4" aria-hidden="true" />
                    {addLabel}
                  </Button>
                ))
          }
        />
      ) : (
        <Card padded={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-small">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-caption font-semibold tracking-wide text-neutral-500 uppercase">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} className="px-4 py-3 font-semibold">
                      {column.label}
                    </th>
                  ))}
                  {showActions ? (
                    <th className="px-4 py-3 text-right font-semibold">
                      Actions
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="align-top transition-colors hover:bg-neutral-50/80"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-neutral-800">
                        {column.render
                          ? column.render(row)
                          : row[column.key] ?? "—"}
                      </td>
                    ))}
                    {showActions ? (
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {typeof row.onEdit === "function" ? (
                            <button
                              type="button"
                              onClick={() => row.onEdit(row)}
                              className="inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary-700"
                              aria-label={`Edit ${row.id}`}
                            >
                              <Pencil className="size-4" />
                            </button>
                          ) : null}
                          {typeof row.onDelete === "function" ? (
                            <button
                              type="button"
                              onClick={() => row.onDelete(row)}
                              className="inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-neutral-600 transition-colors hover:bg-error-50 hover:text-error-700"
                              aria-label={`Delete ${row.id}`}
                            >
                              <Trash2 className="size-4" />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
