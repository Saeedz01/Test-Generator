/**
 * In-memory admin content store (frontend CRUD demo).
 * Hydrated from curriculum dummy data — swap for RTK Query later.
 */

import { createSlice, nanoid } from "@reduxjs/toolkit";
import {
  curriculumBooks,
  curriculumChapters,
  curriculumClasses,
  curriculumQuestions,
} from "@/data/curriculum";

function cloneList(list) {
  return list.map((item) => ({ ...item }));
}

const initialState = {
  classes: cloneList(curriculumClasses),
  books: cloneList(curriculumBooks),
  chapters: cloneList(curriculumChapters),
  questions: cloneList(curriculumQuestions),
};

const adminContentSlice = createSlice({
  name: "adminContent",
  initialState,
  reducers: {
    /* Classes */
    addClass: {
      reducer(state, action) {
        state.classes.push(action.payload);
      },
      prepare(data) {
        return {
          payload: {
            id: `class-${nanoid(8)}`,
            name: data.name,
            code: data.code || data.name,
            description: data.description || "",
            academicYear: data.academicYear || "2025–26",
          },
        };
      },
    },
    updateClass(state, action) {
      const { id, ...rest } = action.payload;
      const index = state.classes.findIndex((item) => item.id === id);
      if (index !== -1) state.classes[index] = { ...state.classes[index], ...rest };
    },
    deleteClass(state, action) {
      const id = action.payload;
      state.classes = state.classes.filter((item) => item.id !== id);
      state.books = state.books.filter((item) => item.classId !== id);
      state.chapters = state.chapters.filter((item) => item.classId !== id);
      state.questions = state.questions.filter((item) => item.classId !== id);
    },

    /* Books */
    addBook: {
      reducer(state, action) {
        state.books.push(action.payload);
      },
      prepare(data) {
        return {
          payload: {
            id: `book-${nanoid(8)}`,
            name: data.name,
            classId: data.classId,
            subject: data.subject || "",
            author: data.author || "",
            description: data.description || "",
            edition: data.edition || "",
          },
        };
      },
    },
    updateBook(state, action) {
      const { id, ...rest } = action.payload;
      const index = state.books.findIndex((item) => item.id === id);
      if (index !== -1) state.books[index] = { ...state.books[index], ...rest };
    },
    deleteBook(state, action) {
      const id = action.payload;
      state.books = state.books.filter((item) => item.id !== id);
      state.chapters = state.chapters.filter((item) => item.bookId !== id);
      state.questions = state.questions.filter((item) => item.bookId !== id);
    },

    /* Chapters */
    addChapter: {
      reducer(state, action) {
        state.chapters.push(action.payload);
      },
      prepare(data) {
        return {
          payload: {
            id: `ch-${nanoid(8)}`,
            name: data.name,
            classId: data.classId,
            bookId: data.bookId,
            order: Number(data.order) || 1,
            description: data.description || "",
          },
        };
      },
    },
    updateChapter(state, action) {
      const { id, ...rest } = action.payload;
      const index = state.chapters.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.chapters[index] = {
          ...state.chapters[index],
          ...rest,
          order: rest.order !== undefined ? Number(rest.order) : state.chapters[index].order,
        };
      }
    },
    deleteChapter(state, action) {
      const id = action.payload;
      state.chapters = state.chapters.filter((item) => item.id !== id);
      state.questions = state.questions.filter((item) => item.chapterId !== id);
    },

    /* Questions */
    addQuestion: {
      reducer(state, action) {
        state.questions.push(action.payload);
      },
      prepare(data) {
        const type = data.type || "mcq";
        const base = {
          id: `q-${nanoid(8)}`,
          type,
          statement: data.statement,
          classId: data.classId,
          bookId: data.bookId,
          chapterId: data.chapterId,
          difficulty: data.difficulty || "easy",
          marks: Number(data.marks) || 1,
          tags: data.tags || [],
        };
        if (type === "mcq") {
          const options = Array.isArray(data.options)
            ? data.options
            : String(data.optionsText || "")
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean);
          while (options.length < 4) options.push(`Option ${options.length + 1}`);
          return {
            payload: {
              ...base,
              options: options.slice(0, 4),
              correctOptionIndex: Number(data.correctOptionIndex) || 0,
            },
          };
        }
        return {
          payload: {
            ...base,
            sampleAnswer: data.sampleAnswer || "",
            suggestedWordCount: data.suggestedWordCount
              ? Number(data.suggestedWordCount)
              : undefined,
          },
        };
      },
    },
    updateQuestion(state, action) {
      const { id, ...rest } = action.payload;
      const index = state.questions.findIndex((item) => item.id === id);
      if (index === -1) return;
      const current = state.questions[index];
      const next = { ...current, ...rest };
      if (rest.marks !== undefined) next.marks = Number(rest.marks);
      if (rest.optionsText !== undefined) {
        const options = String(rest.optionsText)
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        while (options.length < 4) options.push(`Option ${options.length + 1}`);
        next.options = options.slice(0, 4);
        delete next.optionsText;
      }
      if (rest.correctOptionIndex !== undefined) {
        next.correctOptionIndex = Number(rest.correctOptionIndex);
      }
      state.questions[index] = next;
    },
    deleteQuestion(state, action) {
      state.questions = state.questions.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  addClass,
  updateClass,
  deleteClass,
  addBook,
  updateBook,
  deleteBook,
  addChapter,
  updateChapter,
  deleteChapter,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} = adminContentSlice.actions;

export const selectAdminClasses = (state) => state.adminContent.classes;
export const selectAdminBooks = (state) => state.adminContent.books;
export const selectAdminChapters = (state) => state.adminContent.chapters;
export const selectAdminQuestions = (state) => state.adminContent.questions;

export default adminContentSlice.reducer;
