import { BreadcrumbJsonLd } from "@/components/shared";
import { ROUTES } from "@/constants";
import { pageMetadata } from "@/constants/seo";
import { fetchPublic } from "@/services/publicApi";
import { BooksGrid } from "./features";

/** Titles come from the API; a failed lookup falls back to generic copy. */
async function getClass(classId) {
  const data = await fetchPublic(`/schoolclasses/${classId}`);
  return data?.name ? data : null;
}

export async function generateMetadata({ params }) {
  const { classId } = await params;
  const schoolClass = await getClass(classId);
  const canonical = ROUTES.classBooks(classId);

  if (!schoolClass) {
    return pageMetadata({
      title: "Books",
      description:
        "Books in the Testora question bank. Open a book to browse its chapters and build a test paper.",
      path: canonical,
      noindex: true,
    });
  }

  return pageMetadata({
    title: `${schoolClass.name} books`,
    description: `Books available for ${schoolClass.name} in the Testora question bank. Open a book to browse its chapters and build a test paper.`,
    path: canonical,
  });
}

export default async function ClassBooksPage({ params }) {
  const { classId } = await params;
  const schoolClass = await getClass(classId);

  return (
    <>
      {schoolClass ? (
        <BreadcrumbJsonLd
          items={[
            { name: "Classes", path: ROUTES.CLASSES },
            { name: schoolClass.name, path: ROUTES.classBooks(classId) },
          ]}
        />
      ) : null}
      <BooksGrid classId={classId} />
    </>
  );
}
