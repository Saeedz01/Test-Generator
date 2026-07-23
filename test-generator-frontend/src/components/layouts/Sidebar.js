/**
 * Dashboard sidebar — test-builder navigation.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutList,
} from "lucide-react";
import { ROUTES } from "@/constants";
import {
  selectSelectedBook,
  selectSelectedChapter,
  selectSelectedClass,
  selectSelectedQuestionCount,
} from "@/store/selectionSlice";
import { cn } from "@/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const schoolClass = useSelector(selectSelectedClass);
  const book = useSelector(selectSelectedBook);
  const chapter = useSelector(selectSelectedChapter);
  const selectedCount = useSelector(selectSelectedQuestionCount);

  const links = [
    {
      href: ROUTES.CLASSES,
      label: "Classes",
      Icon: GraduationCap,
      active: pathname?.startsWith("/dashboard/classes"),
    },
    {
      href:
        schoolClass && book
          ? ROUTES.bookChapters(schoolClass.id, book.id)
          : schoolClass
            ? ROUTES.classBooks(schoolClass.id)
            : ROUTES.CLASSES,
      label: "Books / Chapters",
      Icon: BookOpen,
      active:
        pathname?.includes("/books") || pathname?.includes("/chapters"),
    },
    {
      href:
        schoolClass && book && chapter
          ? ROUTES.chapterQuestions(schoolClass.id, book.id, chapter.id)
          : ROUTES.CLASSES,
      label: "Questions",
      Icon: LayoutList,
      active: pathname?.includes("/questions"),
    },
    {
      href: ROUTES.TEST_SUMMARY,
      label: `Test (${selectedCount})`,
      Icon: ClipboardList,
      active: pathname === ROUTES.TEST_SUMMARY,
    },
  ];

  return (
    <aside className="hidden w-56 shrink-0 border-r border-neutral-200 bg-neutral-50 p-4 md:block">
      <p className="mb-3 px-2 text-caption font-semibold tracking-wide text-neutral-400 uppercase">
        Workspace
      </p>
      <nav aria-label="Dashboard" className="flex flex-col gap-1">
        {links.map(({ href, label, Icon, active }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-small font-medium transition-colors duration-150",
              active
                ? "bg-primary-50 text-primary-800"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
