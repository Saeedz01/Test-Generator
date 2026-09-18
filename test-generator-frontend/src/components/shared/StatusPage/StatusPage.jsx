/**
 * Full-page status screen (404, error, offline) in the auth-page chrome.
 * Server-safe: pass interactive actions (buttons with handlers) as children
 * from a client component.
 *
 * @param {Object} props
 * @param {string} [props.eyebrow] short status label, e.g. "404"
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {import("react").ReactNode} [props.children] actions
 */
import Link from "next/link";
import { Typography } from "@/components/ui";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ROUTES } from "@/constants";

export function StatusPage({ eyebrow, title, description, children }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-neutral-50 px-4 py-12 pb-[max(3rem,env(safe-area-inset-bottom))]">
      <Link
        href={ROUTES.HOME}
        className="mb-8 transition-opacity duration-150 hover:opacity-80"
      >
        <BrandLogo />
      </Link>
      <div className="w-full max-w-md text-center">
        {eyebrow ? (
          <Typography variant="caption" className="uppercase">
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h2" as="h1" className="mt-2">
          {title}
        </Typography>
        {description ? (
          <Typography variant="body" className="mt-3">
            {description}
          </Typography>
        ) : null}
        {children ? (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
