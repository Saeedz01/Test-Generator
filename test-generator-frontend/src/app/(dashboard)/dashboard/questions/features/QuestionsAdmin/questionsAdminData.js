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
