/**
 * Central route path constants.
 * Browse (classes/test) and Admin (dashboard) are separate surfaces.
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",

  // Public / teacher browse + test builder
  CLASSES: "/classes",
  TEST_SUMMARY: "/test",
  classBooks: (classId) => `/classes/${classId}/books`,
  bookChapters: (classId, bookId) =>
    `/classes/${classId}/books/${bookId}/chapters`,
  chapterQuestions: (classId, bookId, chapterId) =>
    `/classes/${classId}/books/${bookId}/chapters/${chapterId}`,

  // System admin
  DASHBOARD: "/dashboard",
  ADMIN_CLASSES: "/dashboard/classes",
  ADMIN_BOOKS: "/dashboard/books",
  ADMIN_CHAPTERS: "/dashboard/chapters",
  ADMIN_QUESTIONS: "/dashboard/questions",
};
