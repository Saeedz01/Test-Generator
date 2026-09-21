import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  visibleBookWhere,
  visibleChapterWhere,
  visibleClassWhere,
  visibleQuestionWhere,
} from 'src/common/visibility';

/** Result caps per group: enough for a results page, cheap to fetch. */
export const SEARCH_LIMITS = {
  classes: 5,
  books: 8,
  chapters: 8,
  questionsPerType: 6,
} as const;

type QuestionType = 'long' | 'short' | 'mcq';

type QuestionRow = {
  id: string;
  question_text: string;
  questionTextUr: string | null;
  chapter: {
    id: string;
    chapter_name: string;
    book: {
      id: string;
      book_name: string;
      class: { id: string; name: string } | null;
    };
  };
};

const questionSelect = {
  id: true,
  question_text: true,
  questionTextUr: true,
  chapter: {
    select: {
      id: true,
      chapter_name: true,
      book: {
        select: {
          id: true,
          book_name: true,
          class: { select: { id: true, name: true } },
        },
      },
    },
  },
} as const;

/**
 * Case-insensitive substring search over the public library. Every query is
 * bounded (take) and served by the pg_trgm GIN indexes, and all groups run
 * in parallel, so a search costs one round of small indexed queries.
 * Archived classes and deleted books (and their content) are never returned.
 */
@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(term: string) {
    const contains = { contains: term, mode: 'insensitive' as const };
    const questionWhere = {
      AND: [
        visibleQuestionWhere,
        { OR: [{ question_text: contains }, { questionTextUr: contains }] },
      ],
    };
    const questionArgs = {
      where: questionWhere,
      select: questionSelect,
      orderBy: [{ createdAt: 'asc' as const }, { id: 'asc' as const }],
      take: SEARCH_LIMITS.questionsPerType,
    };

    const [classes, books, chapters, long, short, mcq] = await Promise.all([
      this.prisma.schoolClass.findMany({
        where: { ...visibleClassWhere, name: contains },
        select: { id: true, name: true },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        take: SEARCH_LIMITS.classes,
      }),
      this.prisma.book.findMany({
        where: { ...visibleBookWhere, book_name: contains },
        select: {
          id: true,
          book_name: true,
          class: { select: { id: true, name: true } },
        },
        orderBy: { book_name: 'asc' },
        take: SEARCH_LIMITS.books,
      }),
      this.prisma.chapter.findMany({
        where: { ...visibleChapterWhere, chapter_name: contains },
        select: {
          id: true,
          chapter_name: true,
          order: true,
          book: {
            select: {
              id: true,
              book_name: true,
              class: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: [{ order: 'asc' }, { chapter_name: 'asc' }],
        take: SEARCH_LIMITS.chapters,
      }),
      this.prisma.longQuestion.findMany(questionArgs),
      this.prisma.shortQuestion.findMany(questionArgs),
      this.prisma.mcqQuestion.findMany(questionArgs),
    ]);

    const mapQuestions = (rows: QuestionRow[], type: QuestionType) =>
      rows.map((row) => ({
        id: row.id,
        type,
        text: row.question_text,
        textUr: row.questionTextUr ?? '',
        chapterId: row.chapter.id,
        chapterName: row.chapter.chapter_name,
        bookId: row.chapter.book.id,
        bookName: row.chapter.book.book_name,
        classId: row.chapter.book.class?.id ?? null,
        className: row.chapter.book.class?.name ?? null,
      }));

    return {
      query: term,
      classes,
      books: books.map((book) => ({
        id: book.id,
        name: book.book_name,
        classId: book.class?.id ?? null,
        className: book.class?.name ?? null,
      })),
      chapters: chapters.map((chapter) => ({
        id: chapter.id,
        name: chapter.chapter_name,
        order: chapter.order,
        bookId: chapter.book.id,
        bookName: chapter.book.book_name,
        classId: chapter.book.class?.id ?? null,
        className: chapter.book.class?.name ?? null,
      })),
      questions: [
        ...mapQuestions(long, 'long'),
        ...mapQuestions(short, 'short'),
        ...mapQuestions(mcq, 'mcq'),
      ],
    };
  }
}
