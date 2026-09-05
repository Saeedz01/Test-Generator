"use client";

import { BannerCanvas } from "../BannerCanvas";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/utils";

export function PreviewModal({ doc, onClose, onExport }) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-neutral-950/90">
      <div className="flex items-center justify-end gap-2 p-3">
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          onClick={onExport}
        >
          Download PNG
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <div className="min-h-0 flex-1">
        <BannerCanvas
          doc={doc}
          selectedId={null}
          preview
          onSelect={() => {}}
          onPreviewElement={() => {}}
          onCommit={() => {}}
        />
      </div>
    </div>
  );
}
