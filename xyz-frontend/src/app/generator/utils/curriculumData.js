import { PCTB_CLASS_SEQUENCE } from "../data/pctb";

/**
 * @typedef {{ id: string, kind: 'mcq'|'short'|'long', text: string, options?: string[] }} ChapterQuestion
 * @typedef {{ id: string, title: string, questions: ChapterQuestion[] }} Chapter
 * @typedef {{ id: string, title: string, category?: string, textbookNote?: string, chapters: Chapter[] }} Book
 * @typedef {{ id: string, label: string, subtitle?: string, books: Book[] }} SchoolClass
 */

/**
 * Questions reference the active chapter wording so previews feel syllabus-ready.
 *
 * @param {{
 *   classId: string,
 *   bookTitle: string,
 *   chapterTitle: string,
 * }} ctx
 */
function buildChapterQuestions(ctx) {
  const key = `${ctx.classId}:${ctx.bookTitle}:${ctx.chapterTitle}`;
  const stem = `${ctx.bookTitle} — ${ctx.chapterTitle}`;

  /** @returns {ChapterQuestion[]} */
  return [
    {
      id: `${key}-mcq-laws`,
      kind: "mcq",
      text: `Inside ${stem}, which statement aligns best with the core learning outcome?`,
      options: ["It builds conceptual clarity", "It only needs rote wording", "It ignores board schemes", "It removes exercise practice"],
    },
    {
      id: `${key}-mcq-errors`,
      kind: "mcq",
      text: `Punjab board students often stumble in ${ctx.chapterTitle}. Pick the most helpful revision stance.`,
      options: ["Trace definitions + one diagram", "Memorize answers only", "Skip solved examples", "Avoid past papers entirely"],
    },
    {
      id: `${key}-short-idea`,
      kind: "short",
      text: `Summarize the big idea teachers expect after studying ${stem} in roughly 80–110 words.`,
    },
    {
      id: `${key}-short-steps`,
      kind: "short",
      text: `List three revision checkpoints you’d use before attempting long questions about ${ctx.chapterTitle}.`,
    },
    {
      id: `${key}-long-scaffold`,
      kind: "long",
      text: `Draft an exam-style elaboration (introduction, three supporting points, concluding reflection) anchored in ${stem}. Mention one Punjab-textbook cue that signals depth.`,
    },
  ];
}

function hydrateCatalog() {
  return PCTB_CLASS_SEQUENCE.map((row) => ({
    id: row.id,
    label: `${row.label} · PCTB stream`,
    subtitle: row.subtitle,
    books: row.books.map((book) => ({
      id: book.id,
      title: book.title,
      category: book.category ?? "General",
      textbookNote: book.textbookNote,
      chapters: book.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        questions: buildChapterQuestions({
          classId: row.id,
          bookTitle: book.title,
          chapterTitle: chapter.title,
        }),
      })),
    })),
  }));
}

/** @type {SchoolClass[]} */
const CLASSES_RAW = hydrateCatalog();

const CLASS_MAP = Object.fromEntries(CLASSES_RAW.map((item) => [item.id, item]));

/** Quick metrics for animated hero ribbons. */
export function getCatalogStats() {
  let books = 0;
  let chapters = 0;
  /** @type {Set<string>} */
  const buckets = new Set();

  CLASSES_RAW.forEach((klass) => {
    klass.books.forEach((book) => {
      books += 1;
      buckets.add(book.category ?? "General");
      book.chapters.forEach((chapter) => {
        chapters += 1;
      });
    });
  });

  return {
    gradeSpan: `${CLASSES_RAW[0]?.label ?? "VIII"} ⟶ ${CLASSES_RAW.at(-1)?.label ?? "Inter"}`,
    classes: CLASSES_RAW.length,
    books,
    chapters,
    subjectBuckets: buckets.size,
    boardLabel: "Punjab Curriculum & Textbook Board (PCTB)",
  };
}

/** @returns {SchoolClass[]} */
export function listClasses() {
  return CLASSES_RAW;
}

/** @param {string} classId */
export function getClass(classId) {
  return CLASS_MAP[classId];
}

/** @param {string} classId @param {string} bookId */
export function getBook(classId, bookId) {
  return getClass(classId)?.books.find((candidate) => candidate.id === bookId);
}

/** @param {string} classId @param {string} bookId @param {string} chapterId */
export function getChapter(classId, bookId, chapterId) {
  return getBook(classId, bookId)?.chapters.find((chapter) => chapter.id === chapterId);
}
