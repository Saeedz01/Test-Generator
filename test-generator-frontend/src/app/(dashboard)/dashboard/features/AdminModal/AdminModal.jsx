"use client";

import { useEffect } from "react";
import { cn } from "@/utils";

/**
 * Lightweight modal dialog for admin forms / confirmations.
 */
export function AdminModal({ open, title, onClose, children, className }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-neutral-900/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative z-10 w-full max-w-lg rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-5 shadow-md sm:p-6",
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-h5 font-semibold text-neutral-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-small font-medium text-neutral-500 transition-colors hover:text-neutral-800"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
