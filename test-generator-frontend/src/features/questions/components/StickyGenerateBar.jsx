"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui";
import { ROUTES } from "@/constants";
import { useSelector } from "react-redux";
import {
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
  const disabled = count === 0;

  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-neutral-200 bg-neutral-0/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-t-[var(--radius-card)] lg:border lg:border-b-0 lg:border-neutral-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-small font-semibold text-neutral-900">
            {count} selected · {marks} marks
          </p>
          <p className="text-caption text-neutral-500">
            Review your paper, then generate a printable PDF.
          </p>
        </div>
        {disabled ? (
          <span
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "opacity-45",
            )}
            aria-disabled="true"
          >
            Generate Test
          </span>
        ) : (
          <Link
            href={ROUTES.TEST_SUMMARY}
            className={cn(buttonVariants({ variant: "primary", size: "md" }))}
          >
            Generate Test
          </Link>
        )}
      </div>
    </div>
  );
}
