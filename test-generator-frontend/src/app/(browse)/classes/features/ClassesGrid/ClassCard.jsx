"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { BookOpen, GraduationCap } from "lucide-react";
import { Badge, Card, Typography } from "@/components/ui";
import { ROUTES } from "@/constants";
import { selectClass } from "@/store/selectionSlice";
import { cn } from "@/utils";

/**
 * Reusable class card for the classes grid.
 * Mobile: icon + name only. sm+: full details.
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
        padded={false}
        className="h-full border-neutral-200 p-2 transition-[border-color,transform,box-shadow] duration-200 group-hover:-translate-y-px group-hover:border-primary-300 sm:p-6"
      >
        <div className="flex flex-col items-center gap-1.5 text-center sm:mb-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:text-left">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-primary-50 text-primary-700 transition-colors duration-200 group-hover:bg-primary-100 sm:size-11">
            <GraduationCap className="size-4 sm:size-5" aria-hidden="true" />
          </div>
          <Typography
            variant="h4"
            as="h3"
            className="min-w-0 w-full break-words text-caption font-semibold leading-tight sm:flex-1 sm:text-h4 sm:leading-normal"
          >
            {schoolClass.name}
          </Typography>
          <Badge
            variant="primary"
            className="hidden max-w-full shrink-0 sm:inline-flex"
          >
            {schoolClass.code}
          </Badge>
        </div>
        {schoolClass.description ? (
          <p className="mt-2 hidden line-clamp-2 text-small text-neutral-600 sm:block">
            {schoolClass.description}
          </p>
        ) : null}
        <div className="mt-5 hidden items-center gap-2 text-caption font-medium text-primary-700 sm:flex">
          <BookOpen className="size-3.5" aria-hidden="true" />
          {booksCount} {booksCount === 1 ? "book" : "books"}
        </div>
      </Card>
    </Link>
  );
}
