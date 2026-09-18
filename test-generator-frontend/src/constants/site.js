/**
 * Canonical public origin for sitemap/robots links.
 * Set NEXT_PUBLIC_SITE_URL at build time (e.g. https://testora.example.com).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
