/**
 * Central route path constants for the test-builder flow.
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  CLASSES: "/dashboard/classes",
  TEST_SUMMARY: "/dashboard/test",
  classBooks: (classId) => `/dashboard/classes/${classId}/books`,
  bookChapters: (classId, bookId) =>
    `/dashboard/classes/${classId}/books/${bookId}/chapters`,
  chapterQuestions: (classId, bookId, chapterId) =>
    `/dashboard/classes/${classId}/books/${bookId}/chapters/${chapterId}/questions`,
  // Legacy flat paths (kept for older links)
  QUESTIONS: "/dashboard/questions",
  BOOKS: "/dashboard/books",
  CHAPTERS: "/dashboard/chapters",
};
