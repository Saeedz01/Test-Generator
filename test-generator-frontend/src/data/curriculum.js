/**
 * Extended curriculum fixtures for the test-builder UI (plain JS).
 * Builds on `@/data/dummy` and adds ICS / ICOM / FA demo tracks.
 */

import {
  dummyBooks as baseBooks,
  dummyChapters as baseChapters,
  dummyClasses as baseClasses,
  dummyQuestions as baseQuestions,
} from "./dummy";


import {
  extraClasses,
  extraBooks,
  extraChapters,
  extraQuestions,
} from "./curriculumExtras";

export const curriculumClasses = [...baseClasses, ...extraClasses];
export const curriculumBooks = [...baseBooks, ...extraBooks];
export const curriculumChapters = [...baseChapters, ...extraChapters];
export const curriculumQuestions = [...baseQuestions, ...extraQuestions];

export function getClassById(classId) {
  return curriculumClasses.find((item) => item.id === classId) ?? null;
}

export function getBookById(bookId) {
  return curriculumBooks.find((item) => item.id === bookId) ?? null;
}

export function getChapterById(chapterId) {
  return curriculumChapters.find((item) => item.id === chapterId) ?? null;
}

export function getBooksByClassId(classId) {
  return curriculumBooks.filter((book) => book.classId === classId);
}

export function getChaptersByBookId(bookId) {
  return curriculumChapters
    .filter((chapter) => chapter.bookId === bookId)
    .sort((a, b) => a.order - b.order);
}

export function getQuestionsByChapterId(chapterId) {
  return curriculumQuestions.filter(
    (question) => question.chapterId === chapterId,
  );
}

export function getBooksCountByClassId(classId) {
  return getBooksByClassId(classId).length;
}

export function groupQuestionsByType(questions) {
  const groups = {
    mcq: [],
    short: [],
    long: [],
  };
  questions.forEach((question) => {
    if (groups[question.type]) {
      groups[question.type].push(question);
    }
  });
  return groups;
}
