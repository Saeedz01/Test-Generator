import { CLASS_8_BOOKS } from "./class8";
import { CLASS_9_BOOKS, CLASS_10_BOOKS } from "./class910";
import { CLASS_11_BOOKS, CLASS_12_BOOKS } from "./class1112";

/**
 * Canonical catalog rows used by curriculumData (titles align with Punjab board streams).
 */

export const PCTB_CLASS_SEQUENCE = [
  {
    id: "8",
    label: "Grade VIII",
    subtitle: "Middle school (PCTB general stream)",
    books: CLASS_8_BOOKS,
  },
  {
    id: "9",
    label: "Grade IX",
    subtitle: "Matric Part I textbooks",
    books: CLASS_9_BOOKS,
  },
  {
    id: "10",
    label: "Grade X",
    subtitle: "Matric Part II textbooks",
    books: CLASS_10_BOOKS,
  },
  {
    id: "11",
    label: "1st Year (Inter I)",
    subtitle: "F.Sc / FA collegiate Part I titles",
    books: CLASS_11_BOOKS,
  },
  {
    id: "12",
    label: "2nd Year (Inter II)",
    subtitle: "F.Sc / FA collegiate Part II titles",
    books: CLASS_12_BOOKS,
  },
];
