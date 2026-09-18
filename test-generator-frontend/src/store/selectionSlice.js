/**
 * =============================================================================
 * store/selectionSlice.js
 * =============================================================================
 * Client selection state for the test-builder flow (class → book → chapter → questions).
 * Hydrated from localStorage on the client — never persisted to the database.
 * Reducers stay pure: storage reads/writes live in providers.jsx and
 * selectionPersistence.js.
 */

import { createSlice } from "@reduxjs/toolkit";

const emptyState = {
  selectedClass: null,
  selectedBook: null,
  selectedChapter: null,
  /** @type {Record<string, object>} */
  selectedQuestions: {},
};

// Always start empty so server and first client render match; the client
// restores localStorage via `hydrateSelection()` after mount (see providers.jsx).
// Persistence happens in `selectionPersistence.js` (store listener), not here.
const initialState = { ...emptyState, selectedQuestions: {} };

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    /** Payload: the snapshot from `loadSelectionState()` (or null). */
    hydrateSelection(state, action) {
      const stored = action.payload;
      if (!stored) return;
      state.selectedClass = stored.selectedClass;
      state.selectedBook = stored.selectedBook;
      state.selectedChapter = stored.selectedChapter;
      state.selectedQuestions = stored.selectedQuestions;
    },
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
      return { ...emptyState, selectedQuestions: {} };
    },
  },
});

export const {
  hydrateSelection,
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
