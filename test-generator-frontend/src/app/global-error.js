"use client";

import { useEffect } from "react";
import { StatusPage } from "@/components/shared";
import { Button } from "@/components/ui";
import { BRAND_NAME } from "@/constants";
import "./globals.css";

/** Replaces the root layout when it fails, so it renders its own html/body. */
export default function GlobalError({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-full min-w-0 flex-col antialiased">
        <title>{`Something went wrong · ${BRAND_NAME}`}</title>
        <StatusPage
          eyebrow="Error"
          title="Something went wrong"
          description={`${BRAND_NAME} hit an unexpected problem. Try again, or reload the page.`}
        >
          <Button type="button" onClick={() => retry()}>
            Try again
          </Button>
        </StatusPage>
      </body>
    </html>
  );
}
