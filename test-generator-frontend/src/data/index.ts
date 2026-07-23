/**
 * =============================================================================
 * data
 * =============================================================================
 * Dummy / mock datasets for UI development ahead of NestJS + RTK Query wiring.
 *
 * Hierarchy: Classes → Books → Chapters → Questions (mcq | short | long)
 *
 * Prefer importing from `@/data`. Do not use these fixtures in production pages
 * once live APIs are connected.
 * =============================================================================
 */

export {
  dummyClasses,
  dummyBooks,
  dummyChapters,
  dummyQuestions,
  dummyMcqQuestions,
  dummyShortQuestions,
  dummyLongQuestions,
  dummyCurriculumTree,
  getBooksByClassId,
  getChaptersByBookId,
  getQuestionsByChapterId,
  getQuestionsByType,
} from "./dummy";
