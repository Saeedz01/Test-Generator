/**
 * Legacy browse sidebar — kept for compatibility; admin uses AdminSidebar.
 */
"use client";

import Link from "next/link";
import { ROUTES } from "@/constants";

export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-neutral-200 bg-neutral-50 p-4 md:block">
      <nav className="flex flex-col gap-2 text-small text-neutral-600">
        <Link href={ROUTES.CLASSES} className="hover:text-neutral-900">
          Classes
        </Link>
        <Link href={ROUTES.DASHBOARD} className="hover:text-neutral-900">
          Admin
        </Link>
      </nav>
    </aside>
  );
}
