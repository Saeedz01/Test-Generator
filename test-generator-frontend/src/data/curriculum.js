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

const extraClasses = [
  {
    id: "class-ics",
    name: "ICS",
    code: "ICS",
    description: "Intermediate Computer Science group.",
    academicYear: "2025–26",
  },
  {
    id: "class-icom",
    name: "ICOM",
    code: "ICOM",
    description: "Intermediate Commerce group.",
    academicYear: "2025–26",
  },
  {
    id: "class-fa",
    name: "FA",
    code: "FA",
    description: "Intermediate Arts & humanities group.",
    academicYear: "2025–26",
  },
];

const extraBooks = [
  {
    id: "book-ics-cs",
    name: "Computer Science Essentials",
    classId: "class-ics",
    subject: "Computer Science",
    author: "Tech Education Board",
    description: "Programming fundamentals and databases.",
  },
  {
    id: "book-ics-math",
    name: "ICS Mathematics",
    classId: "class-ics",
    subject: "Mathematics",
    author: "MathWorks Press",
    description: "Algebra and calculus for ICS.",
  },
  {
    id: "book-icom-acct",
    name: "Principles of Accounting",
    classId: "class-icom",
    subject: "Accounting",
    author: "Commerce Series",
    description: "Journal entries, ledgers, and trial balance.",
  },
  {
    id: "book-icom-biz",
    name: "Business Studies",
    classId: "class-icom",
    subject: "Business",
    author: "Commerce Series",
    description: "Organization, marketing, and finance basics.",
  },
  {
    id: "book-fa-eng",
    name: "English Literature",
    classId: "class-fa",
    subject: "English",
    author: "Arts Series",
    description: "Prose, poetry, and critical reading.",
  },
  {
    id: "book-fa-hist",
    name: "World History",
    classId: "class-fa",
    subject: "History",
    author: "Arts Series",
    description: "Modern world and regional history themes.",
  },
];

const extraChapters = [
  {
    id: "ch-ics-cs-1",
    name: "Introduction to Programming",
    classId: "class-ics",
    bookId: "book-ics-cs",
    order: 1,
    description: "Variables, control flow, and problem solving.",
  },
  {
    id: "ch-ics-cs-2",
    name: "Databases",
    classId: "class-ics",
    bookId: "book-ics-cs",
    order: 2,
    description: "Tables, keys, and simple queries.",
  },
  {
    id: "ch-ics-math-1",
    name: "Functions",
    classId: "class-ics",
    bookId: "book-ics-math",
    order: 1,
    description: "Domain, range, and graphs.",
  },
  {
    id: "ch-icom-acct-1",
    name: "Journal Entries",
    classId: "class-icom",
    bookId: "book-icom-acct",
    order: 1,
    description: "Debit, credit, and double-entry basics.",
  },
  {
    id: "ch-icom-biz-1",
    name: "Forms of Business",
    classId: "class-icom",
    bookId: "book-icom-biz",
    order: 1,
    description: "Sole proprietorship, partnership, company.",
  },
  {
    id: "ch-fa-eng-1",
    name: "Poetry Appreciation",
    classId: "class-fa",
    bookId: "book-fa-eng",
    order: 1,
    description: "Themes, imagery, and structure.",
  },
  {
    id: "ch-fa-hist-1",
    name: "Industrial Revolution",
    classId: "class-fa",
    bookId: "book-fa-hist",
    order: 1,
    description: "Causes, effects, and social change.",
  },
];

const extraQuestions = [
  {
    id: "q-mcq-ics-1",
    type: "mcq",
    statement: "Which symbol starts a single-line comment in many C-style languages?",
    classId: "class-ics",
    bookId: "book-ics-cs",
    chapterId: "ch-ics-cs-1",
    difficulty: "easy",
    marks: 1,
    tags: ["programming"],
    options: ["//", "/* only", "#", "--"],
    correctOptionIndex: 0,
  },
  {
    id: "q-short-ics-1",
    type: "short",
    statement: "Define a primary key in a relational database.",
    classId: "class-ics",
    bookId: "book-ics-cs",
    chapterId: "ch-ics-cs-2",
    difficulty: "easy",
    marks: 2,
    tags: ["databases"],
    sampleAnswer: "A unique identifier for each row in a table.",
  },
  {
    id: "q-long-ics-1",
    type: "long",
    statement:
      "Explain the difference between a compiler and an interpreter with examples.",
    classId: "class-ics",
    bookId: "book-ics-cs",
    chapterId: "ch-ics-cs-1",
    difficulty: "medium",
    marks: 5,
    tags: ["programming"],
    suggestedWordCount: 150,
  },
  {
    id: "q-mcq-icom-1",
    type: "mcq",
    statement: "In double-entry accounting, every debit has a corresponding:",
    classId: "class-icom",
    bookId: "book-icom-acct",
    chapterId: "ch-icom-acct-1",
    difficulty: "easy",
    marks: 1,
    tags: ["accounting"],
    options: ["Asset", "Credit", "Expense only", "Owner equity only"],
    correctOptionIndex: 1,
  },
  {
    id: "q-short-icom-1",
    type: "short",
    statement: "Name two advantages of a partnership business.",
    classId: "class-icom",
    bookId: "book-icom-biz",
    chapterId: "ch-icom-biz-1",
    difficulty: "easy",
    marks: 2,
    tags: ["business"],
  },
  {
    id: "q-long-icom-1",
    type: "long",
    statement:
      "Describe the process of recording a cash purchase in the journal with an example.",
    classId: "class-icom",
    bookId: "book-icom-acct",
    chapterId: "ch-icom-acct-1",
    difficulty: "medium",
    marks: 5,
    tags: ["accounting"],
    suggestedWordCount: 140,
  },
  {
    id: "q-mcq-fa-1",
    type: "mcq",
    statement: "Imagery in poetry primarily appeals to the reader’s:",
    classId: "class-fa",
    bookId: "book-fa-eng",
    chapterId: "ch-fa-eng-1",
    difficulty: "easy",
    marks: 1,
    tags: ["literature"],
    options: ["Senses", "Bank balance", "Hardware", "Statistics"],
    correctOptionIndex: 0,
  },
  {
    id: "q-short-fa-1",
    type: "short",
    statement: "List two major effects of the Industrial Revolution on society.",
    classId: "class-fa",
    bookId: "book-fa-hist",
    chapterId: "ch-fa-hist-1",
    difficulty: "medium",
    marks: 2,
    tags: ["history"],
  },
  {
    id: "q-long-fa-1",
    type: "long",
    statement:
      "Write a critical appreciation of how imagery strengthens meaning in a poem you have studied.",
    classId: "class-fa",
    bookId: "book-fa-eng",
    chapterId: "ch-fa-eng-1",
    difficulty: "hard",
    marks: 5,
    tags: ["literature"],
    suggestedWordCount: 180,
  },
];

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
