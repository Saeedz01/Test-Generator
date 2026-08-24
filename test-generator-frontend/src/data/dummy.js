/**
 * Demo curriculum fixtures — re-exports + lookup helpers.
 */

export { dummyClasses } from "./dummyClasses";
export { dummyBooks } from "./dummyBooks";
export { dummyChapters } from "./dummyChapters";
export {
  dummyQuestions,
  dummyMcqQuestions,
  dummyShortQuestions,
  dummyLongQuestions,
} from "./dummyQuestions";

import { dummyClasses } from "./dummyClasses";
import { dummyBooks } from "./dummyBooks";
import { dummyChapters } from "./dummyChapters";
import { dummyQuestions } from "./dummyQuestions";

export const dummyCurriculumTree = dummyClasses.map((schoolClass) => ({
  ...schoolClass,
  books: dummyBooks
    .filter((book) => book.classId === schoolClass.id)
    .map((book) => ({
      ...book,
      chapters: dummyChapters
        .filter((chapter) => chapter.bookId === book.id)
        .sort((a, b) => a.order - b.order)
        .map((chapter) => ({
          ...chapter,
          questions: dummyQuestions.filter(
            (question) => question.chapterId === chapter.id,
          ),
        })),
    })),
}));

export function getBooksByClassId(classId) {
  return dummyBooks.filter((book) => book.classId === classId);
}

export function getChaptersByBookId(bookId) {
  return dummyChapters
    .filter((chapter) => chapter.bookId === bookId)
    .sort((a, b) => a.order - b.order);
}

export function getQuestionsByChapterId(chapterId) {
  return dummyQuestions.filter((question) => question.chapterId === chapterId);
}

export function getQuestionsByType(type, chapterId) {
  return dummyQuestions.filter(
    (question) =>
      question.type === type &&
      (chapterId ? question.chapterId === chapterId : true),
  );
}
