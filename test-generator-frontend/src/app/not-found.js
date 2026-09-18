import Link from "next/link";
import { StatusPage } from "@/components/shared";
import { buttonVariants } from "@/components/ui";
import { ROUTES } from "@/constants";

export const metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <StatusPage
      eyebrow="404"
      title="Page not found"
      description="The page you are looking for does not exist or has moved."
    >
      <Link href={ROUTES.HOME} className={buttonVariants({ variant: "primary" })}>
        Go to home
      </Link>
      <Link href={ROUTES.CLASSES} className={buttonVariants({ variant: "outline" })}>
        Browse classes
      </Link>
    </StatusPage>
  );
}
