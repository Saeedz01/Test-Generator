"use client";

import toast from "react-hot-toast";
import { requestConfirm } from "./ConfirmDialog/ConfirmDialog";

function getErrorMessage(error, fallback) {
  return error?.data?.message || error?.error || fallback;
}

/**
 * Shows a confirm dialog before running an async delete.
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

  requestConfirm({
    title: `Delete ${entityLabel.toLowerCase()}?`,
    message,
    confirmLabel: "Delete",
    onConfirm: async () => {
      const loadingId = toast.loading(`Deleting ${entityLabel.toLowerCase()}...`);
      try {
        await onDelete();
        toast.success(successMessage || `${entityLabel} deleted`, {
          id: loadingId,
        });
      } catch (error) {
        toast.error(
          getErrorMessage(error, `Failed to delete ${entityLabel.toLowerCase()}`),
          { id: loadingId },
        );
        throw error;
      }
    },
  });
}
