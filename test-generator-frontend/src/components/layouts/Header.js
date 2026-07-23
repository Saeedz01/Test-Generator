/**
 * Premium public header — brand + primary navigation.
 */
import Link from "next/link";
import { buttonVariants, Container } from "@/components/ui";
import { ROUTES } from "@/constants";
import { cn } from "@/utils";

const NAV = [
  { label: "Classes", href: ROUTES.CLASSES },
  { label: "Dashboard", href: ROUTES.DASHBOARD },
];

export default function Header() {
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

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={ROUTES.LOGIN}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            Sign in
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
          >
            Get started
          </Link>
        </div>
      </Container>
    </header>
  );
}
