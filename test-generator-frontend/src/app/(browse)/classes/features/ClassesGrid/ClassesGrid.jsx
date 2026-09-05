"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EmptyState, Heading } from "@/components/ui";
import { Breadcrumb, PageHeaderSkeleton } from "@/components/shared";
import { ROUTES } from "@/constants";
import { useGetClassesQuery } from "@/services/api/classes.api";
import { ClassCard } from "./ClassCard";

/**
 * Responsive grid of all academic classes.
 */
function ClassesGridContent() {
  const searchParams = useSearchParams();
  const startHere = searchParams.get("start") === "1";
  const {
    data: classes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetClassesQuery();

  if (isLoading) {
    return <PageHeaderSkeleton />;
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
      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.HOME },
          { label: "Classes" },
        ]}
      />
      <div className="max-w-2xl">
        <Heading level="h1">Classes</Heading>
        <p className="mt-2 text-body text-neutral-600">
          Choose a class to browse books, chapters, and build your test paper.
        </p>
      </div>

      {startHere ? (
        <div className="rounded-[var(--radius-md)] border border-primary-200 bg-primary-50 px-4 py-3">
          <p className="text-small font-semibold text-primary-800">Start here</p>
          <p className="mt-1 text-small text-primary-800/80">
            Pick your class, open a book, choose a chapter, then select
            questions to generate a printable paper.
          </p>
        </div>
      ) : null}

      {classes.length === 0 ? (
        <EmptyState
          title="No classes yet"
          description="Nothing is listed right now. Try another time, or ask your school to add classes."
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

export function ClassesGrid() {
  return (
    <Suspense fallback={<PageHeaderSkeleton />}>
      <ClassesGridContent />
    </Suspense>
  );
}
