import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";

/**
 * Server-side page controls for the question bank table.
 */
export function QuestionsPagination({ page, totalPages, isFetching, onPageChange }) {
  if (totalPages <= 1 && page <= 1) return null;

  return (
    <nav
      aria-label="Question pages"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-caption text-neutral-500" aria-live="polite">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1 || isFetching}
          onClick={() => onPageChange(Math.min(page - 1, totalPages))}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages || isFetching}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
