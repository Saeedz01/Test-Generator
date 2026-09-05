"use client";

import { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { TeacherMenu } from "@/components/shared/Header/TeacherMenu";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { buttonVariants, Container } from "@/components/ui";
import { ROLES, ROUTES } from "@/constants";
import { useGetMeQuery, useLogoutMutation } from "@/services/api/auth.api";
import { clearUser, setUser } from "@/store/authSlice";
import { cn } from "@/utils";

/**
 * Public header — teacher nav for guests; Dashboard + Sign out when staff
 * already have a session.
 */
export default function Header() {
  const dispatch = useDispatch();
  const { data: user, isSuccess } = useGetMeQuery();
  const [logout, { isLoading }] = useLogoutMutation();

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
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href={ROUTES.HOME}
          className="min-w-0 transition-opacity duration-150 hover:opacity-80"
        >
          <BrandLogo />
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <nav aria-label="Primary" className="flex items-center gap-4">
            <Link
              href={ROUTES.CLASSES}
              className="text-small font-medium text-neutral-800 transition-colors duration-150 hover:text-primary-700"
            >
              Classes
            </Link>
            <Link
              href={ROUTES.BANNER}
              className="text-small font-medium text-neutral-800 transition-colors duration-150 hover:text-primary-700"
            >
              Banner Designer
            </Link>
          </nav>
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
      </Container>
    </header>
  );
}
