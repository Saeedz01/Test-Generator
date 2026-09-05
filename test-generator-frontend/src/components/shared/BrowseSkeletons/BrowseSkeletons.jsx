import { Skeleton } from "@/components/ui";

/**
 * Loading placeholders for teacher browse grids and question lists.
 */
export function CardGridSkeleton({ count = 6 }) {
  return (
    <ul
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className="rounded-[var(--radius-card)] border border-neutral-200 bg-neutral-0 p-6"
        >
          <Skeleton className="mb-4 size-11" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-4 h-3 w-1/3" />
        </li>
      ))}
    </ul>
  );
}

export function QuestionListSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading questions">
      <div className="max-w-3xl space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading">
      <div className="max-w-2xl space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <CardGridSkeleton />
    </div>
  );
}
