import BackBar from "@/app/Components/TestGenerator/BackBar";
import BreadcrumbTrail from "@/app/Components/TestGenerator/BreadcrumbTrail";
import { notFound } from "next/navigation";

import ChapterQuizClient from "./comp/ChapterQuizClient";
import { getBook, getChapter, getClass } from "../../../utils/curriculumData";
import { groupQuestionsByKind } from "../../../utils/queries";
import { bookPath, classPath, GENERATOR_BASE } from "../../../utils/paths";

/** @param {{ params: Promise<{ classId: string, bookId: string, chapterId: string }> }} args */
export async function generateMetadata({ params }) {
  const { classId, bookId, chapterId } = await params;
  const chapter = getChapter(classId, bookId, chapterId);
  return { title: chapter?.title ?? "Chapter" };
}

/** @param {{ params: Promise<{ classId: string, bookId: string, chapterId: string }> }} args */
export default async function ChapterQuizPage({ params }) {
  const { classId, bookId, chapterId } = await params;
  const schoolClass = getClass(classId);
  const book = getBook(classId, bookId);
  const chapter = getChapter(classId, bookId, chapterId);

  if (!schoolClass || !book || !chapter) notFound();

  const grouped = groupQuestionsByKind(chapter.questions);

  return (
    <>
      <BackBar href={bookPath(classId, bookId)} label={`Chapters · ${book.title}`} />
      <BreadcrumbTrail
        items={[
          { label: "Generator", href: GENERATOR_BASE },
          { label: schoolClass.label, href: classPath(classId) },
          { label: book.title, href: bookPath(classId, bookId) },
          { label: chapter.title },
        ]}
      />
      <ChapterQuizClient
        context={{
          classLabel: schoolClass.label,
          bookTitle: book.title,
          chapterTitle: chapter.title,
        }}
        grouped={grouped}
      />
    </>
  );
}
