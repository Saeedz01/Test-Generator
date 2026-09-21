"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Card, Container, EmptyState, Typography } from "@/components/ui";
import { CardGridSkeleton } from "@/components/shared";
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
    <section
      id="featured-classes"
      className="relative z-10 -mt-2 scroll-mt-20 bg-neutral-0 pb-6 pt-4 sm:pb-10 dark:bg-neutral-50"
    >
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <Typography variant="h2">Featured Classes</Typography>
          <Typography variant="body" className="mt-3 text-neutral-600">
            Start from your grade or group — each path includes curated books
            and chapter banks ready for test generation.
          </Typography>
        </div>

        {isLoading ? <CardGridSkeleton count={8} /> : null}

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
              description="Classes will appear here as your school fills in the library."
            />
          ) : (
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-3">
              {classes.map((item) => (
                <li key={item.id} className="min-w-0">
                  <Link
                    href={ROUTES.classBooks(item.id)}
                    className="group block h-full rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  >
                    <Card
                      hoverable
                      padded={false}
                      className="h-full cursor-pointer border-neutral-200 p-2 transition-[border-color,transform,box-shadow] duration-200 group-hover:-translate-y-px group-hover:border-primary-300 sm:p-6"
                    >
                      <div className="flex flex-col items-center gap-1.5 text-center sm:mb-4 sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-primary-50 text-primary-700 transition-colors duration-200 group-hover:bg-primary-100 sm:size-11">
                          <GraduationCap className="size-4 sm:size-5" aria-hidden="true" />
                        </div>
                        <Typography
                          variant="h4"
                          as="h3"
                          className="min-w-0 w-full break-words text-caption font-semibold leading-tight sm:flex-1 sm:text-h4 sm:leading-normal"
                        >
                          {item.name}
                        </Typography>
                      </div>
                      <Typography
                        variant="bodySmall"
                        className="mt-1 hidden text-neutral-500 sm:block"
                      >
                        {item.description || item.code}
                      </Typography>
                      <Typography
                        variant="caption"
                        className="mt-4 hidden font-medium text-primary-700 sm:block"
                      >
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
