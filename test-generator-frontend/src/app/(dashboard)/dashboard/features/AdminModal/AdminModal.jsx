"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils";

/**
 * Lightweight modal dialog for admin forms / confirmations.
 * Closes only via the top-right close button — not backdrop or Escape.
 */
export function AdminModal({ open, title, onClose, children, className }) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/40 p-4 sm:p-6"
      aria-hidden={false}
    >
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            "relative my-auto flex w-full max-h-[calc(100dvh-2rem)] max-w-lg flex-col overflow-hidden rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 shadow-md",
            className,
          )}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-neutral-200 px-5 py-4 sm:px-6">
            <h2 className="text-h5 font-semibold text-neutral-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
