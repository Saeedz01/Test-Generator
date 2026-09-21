import { SITE_URL } from "@/constants/site";

/**
 * BreadcrumbList structured data for browse pages, so search results can
 * show the Class › Book › Chapter path. Server component.
 *
 * @param {{ items: { name: string, path: string }[] }} props
 */
export function BreadcrumbJsonLd({ items }) {
  if (!items?.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(SITE_URL ? { item: `${SITE_URL}${item.path}` } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
