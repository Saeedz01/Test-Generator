"use client";

import toast from "react-hot-toast";
import { Button } from "@/components/ui";

function DeleteConfirmToast({
  toastId,
  message,
  entityLabel,
  onConfirm,
}) {
  return (
    <div
      className="pointer-events-auto w-[min(100vw-2rem,22rem)] rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-4 shadow-lg"
      role="alertdialog"
      aria-labelledby={`delete-title-${toastId}`}
      aria-describedby={`delete-desc-${toastId}`}
    >
      <p
        id={`delete-title-${toastId}`}
        className="text-small font-semibold text-neutral-900"
      >
        Delete {entityLabel.toLowerCase()}?
      </p>
      <p id={`delete-desc-${toastId}`} className="mt-1 text-small text-neutral-600">
        {message}
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => toast.dismiss(toastId)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

function getErrorMessage(error, fallback) {
  return error?.data?.message || error?.error || fallback;
}

/**
 * Shows a toast confirmation before running an async delete.
 */
export function deleteWithToast({
  entityLabel,
  entityName,
  confirmMessage,
  successMessage,
  onDelete,
}) {
  const message =
    confirmMessage ||
    `Delete ${entityLabel.toLowerCase()} "${entityName}"? This cannot be undone.`;

  toast.custom(
    (t) => (
      <DeleteConfirmToast
        toastId={t.id}
        message={message}
        entityLabel={entityLabel}
        onConfirm={async () => {
          toast.dismiss(t.id);
          const loadingId = toast.loading(`Deleting ${entityLabel.toLowerCase()}...`);

          try {
            await onDelete();
            toast.success(successMessage || `${entityLabel} deleted`, { id: loadingId });
          } catch (error) {
            toast.error(
              getErrorMessage(error, `Failed to delete ${entityLabel.toLowerCase()}`),
              { id: loadingId },
            );
          }
        }}
      />
    ),
    { duration: Infinity },
  );
}
