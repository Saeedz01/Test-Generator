export const EMPTY_MCQ_OPTIONS = [
  { en: "", ur: "" },
  { en: "", ur: "" },
  { en: "", ur: "" },
  { en: "", ur: "" },
];

export const MCQ_OPTION_LABELS = ["A", "B", "C", "D"];

export const EMPTY = {
  statement: "",
  statementUr: "",
  type: "mcq",
  classId: "",
  bookId: "",
  chapterId: "",
  marks: "",
  difficulty: "medium",
  options: EMPTY_MCQ_OPTIONS.map((option) => ({ ...option })),
};

export const EMPTY_FILTERS = {
  classId: "",
  bookId: "",
  chapterId: "",
  type: "",
};

export const TYPE_LABEL = {
  mcq: "MCQ",
  short: "Short",
  long: "Long",
};

/** Rows requested per question type for each admin table page. */
export const QUESTIONS_PAGE_SIZE = 50;
