import { BreadcrumbJsonLd } from "@/components/shared";
import { ROUTES } from "@/constants";
import { pageMetadata } from "@/constants/seo";
import { fetchPublic } from "@/services/publicApi";
import { ChaptersLayout } from "./features";

async function getBook(bookId) {
  const data = await fetchPublic(`/book/${bookId}`);
  return data?.book_name ? data : null;
}

export async function generateMetadata({ params }) {
  const { classId, bookId } = await params;
  const book = await getBook(bookId);
  const canonical = ROUTES.bookChapters(classId, bookId);

  if (!book) {
    return pageMetadata({
      title: "Chapters",
      description:
        "Chapter list for this book. Pick a chapter to browse its MCQs, short and long questions.",
      path: canonical,
      noindex: true,
    });
  }

  const className = book.class_name ? `${book.class_name} ` : "";
  return pageMetadata({
    title: `${book.book_name} chapters`,
    description: `Chapter list for ${className}${book.book_name}. Pick a chapter to browse its MCQs, short and long questions.`,
    path: canonical,
  });
}

export default async function BookChaptersPage({ params }) {
  const { classId, bookId } = await params;
  const book = await getBook(bookId);

  return (
    <>
      {book ? (
        <BreadcrumbJsonLd
          items={[
            { name: "Classes", path: ROUTES.CLASSES },
            {
              name: book.class_name ?? "Class",
              path: ROUTES.classBooks(classId),
            },
            {
              name: book.book_name,
              path: ROUTES.bookChapters(classId, bookId),
            },
          ]}
        />
      ) : null}
      <ChaptersLayout classId={classId} bookId={bookId} />
    </>
  );
}
