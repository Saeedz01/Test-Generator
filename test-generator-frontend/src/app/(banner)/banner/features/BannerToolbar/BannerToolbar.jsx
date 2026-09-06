"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Eye,
  FolderClock,
  Redo2,
  Save,
  Undo2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui";
import { ROUTES } from "@/constants";
import { cn } from "@/utils";
import { BANNER_FORMATS } from "../bannerFormats";

export function BannerToolbar({
  canUndo,
  canRedo,
  formatId,
  onUndo,
  onRedo,
  onFormat,
  onPreview,
  onSave,
  onExport,
  onApplyLastStyle,
  canApplyLastStyle,
  onOpenLeft,
  onOpenRight,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 bg-neutral-0 px-2 py-2 sm:px-3">
      <Link
        href={ROUTES.BANNER}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
      >
        <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Templates</span>
      </Link>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Undo"
      >
        <Undo2 className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        onClick={onRedo}
        disabled={!canRedo}
        aria-label="Redo"
      >
        <Redo2 className="size-4" aria-hidden="true" />
      </button>
      <label className="flex min-w-0 flex-1 items-center gap-2 text-caption text-neutral-600 sm:max-w-56 sm:flex-none">
        <span className="hidden sm:inline">Size</span>
        <select
          aria-label="Banner size"
          className="h-8 min-w-0 flex-1 rounded-[var(--radius-input)] border border-neutral-300 bg-neutral-0 px-2 text-caption text-neutral-900"
          value={formatId}
          onChange={(event) => onFormat(event.target.value)}
        >
          {BANNER_FORMATS.map((format) => (
            <option key={format.id} value={format.id}>
              {format.label}
            </option>
          ))}
        </select>
      </label>
      <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:ml-auto sm:w-auto">
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "lg:hidden",
          )}
          onClick={onOpenLeft}
        >
          Add
        </button>
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "lg:hidden",
          )}
          onClick={onOpenRight}
        >
          Edit
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          onClick={onApplyLastStyle}
          disabled={!canApplyLastStyle}
        >
          <FolderClock className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Last settings</span>
          <span className="sm:hidden">Last</span>
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          onClick={onPreview}
        >
          <Eye className="size-4 shrink-0" aria-hidden="true" />
          Preview
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          onClick={onSave}
        >
          <Save className="size-4" aria-hidden="true" />
          Save
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
          onClick={onExport}
        >
          <Download className="size-4" aria-hidden="true" />
          Export
        </button>
      </div>
    </div>
  );
}
