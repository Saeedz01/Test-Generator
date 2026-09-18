import { ROUTES } from "@/constants";
import { SITE_URL } from "@/constants/site";

/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [ROUTES.DASHBOARD, ROUTES.LOGIN, "/register", "/offline"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
