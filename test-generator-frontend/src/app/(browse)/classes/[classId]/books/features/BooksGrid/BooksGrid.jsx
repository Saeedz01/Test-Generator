"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { EmptyState, Heading } from "@/components/ui";
import { Breadcrumb, PageHeaderSkeleton } from "@/components/shared";
import { ROUTES } from "@/constants";
import { useGetClassesQuery } from "@/services/api/classes.api";
import { useGetBooksQuery } from "@/services/api/books.api";
import { selectClass } from "@/store/selectionSlice";
import { BookCard } from "./BookCard";
import { BooksSearch } from "./BooksSearch";

/**
 * Books grid for a selected class — searchable and responsive.
 */
export function BooksGrid({ classId }) {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const {
    data: classes = [],
    isLoading: classesLoading,
    isError: classesError,
    error: classesFetchError,
    refetch: refetchClasses,
  } = useGetClassesQuery();
  const {
    data: books = [],
    isLoading: booksLoading,
    isError: booksError,
    error: booksFetchError,
    refetch: refetchBooks,
  } = useGetBooksQuery(classId);

  const schoolClass = classes.find((item) => item.id === classId);
  const isLoading = classesLoading || booksLoading;
  const isError = classesError || booksError;
  const error = classesFetchError || booksFetchError;

  useEffect(() => {
    if (schoolClass) dispatch(selectClass(schoolClass));
  }, [schoolClass, dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter((book) =>
      [book.name, book.subject, book.author, book.description, book.edition]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q)),
    );
  }, [books, query]);

  if (isLoading) {
    return <PageHeaderSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Could not load books"
        description={
          error?.data?.message ||
          error?.error ||
          "Check that the backend is running, then try again."
        }
        action={
          <button
            type="button"
            className="text-small font-semibold text-primary-700"
            onClick={() => {
              refetchClasses();
              refetchBooks();
            }}
          >
            Retry
          </button>
        }
      />
    );
  }

  if (!schoolClass) {
    return (
      <EmptyState
        title="Class not found"
        description="Pick a class from the library to continue."
        action={
          <Link href={ROUTES.CLASSES} className="text-small font-semibold text-primary-700">
            Back to classes
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Home", href: ROUTES.HOME },
          { label: "Classes", href: ROUTES.CLASSES },
          { label: schoolClass.name },
        ]}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-caption font-medium tracking-wide text-primary-700 uppercase">
            {schoolClass.name}
          </p>
          <Heading level="h1" className="mt-1">
            Books
          </Heading>
          <p className="mt-2 text-body text-neutral-600">
            Select a book to open its chapters and question bank.
          </p>
        </div>
        <BooksSearch value={query} onChange={setQuery} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={books.length === 0 ? "No books yet" : "No books match your search"}
          description={
            books.length === 0
              ? "No books are listed for this class yet. Try another class from the path above."
              : "Try another keyword or clear the search field."
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((book, index) => (
            <li
              key={book.id}
              className="animate-[fadeRise_0.35s_ease_both]"
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <BookCard book={book} classId={classId} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
