"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui";
import { ROUTES } from "@/constants";
import { useSelector } from "react-redux";
import {
  selectSelectedChapterCount,
  selectSelectedQuestionCount,
  selectTotalMarks,
} from "@/store/selectionSlice";
import { cn } from "@/utils";

/**
 * Sticky footer CTA for generating a test from selections.
 */
export function StickyGenerateBar() {
  const count = useSelector(selectSelectedQuestionCount);
  const marks = useSelector(selectTotalMarks);
  const chapterCount = useSelector(selectSelectedChapterCount);
  const disabled = count === 0;
  const mixedChapters = chapterCount > 1;

  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-neutral-200 bg-neutral-0 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-t-[var(--radius-card)] lg:border lg:border-b-0 lg:border-neutral-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-small font-semibold text-neutral-900">
            {count} selected · {marks} bank marks
            {mixedChapters ? ` · ${chapterCount} chapters` : ""}
          </p>
          <p className="text-caption text-neutral-500">
            {disabled
              ? "Select at least one question to generate a paper."
              : mixedChapters
                ? "This paper mixes questions from more than one chapter."
                : "Review your paper, then generate a printable PDF."}
          </p>
        </div>
        {disabled ? (
          <span
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "w-full opacity-45 sm:w-auto",
            )}
            aria-disabled="true"
            title="Select at least one question"
          >
            Generate Test
          </span>
        ) : (
          <Link
            href={ROUTES.TEST_SUMMARY}
            className={cn(buttonVariants({ variant: "primary", size: "md" }), "w-full sm:w-auto")}
          >
            Generate Test
          </Link>
        )}
      </div>
    </div>
  );
}
