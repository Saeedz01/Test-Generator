import { BRAND_NAME } from "./brand";

/**
 * Builds a page's metadata with matching Open Graph / Twitter fields.
 *
 * Next.js inherits the whole `openGraph` object from the parent layout when a
 * page does not define one, so a page that only sets `title` would still be
 * shared with the site-wide social title. Using this helper keeps the shared
 * preview in step with the page.
 *
 * @param {{ title: string, description: string, path: string,
 *           noindex?: boolean, absoluteTitle?: boolean }} page
 */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  absoluteTitle = false,
}) {
  const socialTitle = absoluteTitle ? title : `${title} · ${BRAND_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: BRAND_NAME,
      title: socialTitle,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
