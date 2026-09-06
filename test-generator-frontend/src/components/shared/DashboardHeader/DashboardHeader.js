"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogOut, Menu } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { buttonVariants, Container } from "@/components/ui";
import { ROUTES } from "@/constants";
import { useLogoutMutation } from "@/services/api/auth.api";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, selectAuthUser } from "@/store/authSlice";
import { cn } from "@/utils";

export default function DashboardHeader({ onMenuClick, menuOpen = false }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const [logout, { isLoading }] = useLogoutMutation();

  const onLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      toast.success("Signed out");
      router.push(ROUTES.LOGIN);
    } catch (error) {
      dispatch(clearUser());
      toast.error(error?.data?.message || error?.error || "Signed out locally");
      router.push(ROUTES.LOGIN);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-0">
      <Container className="flex h-16 items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-neutral-700 hover:bg-neutral-100 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open admin menu"
            aria-expanded={menuOpen}
            aria-controls="admin-nav-drawer"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <Link
            href={ROUTES.HOME}
            className="min-w-0 transition-opacity duration-150 hover:opacity-80"
          >
            <BrandLogo priority />
          </Link>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-4 lg:flex lg:gap-6">
          <Link
            href={ROUTES.CLASSES}
            className="text-small font-medium text-neutral-600 transition-colors duration-150 hover:text-neutral-900"
          >
            Classes
          </Link>
          <Link
            href={ROUTES.BANNER}
            className="text-small font-medium text-neutral-600 transition-colors duration-150 hover:text-neutral-900"
          >
            Banner Designer
          </Link>
          <Link
            href={ROUTES.DASHBOARD}
            className="hidden text-small font-medium text-neutral-600 transition-colors duration-150 hover:text-neutral-900 lg:inline"
          >
            Admin
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <div className="hidden text-right lg:block">
                <p className="text-caption font-semibold text-neutral-900">
                  {user.name}
                </p>
                <p className="max-w-[12rem] truncate text-caption text-neutral-500">
                  {user.email}
                </p>
              </div>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                onClick={onLogout}
                disabled={isLoading}
                aria-label="Sign out"
              >
                <LogOut className="size-4 sm:hidden" aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <Link
              href={ROUTES.LOGIN}
              className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
            >
              Sign in
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
