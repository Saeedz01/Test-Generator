import { ROUTES } from "@/constants";
import { SITE_URL } from "@/constants/site";

/**
 * Private surfaces are disallowed outright. Pages that are merely thin or
 * per-visitor (/search, /test, /banner/studio) stay crawlable and carry a
 * noindex tag instead, so crawlers can still follow their links.
 *
 * @returns {import('next').MetadataRoute.Robots}
 */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        ROUTES.DASHBOARD,
        ROUTES.LOGIN,
        ROUTES.FORGOT_PASSWORD,
        "/register",
        "/offline",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    ...(SITE_URL ? { host: SITE_URL } : {}),
  };
}
