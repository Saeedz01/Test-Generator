/**
 * Shared domain types for the Test Generator education platform.
 * Aligned with NestJS modules: class → book → chapter → questions.
 */

/** Academic class / grade (e.g. Class 9). */
export interface SchoolClass {
  id: string;
  name: string;
  /** Short label for badges / filters */
  code: string;
  description: string;
  academicYear: string;
}

/** Textbook belonging to a class. */
export interface Book {
  id: string;
  name: string;
  classId: string;
  subject: string;
  author: string;
  edition?: string;
  description: string;
}

/** Chapter within a book. */
export interface Chapter {
  id: string;
  name: string;
  classId: string;
  bookId: string;
  /** 1-based order within the book */
  order: number;
  description: string;
}

export type QuestionType = "mcq" | "short" | "long";

export type QuestionDifficulty = "easy" | "medium" | "hard";

/** Shared fields for all question kinds. */
export interface QuestionBase {
  id: string;
  type: QuestionType;
  statement: string;
  classId: string;
  bookId: string;
  chapterId: string;
  difficulty: QuestionDifficulty;
  marks: number;
  tags: string[];
}

/** Multiple-choice question — exactly four options (matches NestJS DTO). */
export interface McqQuestion extends QuestionBase {
  type: "mcq";
  options: [string, string, string, string];
  /** Zero-based index of the correct option */
  correctOptionIndex: number;
}

/** Short-answer question. */
export interface ShortQuestion extends QuestionBase {
  type: "short";
  /** Optional sample / model answer for UI demos */
  sampleAnswer?: string;
}

/** Long / essay question. */
export interface LongQuestion extends QuestionBase {
  type: "long";
  /** Suggested word count for UI hints */
  suggestedWordCount?: number;
  sampleAnswer?: string;
}

export type Question = McqQuestion | ShortQuestion | LongQuestion;

/** Nested tree for hierarchical UI demos (sidebar, breadcrumbs). */
export interface ChapterWithQuestions extends Chapter {
  questions: Question[];
}

export interface BookWithChapters extends Book {
  chapters: ChapterWithQuestions[];
}

export interface ClassWithBooks extends SchoolClass {
  books: BookWithChapters[];
}
