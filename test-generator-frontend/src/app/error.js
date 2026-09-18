"use client";

import { useEffect } from "react";
import Link from "next/link";
import { StatusPage } from "@/components/shared";
import { Button, buttonVariants } from "@/components/ui";
import { ROUTES } from "@/constants";

/** Route-level error boundary (renders inside the root layout). */
export default function Error({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      eyebrow="Error"
      title="Something went wrong"
      description="This page could not be displayed. Try again, or go back to the home page."
    >
      <Button type="button" onClick={() => retry()}>
        Try again
      </Button>
      <Link href={ROUTES.HOME} className={buttonVariants({ variant: "outline" })}>
        Go to home
      </Link>
    </StatusPage>
  );
}
