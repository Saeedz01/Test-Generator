"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState, Heading } from "@/components/ui";
import { ROUTES } from "@/constants";
import { getBooksByClassId, getClassById } from "@/data/curriculum";
import { BookCard } from "./BookCard";
import { BooksSearch } from "./BooksSearch";

/**
 * Books grid for a selected class — searchable and responsive.
 */
export function BooksGrid({ classId }) {
  const schoolClass = getClassById(classId);
  const books = getBooksByClassId(classId);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter((book) =>
      [book.name, book.subject, book.author, book.description]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q)),
    );
  }, [books, query]);

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
          title="No books match your search"
          description="Try another keyword or clear the search field."
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
