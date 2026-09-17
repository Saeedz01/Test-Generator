/**
 * =============================================================================
 * store/selectionSlice.js
 * =============================================================================
 * Client selection state for the test-builder flow (class → book → chapter → questions).
 * Hydrated from localStorage on the client — never persisted to the database.
 */

import { createSlice } from "@reduxjs/toolkit";
import {
  clearSelectionState,
  loadSelectionState,
  saveSelectionState,
} from "./selectionStorage";

const emptyState = {
  selectedClass: null,
  selectedBook: null,
  selectedChapter: null,
  /** @type {Record<string, object>} */
  selectedQuestions: {},
};

function getInitialState() {
  if (typeof window === "undefined") {
    return { ...emptyState, selectedQuestions: {} };
  }
  return loadSelectionState() ?? { ...emptyState, selectedQuestions: {} };
}

const initialState = getInitialState();

function persist(state) {
  saveSelectionState(state);
}

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    hydrateSelection(state) {
      const stored = loadSelectionState();
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
        persist(state);
        return;
      }
      state.selectedClass = next;
      state.selectedBook = null;
      state.selectedChapter = null;
      state.selectedQuestions = {};
      persist(state);
    },
    selectBook(state, action) {
      const next = action.payload;
      if (state.selectedBook?.id === next?.id) {
        state.selectedBook = next;
        persist(state);
        return;
      }
      state.selectedBook = next;
      state.selectedChapter = null;
      persist(state);
    },
    selectChapter(state, action) {
      state.selectedChapter = action.payload;
      persist(state);
    },
    toggleQuestion(state, action) {
      const question = action.payload;
      if (!question?.id) return;
      if (state.selectedQuestions[question.id]) {
        delete state.selectedQuestions[question.id];
      } else {
        state.selectedQuestions[question.id] = question;
      }
      persist(state);
    },
    selectQuestions(state, action) {
      const questions = action.payload ?? [];
      questions.forEach((question) => {
        if (question?.id) {
          state.selectedQuestions[question.id] = question;
        }
      });
      persist(state);
    },
    deselectQuestions(state, action) {
      const ids = action.payload ?? [];
      ids.forEach((id) => {
        delete state.selectedQuestions[id];
      });
      persist(state);
    },
    clearTest(state) {
      state.selectedQuestions = {};
      persist(state);
    },
    clearSelection() {
      clearSelectionState();
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
