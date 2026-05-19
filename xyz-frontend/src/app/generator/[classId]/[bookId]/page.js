import BackBar from "@/app/Components/TestGenerator/BackBar";
import BreadcrumbTrail from "@/app/Components/TestGenerator/BreadcrumbTrail";
import { notFound } from "next/navigation";

import ChapterList from "./comp/ChapterList";
import { getBook, getClass } from "../../utils/curriculumData";
import { classPath, GENERATOR_BASE } from "../../utils/paths";

/** @param {{ params: Promise<{ classId: string, bookId: string }> }} args */
export async function generateMetadata({ params }) {
  const { classId, bookId } = await params;
  const book = getBook(classId, bookId);
  return { title: book?.title ?? "Book" };
}

/** @param {{ params: Promise<{ classId: string, bookId: string }> }} args */
export default async function BookChaptersPage({ params }) {
  const { classId, bookId } = await params;
  const schoolClass = getClass(classId);
  const book = getBook(classId, bookId);
  if (!schoolClass || !book) notFound();

  return (
    <>
      <BackBar href={classPath(classId)} label={`Books · ${schoolClass.label}`} />
      <BreadcrumbTrail
        items={[
          { label: "Generator", href: GENERATOR_BASE },
          { label: schoolClass.label, href: classPath(classId) },
          { label: book.title },
        ]}
      />
      <ChapterList
        schoolClassId={schoolClass.id}
        schoolClassLabel={schoolClass.label}
        book={book}
      />
    </>
  );
}
