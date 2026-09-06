"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { BookMarked } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { ROUTES } from "@/constants";
import { selectBook } from "@/store/selectionSlice";
import { cn } from "@/utils";

/**
 * Reusable book card.
 */
export function BookCard({ book, classId, className }) {
  const dispatch = useDispatch();
  const resolvedClassId = classId || book.classId;

  return (
    <Link
      href={ROUTES.bookChapters(resolvedClassId, book.id)}
      onClick={() => dispatch(selectBook(book))}
      className={cn(
        "group block h-full rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        className,
      )}
    >
      <Card
        hoverable
        className="h-full transition-[border-color,transform,box-shadow] duration-200 group-hover:-translate-y-px group-hover:border-primary-300"
      >
        <div className="mb-4 flex size-11 items-center justify-center rounded-[var(--radius-lg)] bg-info-50 text-info-700 transition-colors duration-200 group-hover:bg-info-100">
          <BookMarked className="size-5" aria-hidden="true" />
        </div>
        <div className="mb-2">
          <Badge variant="outline">{book.subject}</Badge>
        </div>
        <h3 className="text-h5 font-semibold break-words text-neutral-900">
          {book.name}
        </h3>
        <p className="mt-1 text-caption text-neutral-500">{book.author}</p>
        <p className="mt-3 line-clamp-2 text-small text-neutral-600">
          {book.description}
        </p>
      </Card>
    </Link>
  );
}
