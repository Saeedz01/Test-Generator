"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { TeacherMenu } from "@/components/shared/Header/TeacherMenu";
import { MobileNav } from "@/components/shared/Header/MobileNav";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { buttonVariants, Container, Typography } from "@/components/ui";
import { ROLES, ROUTES } from "@/constants";
import { useGetMeQuery, useLogoutMutation } from "@/services/api/auth.api";
import { clearUser, setUser } from "@/store/authSlice";
import { cn } from "@/utils";

const NAV_LINKS = [
  { href: ROUTES.CLASSES, label: "Classes" },
  { href: ROUTES.BANNER, label: "Banner Designer" },
  { href: ROUTES.ABOUT, label: "About" },
];

function isActivePath(pathname, href) {
  return pathname === href || pathname?.startsWith(`${href}/`);
}

/**
 * Public header — teacher nav for guests; Dashboard + Sign out when staff
 * already have a session.
 */
export default function Header() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { data: user, isSuccess } = useGetMeQuery();
  const [logout, { isLoading }] = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) dispatch(setUser(user));
  }, [dispatch, user]);

  const isStaff =
    isSuccess &&
    (user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN);

  const onLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      toast.success("Signed out");
    } catch {
      dispatch(clearUser());
      toast.success("Signed out");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-0">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link
          href={ROUTES.HOME}
          className="min-w-0 shrink-0 transition-opacity duration-150 hover:opacity-80"
        >
          <BrandLogo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Typography
                key={item.href}
                as={Link}
                href={item.href}
                variant="navigation"
                className={cn(
                  "transition-colors duration-150 hover:text-primary-800",
                  active && "underline underline-offset-4",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Typography>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <TeacherMenu />
          {isStaff ? (
            <>
              <Link
                href={ROUTES.DASHBOARD}
                className="text-small font-medium text-neutral-600 transition-colors duration-150 hover:text-neutral-900"
              >
                Dashboard
              </Link>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                onClick={onLogout}
                disabled={isLoading}
              >
                Sign out
              </button>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-neutral-700 hover:bg-neutral-100"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="site-nav-drawer"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </Container>

      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isStaff={isStaff}
        onLogout={onLogout}
        isLoading={isLoading}
      />
    </header>
  );
}
