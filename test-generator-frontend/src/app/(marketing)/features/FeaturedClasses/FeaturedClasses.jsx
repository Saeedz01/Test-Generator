"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Card, Container, EmptyState, Typography } from "@/components/ui";
import { ROUTES } from "@/constants";
import { useGetClassesQuery } from "@/services/api/classes.api";

/**
 * Featured academic tracks / classes grid.
 */
export function FeaturedClasses() {
  const {
    data: classes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetClassesQuery();

  return (
    <section className="relative z-10 -mt-2 bg-neutral-0 pb-6 pt-4 sm:pb-10">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <Typography variant="h2">Featured Classes</Typography>
          <Typography variant="body" className="mt-3 text-neutral-600">
            Start from your grade or group — each path includes curated books
            and chapter banks ready for test generation.
          </Typography>
        </div>

        {isLoading ? (
          <EmptyState
            title="Loading classes..."
            description="Fetching featured classes from the database."
          />
        ) : null}

        {isError ? (
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
        ) : null}

        {!isLoading && !isError ? (
          classes.length === 0 ? (
            <EmptyState
              title="No classes yet"
              description="Add classes from the admin dashboard to populate this section."
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {classes.map((item) => (
                <li key={item.id} className="min-w-0">
                  <Link
                    href={ROUTES.classBooks(item.id)}
                    className="group block h-full rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    <Card
                      hoverable
                      className="h-full cursor-pointer border-neutral-200 transition-[border-color,transform,box-shadow] duration-200 group-hover:-translate-y-px group-hover:border-primary-300"
                    >
                      <div className="mb-4 flex size-11 items-center justify-center rounded-[var(--radius-lg)] bg-primary-50 text-primary-700 transition-colors duration-200 group-hover:bg-primary-100">
                        <GraduationCap className="size-5" aria-hidden="true" />
                      </div>
                      <Typography variant="h4" as="h3">
                        {item.name}
                      </Typography>
                      <Typography variant="bodySmall" className="mt-1 text-neutral-500">
                        {item.description || item.code}
                      </Typography>
                      <Typography variant="caption" className="mt-4 font-medium text-primary-700">
                        {item.booksCount}{" "}
                        {item.booksCount === 1 ? "book" : "books"}
                      </Typography>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          )
        ) : null}
      </Container>
    </section>
  );
}
