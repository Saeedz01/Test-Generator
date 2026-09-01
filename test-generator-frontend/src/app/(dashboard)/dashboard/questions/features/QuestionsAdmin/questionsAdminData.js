export const EMPTY_MCQ_OPTIONS = ["", "", "", ""];

export const MCQ_OPTION_LABELS = ["A", "B", "C", "D"];

export const EMPTY = {
  statement: "",
  type: "mcq",
  classId: "",
  bookId: "",
  chapterId: "",
  options: [...EMPTY_MCQ_OPTIONS],
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
