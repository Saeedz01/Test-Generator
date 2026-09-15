"use client";

import { useState } from "react";
import { Download, Share, X } from "lucide-react";
import { Typography } from "@/components/ui";
import { BRAND_NAME } from "@/constants";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { cn } from "@/utils";

function InstallHelpPanel({ isIos, onClose }) {
  return (
    <div className="mt-2 w-[min(100vw-1.5rem,18rem)] rounded-[var(--radius-md)] border border-neutral-200 bg-neutral-0 px-3 py-3 shadow-md">
      <div className="mb-2 flex items-start justify-between gap-2">
        <Typography variant="label" className="text-neutral-800">
          {isIos ? "Install on iPhone / iPad" : `Add ${BRAND_NAME}`}
        </Typography>
        <button
          type="button"
          aria-label="Close install help"
          className="inline-flex size-7 items-center justify-center rounded-[var(--radius-sm)] text-neutral-500 hover:bg-neutral-100"
          onClick={onClose}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      {isIos ? (
        <ol className="space-y-2 text-caption leading-relaxed text-neutral-600">
          <li className="flex gap-2">
            <span className="font-semibold text-neutral-800">1.</span>
            <span>
              Tap the Share button
              <Share
                className="mx-1 inline size-3.5 align-text-bottom text-primary-700"
                aria-hidden="true"
              />
              in Safari.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-neutral-800">2.</span>
            <span>Scroll and choose “Add to Home Screen”.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-neutral-800">3.</span>
            <span>Confirm to add {BRAND_NAME}.</span>
          </li>
        </ol>
      ) : (
        <p className="text-caption leading-relaxed text-neutral-600">
          When your browser offers it, use{" "}
          <span className="font-medium text-neutral-800">Install app</span> or{" "}
          <span className="font-medium text-neutral-800">Add to Home screen</span>{" "}
          from the browser menu. On Android Chrome this can also appear as a
          system install prompt.
        </p>
      )}
      {isIos ? (
        <p className="mt-2 text-caption text-neutral-500">
          Safari does not allow apps to install automatically on iOS.
        </p>
      ) : null}
    </div>
  );
}

/**
 * Mobile Install / Add to Home Screen CTA.
 * - `menu`: full-width row for the mobile drawer
 * - `sticky`: compact floating control for hero pages (fixed on scroll)
 */
export function InstallTestora({
  className,
  onInstalled,
  variant = "menu",
}) {
  const {
    canShowInstall,
    canNativeInstall,
    canShowIosHelp,
    isIos,
    promptInstall,
  } = usePwaInstall();
  const [showHelp, setShowHelp] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!canShowInstall) {
    return null;
  }

  const label = canNativeInstall
    ? `Install ${BRAND_NAME}`
    : `Add ${BRAND_NAME} to Home Screen`;

  const onClick = async () => {
    if (canNativeInstall) {
      setBusy(true);
      try {
        const result = await promptInstall();
        if (result.ok && result.outcome === "accepted") {
          onInstalled?.();
        }
      } finally {
        setBusy(false);
      }
      return;
    }

    setShowHelp((open) => !open);
  };

  if (variant === "sticky") {
    return (
      <div
        className={cn(
          "pointer-events-none fixed top-[calc(4rem+0.75rem)] right-3 z-30 lg:hidden",
          className,
        )}
      >
        <div className="pointer-events-auto flex flex-col items-end">
          <button
            type="button"
            onClick={onClick}
            disabled={busy}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-primary-200",
              "bg-neutral-0 px-3 py-2 text-caption font-semibold text-primary-800 shadow-md",
              "hover:bg-primary-50 disabled:opacity-60",
            )}
          >
            <Download className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="max-w-[9.5rem] truncate sm:max-w-none">
              {canNativeInstall ? `Install ${BRAND_NAME}` : "Install"}
            </span>
          </button>
          {showHelp ? (
            <InstallHelpPanel
              isIos={canShowIosHelp || isIos}
              onClose={() => setShowHelp(false)}
            />
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2.5 text-left text-small font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-60"
      >
        <Download
          className="size-4 shrink-0 text-primary-700"
          aria-hidden="true"
        />
        <span>{label}</span>
      </button>

      {showHelp ? (
        <InstallHelpPanel
          isIos={canShowIosHelp || isIos}
          onClose={() => setShowHelp(false)}
        />
      ) : null}
    </div>
  );
}
