"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { BookOpen, GraduationCap } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { ROUTES } from "@/constants";
import { selectClass } from "@/store/selectionSlice";
import { cn } from "@/utils";

/**
 * Reusable class card for the classes grid.
 */
export function ClassCard({ schoolClass, className }) {
  const dispatch = useDispatch();
  const booksCount = Number(schoolClass.booksCount ?? 0);

  return (
    <Link
      href={ROUTES.classBooks(schoolClass.id)}
      onClick={() => dispatch(selectClass(schoolClass))}
      className={cn(
        "group block h-full rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        className,
      )}
    >
      <Card
        hoverable
        className="h-full border-neutral-200 transition-[border-color,transform,box-shadow] duration-200 group-hover:-translate-y-px group-hover:border-primary-300"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-[var(--radius-lg)] bg-primary-50 text-primary-700 transition-colors duration-200 group-hover:bg-primary-100">
            <GraduationCap className="size-5" aria-hidden="true" />
          </div>
          <Badge variant="primary">{schoolClass.code}</Badge>
        </div>
        <h3 className="text-h4 font-semibold text-neutral-900">
          {schoolClass.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-small text-neutral-600">
          {schoolClass.description}
        </p>
        <div className="mt-5 flex items-center gap-2 text-caption font-medium text-primary-700">
          <BookOpen className="size-3.5" aria-hidden="true" />
          {booksCount} {booksCount === 1 ? "book" : "books"}
        </div>
      </Card>
    </Link>
  );
}
