/** Combined demo question collections. */

import { mcqs } from "./dummyMcqs";
import { shortQuestions } from "./dummyShortQuestions";
import { longQuestions } from "./dummyLongQuestions";

export const dummyQuestions = [
  ...mcqs,
  ...shortQuestions,
  ...longQuestions,
];

export const dummyMcqQuestions = mcqs;
export const dummyShortQuestions = shortQuestions;
export const dummyLongQuestions = longQuestions;
