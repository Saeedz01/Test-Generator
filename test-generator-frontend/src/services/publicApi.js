/**
 * Server-side only (metadata + sitemap). Never import from a client
 * component: it reads a server-only environment variable.
 */
import { API_URL } from "@/constants/site";

/**
 * Server-side base URL for the public API. In proxy mode the browser talks to
 * this site's own origin, but the server should call the backend directly
 * (API_PROXY_TARGET), which avoids a round trip through its own public URL.
 */
const SERVER_API_URL = (
  process.env.API_PROXY_TARGET?.trim() || API_URL
).replace(/\/+$/, "");

const TIMEOUT_MS = 4000;

/**
 * Fetches public curriculum data for metadata and the sitemap. Returns null
 * instead of throwing: SEO data is nice to have, and a slow or unreachable
 * API must never break a page render or a build.
 *
 * @param {string} path API path starting with "/", e.g. "/schoolclasses"
 * @param {{ revalidate?: number }} [options]
 */
export async function fetchPublic(path, { revalidate = 3600 } = {}) {
  if (!SERVER_API_URL) return null;
  try {
    const response = await fetch(`${SERVER_API_URL}/api${path}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: "application/json" },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
