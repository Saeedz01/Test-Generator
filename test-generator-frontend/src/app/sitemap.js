import { ROUTES } from "@/constants";
import { SITE_URL } from "@/constants/site";

const PUBLIC_PAGES = [
  { path: ROUTES.HOME, priority: 1 },
  { path: ROUTES.CLASSES, priority: 0.8 },
  { path: ROUTES.BANNER, priority: 0.6 },
  { path: ROUTES.ABOUT, priority: 0.5 },
];

/** @returns {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  return PUBLIC_PAGES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "weekly",
    priority,
  }));
}
