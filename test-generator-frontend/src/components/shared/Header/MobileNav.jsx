"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { TeacherMenu } from "@/components/shared/Header/TeacherMenu";
import { buttonVariants, Typography } from "@/components/ui";
import { ROUTES } from "@/constants";
import { cn } from "@/utils";

const NAV_LINKS = [
  { href: ROUTES.CLASSES, label: "Classes" },
  { href: ROUTES.BANNER, label: "Banner Designer" },
  { href: ROUTES.ABOUT, label: "About" },
];

function isActivePath(pathname, href) {
  return pathname === href || pathname?.startsWith(`${href}/`);
}

export function MobileNav({
  open,
  onClose,
  isStaff,
  onLogout,
  isLoading,
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-neutral-900/40"
        onClick={onClose}
      />
      <aside
        id="site-nav-drawer"
        className="relative z-10 ml-auto flex h-full w-[min(100%,20rem)] flex-col gap-6 overflow-y-auto border-l border-neutral-200 bg-neutral-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-md"
      >
        <div className="flex items-center justify-between">
          <p className="text-caption font-semibold tracking-wide text-neutral-400 uppercase">
            Menu
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex size-9 items-center justify-center rounded-[var(--radius-sm)] text-neutral-600 hover:bg-neutral-100"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Primary" className="flex flex-col gap-1">
          {NAV_LINKS.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Typography
                key={item.href}
                as={Link}
                href={item.href}
                variant="navigation"
                onClick={onClose}
                className={cn(
                  "rounded-[var(--radius-md)] px-3 py-2.5 hover:bg-neutral-50",
                  active && "underline underline-offset-4",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Typography>
            );
          })}
        </nav>

        <div className="border-t border-neutral-100 pt-4">
          <TeacherMenu layout="stack" />
        </div>

        {isStaff ? (
          <div className="mt-auto flex flex-col gap-2 border-t border-neutral-100 pt-4">
            <Link
              href={ROUTES.DASHBOARD}
              onClick={onClose}
              className="rounded-[var(--radius-md)] px-3 py-2.5 text-small font-medium text-neutral-800 hover:bg-neutral-50"
            >
              Dashboard
            </Link>
            <button
              type="button"
              className={cn(buttonVariants({ variant: "outline", size: "md" }), "w-full")}
              onClick={() => {
                onClose();
                onLogout();
              }}
              disabled={isLoading}
            >
              Sign out
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
