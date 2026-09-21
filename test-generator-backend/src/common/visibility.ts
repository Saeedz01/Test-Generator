import type { Prisma } from '@prisma/client';

/**
 * What public (non-staff) readers may see. Content is hidden when its class
 * is archived or its book is soft-deleted, and everything below it inherits
 * that: a chapter is visible only through a visible book, a question only
 * through a visible chapter. Every public read path builds on these filters.
 */
export const visibleClassWhere = {
  isArchived: false,
} satisfies Prisma.SchoolClassWhereInput;

export const visibleBookWhere = {
  deletedAt: null,
  class: { is: visibleClassWhere },
} satisfies Prisma.BookWhereInput;

export const visibleChapterWhere = {
  book: { is: visibleBookWhere },
} satisfies Prisma.ChapterWhereInput;

/** Same shape for long, short and MCQ questions. */
export const visibleQuestionWhere = {
  chapter: { is: visibleChapterWhere },
} satisfies Prisma.LongQuestionWhereInput;
