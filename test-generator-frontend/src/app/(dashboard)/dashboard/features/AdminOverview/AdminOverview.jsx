"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import {
  BookOpen,
  GraduationCap,
  ListTree,
  MessageSquareText,
} from "lucide-react";
import { Card, Heading } from "@/components/ui";
import { ROUTES } from "@/constants";
import {
  selectAdminBooks,
  selectAdminChapters,
  selectAdminClasses,
  selectAdminQuestions,
} from "@/store/adminContentSlice";

const CARDS = [
  {
    key: "classes",
    label: "Classes",
    href: ROUTES.ADMIN_CLASSES,
    Icon: GraduationCap,
    selector: selectAdminClasses,
  },
  {
    key: "books",
    label: "Books",
    href: ROUTES.ADMIN_BOOKS,
    Icon: BookOpen,
    selector: selectAdminBooks,
  },
  {
    key: "chapters",
    label: "Chapters",
    href: ROUTES.ADMIN_CHAPTERS,
    Icon: ListTree,
    selector: selectAdminChapters,
  },
  {
    key: "questions",
    label: "Questions",
    href: ROUTES.ADMIN_QUESTIONS,
    Icon: MessageSquareText,
    selector: selectAdminQuestions,
  },
];

export function AdminOverview() {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <Heading level="h1">Admin Dashboard</Heading>
        <p className="mt-2 text-body text-neutral-600">
          Manage curriculum content for the Test Generator platform. CRUD is
          local for now — backend integration can replace this store later.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map(({ key, label, href, Icon, selector }) => (
          <OverviewCard
            key={key}
            label={label}
            href={href}
            Icon={Icon}
            selector={selector}
          />
        ))}
      </ul>
    </div>
  );
}

function OverviewCard({ label, href, Icon, selector }) {
  const items = useSelector(selector);

  return (
    <li>
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
          <p className="text-h3 font-semibold text-neutral-900">{items.length}</p>
          <p className="mt-1 text-small text-neutral-600">{label}</p>
        </Card>
      </Link>
    </li>
  );
}
