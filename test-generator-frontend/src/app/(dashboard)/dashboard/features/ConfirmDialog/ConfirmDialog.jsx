"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui";

let openConfirm = null;

/**
 * Opens the dashboard confirm dialog. Requires ConfirmHost to be mounted.
 */
export function requestConfirm(config) {
  openConfirm?.(config);
}

/**
 * Small confirm dialog host (replaces infinite toasts for deletes).
 */
export function ConfirmHost() {
  const [config, setConfig] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    openConfirm = (next) => {
      setBusy(false);
      setConfig(next);
    };
    return () => {
      openConfirm = null;
    };
  }, []);

  useEffect(() => {
    if (!config) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape" && !busy) setConfig(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [config, busy]);

  if (!config || typeof document === "undefined") return null;

  const close = () => {
    if (!busy) setConfig(null);
  };

  const confirm = async () => {
    setBusy(true);
    try {
      await config.onConfirm?.();
      setConfig(null);
    } catch {
      setBusy(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-neutral-900/40"
        onClick={close}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="relative z-10 w-full max-w-md rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-5 shadow-md"
      >
        <h2
          id="confirm-dialog-title"
          className="text-h5 font-semibold text-neutral-900"
        >
          {config.title}
        </h2>
        <p id="confirm-dialog-desc" className="mt-2 text-small text-neutral-600">
          {config.message}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={close} disabled={busy}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={confirm}
            loading={busy}
          >
            {config.confirmLabel || "Delete"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
