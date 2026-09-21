import { BreadcrumbJsonLd } from "@/components/shared";
import { ROUTES } from "@/constants";
import { pageMetadata } from "@/constants/seo";
import { fetchPublic } from "@/services/publicApi";
import { QuestionsBoard } from "./features";

async function getChapter(chapterId) {
  const data = await fetchPublic(`/chapter/${chapterId}`);
  return data?.chapter_name ? data : null;
}

export async function generateMetadata({ params }) {
  const { classId, bookId, chapterId } = await params;
  const chapter = await getChapter(chapterId);
  const canonical = ROUTES.chapterQuestions(classId, bookId, chapterId);

  if (!chapter) {
    return pageMetadata({
      title: "Questions",
      description:
        "MCQs, short questions and long questions. Select questions and generate a printable test paper.",
      path: canonical,
      noindex: true,
    });
  }

  const bookName = chapter.book?.book_name;
  return pageMetadata({
    title: `${chapter.chapter_name} questions`,
    description: `MCQs, short questions and long questions from ${chapter.chapter_name}${
      bookName ? ` (${bookName})` : ""
    }. Select questions and generate a printable test paper.`,
    path: canonical,
  });
}

export default async function ChapterQuestionsPage({ params }) {
  const { classId, bookId, chapterId } = await params;
  const chapter = await getChapter(chapterId);

  return (
    <>
      {chapter ? (
        <BreadcrumbJsonLd
          items={[
            { name: "Classes", path: ROUTES.CLASSES },
            {
              name: chapter.book?.class?.name ?? "Class",
              path: ROUTES.classBooks(classId),
            },
            {
              name: chapter.book?.book_name ?? "Book",
              path: ROUTES.bookChapters(classId, bookId),
            },
            {
              name: chapter.chapter_name,
              path: ROUTES.chapterQuestions(classId, bookId, chapterId),
            },
          ]}
        />
      ) : null}
      <QuestionsBoard classId={classId} bookId={bookId} chapterId={chapterId} />
    </>
  );
}
