"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { buttonVariants, Container } from "@/components/ui";
import { ROUTES } from "@/constants";
import { useLogoutMutation } from "@/services/api/auth.api";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, selectAuthUser } from "@/store/authSlice";
import { cn } from "@/utils";

const NAV = [
  { label: "Classes", href: ROUTES.CLASSES },
  { label: "Admin", href: ROUTES.DASHBOARD },
];

export default function DashboardHeader() {
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
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-neutral-0/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href={ROUTES.HOME}
          className="text-h5 font-semibold tracking-tight text-neutral-900 transition-opacity duration-150 hover:opacity-80"
        >
          Test Generator
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-small font-medium text-neutral-600 transition-colors duration-150 hover:text-neutral-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-caption font-semibold text-neutral-900">
                  {user.name}
                </p>
                <p className="text-caption text-neutral-500">{user.email}</p>
              </div>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                onClick={onLogout}
                disabled={isLoading}
              >
                Sign out
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
