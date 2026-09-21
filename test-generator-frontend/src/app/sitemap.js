import { ROUTES } from "@/constants";
import { SITE_URL } from "@/constants/site";
import { fetchPublic } from "@/services/publicApi";

/** Refreshed daily; the curriculum changes slowly. */
export const revalidate = 86400;

const STATIC_PAGES = [
  { path: ROUTES.HOME, priority: 1, changeFrequency: "weekly" },
  { path: ROUTES.CLASSES, priority: 0.8, changeFrequency: "weekly" },
  { path: ROUTES.BANNER, priority: 0.6, changeFrequency: "monthly" },
  { path: ROUTES.ABOUT, priority: 0.5, changeFrequency: "monthly" },
];

function entry(path, priority, changeFrequency, lastModified) {
  return {
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency,
    priority,
    ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
  };
}

/**
 * Lists the public library (classes, books, chapters) alongside the static
 * pages. Archived classes and deleted books are already excluded by the API.
 * If the API cannot be reached (for example during a build without network),
 * the static pages are still returned and the content pages appear at the
 * next revalidation.
 *
 * @returns {Promise<import('next').MetadataRoute.Sitemap>}
 */
export default async function sitemap() {
  const pages = STATIC_PAGES.map(({ path, priority, changeFrequency }) =>
    entry(path, priority, changeFrequency),
  );

  const [classes, books, chapters] = await Promise.all([
    fetchPublic("/schoolclasses", { revalidate }),
    fetchPublic("/book", { revalidate }),
    fetchPublic("/chapter", { revalidate }),
  ]);

  if (!Array.isArray(classes) || !Array.isArray(books)) {
    return pages;
  }

  const classIds = new Set(classes.map((item) => item.id));

  for (const schoolClass of classes) {
    pages.push(
      entry(
        ROUTES.classBooks(schoolClass.id),
        0.7,
        "weekly",
        schoolClass.updatedAt,
      ),
    );
  }

  const bookClassId = new Map();
  for (const book of books) {
    const classId = book.classId ?? book.class?.id;
    if (!classId || !classIds.has(classId)) continue;
    bookClassId.set(book.id, classId);
    pages.push(
      entry(ROUTES.bookChapters(classId, book.id), 0.6, "weekly", book.updatedAt),
    );
  }

  if (Array.isArray(chapters)) {
    for (const chapter of chapters) {
      const classId = bookClassId.get(chapter.bookId);
      if (!classId) continue;
      pages.push(
        entry(
          ROUTES.chapterQuestions(classId, chapter.bookId, chapter.id),
          0.5,
          "monthly",
          chapter.updatedAt,
        ),
      );
    }
  }

  return pages;
}
