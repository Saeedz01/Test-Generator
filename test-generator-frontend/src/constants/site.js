/**
 * Public URLs, inlined at build time from NEXT_PUBLIC_* variables.
 *
 * Production builds are validated in next.config.mjs (both must be set to
 * absolute https URLs), so the localhost fallbacks below only ever apply to
 * `next dev` and tests; a production bundle never silently points at
 * localhost.
 */
const isProduction = process.env.NODE_ENV === "production";

function publicUrl(value, devFallback) {
  const url = value?.trim().replace(/\/+$/, "");
  if (url) return url;
  return isProduction ? "" : devFallback;
}

/** Canonical public origin of this site (metadata, sitemap, robots). */
export const SITE_URL = publicUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  "http://localhost:3000",
);

/** Base URL the browser uses for the backend (`${API_URL}/api/...`). */
export const API_URL = publicUrl(
  process.env.NEXT_PUBLIC_API_URL,
  "http://localhost:5000",
);
