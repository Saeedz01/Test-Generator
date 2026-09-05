/**
 * =============================================================================
 * store/selectionSlice.js
 * =============================================================================
 * Client selection state for the test-builder flow (class → book → chapter → questions).
 * Plain JS — swap hydration source to RTK Query later without changing consumers.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedClass: null,
  selectedBook: null,
  selectedChapter: null,
  /** @type {Record<string, object>} */
  selectedQuestions: {},
};

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    selectClass(state, action) {
      const next = action.payload;
      if (state.selectedClass?.id === next?.id) {
        state.selectedClass = next;
        return;
      }
      state.selectedClass = next;
      state.selectedBook = null;
      state.selectedChapter = null;
      state.selectedQuestions = {};
    },
    selectBook(state, action) {
      const next = action.payload;
      if (state.selectedBook?.id === next?.id) {
        state.selectedBook = next;
        return;
      }
      state.selectedBook = next;
      state.selectedChapter = null;
    },
    selectChapter(state, action) {
      state.selectedChapter = action.payload;
    },
    toggleQuestion(state, action) {
      const question = action.payload;
      if (!question?.id) return;
      if (state.selectedQuestions[question.id]) {
        delete state.selectedQuestions[question.id];
      } else {
        state.selectedQuestions[question.id] = question;
      }
    },
    selectQuestions(state, action) {
      const questions = action.payload ?? [];
      questions.forEach((question) => {
        if (question?.id) {
          state.selectedQuestions[question.id] = question;
        }
      });
    },
    deselectQuestions(state, action) {
      const ids = action.payload ?? [];
      ids.forEach((id) => {
        delete state.selectedQuestions[id];
      });
    },
    clearTest(state) {
      state.selectedQuestions = {};
    },
    clearSelection() {
      return initialState;
    },
  },
});

export const {
  selectClass,
  selectBook,
  selectChapter,
  toggleQuestion,
  selectQuestions,
  deselectQuestions,
  clearTest,
  clearSelection,
} = selectionSlice.actions;

export const selectSelectedClass = (state) => state.selection.selectedClass;
export const selectSelectedBook = (state) => state.selection.selectedBook;
export const selectSelectedChapter = (state) => state.selection.selectedChapter;
export const selectSelectedQuestionsMap = (state) =>
  state.selection.selectedQuestions;
export const selectSelectedQuestionsList = (state) =>
  Object.values(state.selection.selectedQuestions);
export const selectSelectedQuestionCount = (state) =>
  Object.keys(state.selection.selectedQuestions).length;
export const selectTotalMarks = (state) =>
  Object.values(state.selection.selectedQuestions).reduce(
    (sum, q) => sum + (Number(q.marks) || 0),
    0,
  );
export const selectIsQuestionSelected = (id) => (state) =>
  Boolean(state.selection.selectedQuestions[id]);
export const selectSelectedChapterCount = (state) => {
  const ids = new Set(
    Object.values(state.selection.selectedQuestions)
      .map((question) => question.chapterId)
      .filter(Boolean),
  );
  return ids.size;
};

export default selectionSlice.reducer;
