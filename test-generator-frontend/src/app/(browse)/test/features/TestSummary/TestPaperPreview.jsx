"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui";

/**
 * In-page HTML preview of the printable paper, before window.print.
 */
export function TestPaperPreview({ html, onPrint, onDismiss }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !html) return undefined;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframe.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [html]);

  if (!html) return null;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-h5 font-semibold text-neutral-900">Paper preview</h2>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={onDismiss}
          >
            Hide preview
          </Button>
          <Button
            type="button"
            size="sm"
            className="w-full sm:w-auto"
            onClick={onPrint}
          >
            Print PDF
          </Button>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        title="Test paper preview"
        className="h-[min(70vh,40rem)] w-full rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0"
      />
    </section>
  );
}
