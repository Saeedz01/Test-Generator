"use client";

import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  ListTree,
  MessageSquareText,
} from "lucide-react";
import { Card, EmptyState, Heading } from "@/components/ui";
import { BRAND_NAME, ROUTES } from "@/constants";
import { useGetAdminDashboardStatsQuery } from "@/services/api/admin.api";

const CARDS = [
  {
    key: "classes",
    label: "Classes",
    href: ROUTES.ADMIN_CLASSES,
    Icon: GraduationCap,
    statKey: "classes",
  },
  {
    key: "books",
    label: "Books",
    href: ROUTES.ADMIN_BOOKS,
    Icon: BookOpen,
    statKey: "books",
  },
  {
    key: "chapters",
    label: "Chapters",
    href: ROUTES.ADMIN_CHAPTERS,
    Icon: ListTree,
    statKey: "chapters",
  },
  {
    key: "questions",
    label: "Questions",
    href: ROUTES.ADMIN_QUESTIONS,
    Icon: MessageSquareText,
    statKey: "questions",
  },
];

export function AdminOverview() {
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAdminDashboardStatsQuery();

  if (isLoading) {
    return (
      <EmptyState
        title="Loading dashboard..."
        description="Fetching live counts from the database."
      />
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Could not load dashboard stats"
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
        <Heading level="h1">Admin Dashboard</Heading>
        <p className="mt-2 text-body text-neutral-600">
          Manage curriculum content for {BRAND_NAME}. Counts below
          reflect live data from the database.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map(({ key, label, href, Icon, statKey }) => (
          <li key={key}>
            <Link
              href={href}
              className="group block rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <Card
                hoverable
                className="transition-[border-color,transform] duration-200 group-hover:border-primary-300"
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-primary-50 text-primary-700">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <p className="text-h3 font-semibold text-neutral-900">
                  {stats?.[statKey] ?? 0}
                </p>
                <p className="mt-1 text-small text-neutral-600">{label}</p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
