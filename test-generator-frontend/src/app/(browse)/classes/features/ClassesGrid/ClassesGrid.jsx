"use client";

import { EmptyState, Heading } from "@/components/ui";
import { useGetClassesQuery } from "@/services/api/classes.api";
import { ClassCard } from "./ClassCard";

/**
 * Responsive grid of all academic classes.
 */
export function ClassesGrid() {
  const {
    data: classes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetClassesQuery();

  if (isLoading) {
    return (
      <EmptyState
        title="Loading classes..."
        description="Fetching classes from the database."
      />
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Could not load classes"
        description={
          error?.data?.message ||
          error?.error ||
          "Check that the backend is running, then try again."
        }
        action={
          <button
            type="button"
            className="text-small font-semibold text-primary-700"
            onClick={() => refetch()}
          >
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <Heading level="h1">Classes</Heading>
        <p className="mt-2 text-body text-neutral-600">
          Choose a class to browse books, chapters, and build your test paper.
        </p>
      </div>

      {classes.length === 0 ? (
        <EmptyState
          title="No classes yet"
          description="Add classes from the admin dashboard to get started."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {classes.map((schoolClass) => (
            <li key={schoolClass.id}>
              <ClassCard schoolClass={schoolClass} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
