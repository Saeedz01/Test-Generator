"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  ListTree,
  MessageSquareText,
  Shield,
  X,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { selectAuthUser } from "@/store/authSlice";
import { cn } from "@/utils";

const BASE_LINKS = [
  { href: ROUTES.DASHBOARD, label: "Overview", Icon: LayoutDashboard, exact: true },
  { href: ROUTES.ADMIN_CLASSES, label: "Classes", Icon: GraduationCap },
  { href: ROUTES.ADMIN_BOOKS, label: "Books", Icon: BookOpen },
  { href: ROUTES.ADMIN_CHAPTERS, label: "Chapters", Icon: ListTree },
  { href: ROUTES.ADMIN_QUESTIONS, label: "Questions", Icon: MessageSquareText },
];

function AdminNav({ pathname, links, onNavigate }) {
  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {links.map(({ href, label, Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname === href || pathname?.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
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
        );
      })}
    </nav>
  );
}

export default function AdminSidebar({ open = false, onClose }) {
  const pathname = usePathname();
  const user = useSelector(selectAuthUser);
  const links =
    user?.role === "super_admin"
      ? [
          ...BASE_LINKS,
          { href: ROUTES.ADMIN_ADMINS, label: "Admins", Icon: Shield },
        ]
      : BASE_LINKS;

  return (
    <>
      <aside className="hidden w-56 shrink-0 border-r border-neutral-200 bg-neutral-0 p-4 md:block">
        <p className="mb-3 px-2 text-caption font-semibold tracking-wide text-neutral-400 uppercase">
          Admin
        </p>
        <AdminNav pathname={pathname} links={links} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-neutral-900/40"
            onClick={onClose}
          />
          <aside
            id="admin-nav-drawer"
            className="relative z-10 flex h-full w-64 flex-col border-r border-neutral-200 bg-neutral-0 p-4 shadow-md"
          >
            <div className="mb-3 flex items-center justify-between px-2">
              <p className="text-caption font-semibold tracking-wide text-neutral-400 uppercase">
                Admin
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close admin menu"
                className="inline-flex size-8 items-center justify-center rounded-[var(--radius-sm)] text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <AdminNav pathname={pathname} links={links} onNavigate={onClose} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
