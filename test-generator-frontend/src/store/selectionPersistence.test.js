import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { makeStore } from "./index";
import {
  clearSelection,
  clearTest,
  hydrateSelection,
  selectClass,
  toggleQuestion,
} from "./selectionSlice";
import { loadSelectionState } from "./selectionStorage";

const KEY = "testora_selection_v1";

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  };
}

describe("selection persistence", () => {
  beforeEach(() => {
    globalThis.window = { localStorage: memoryStorage() };
  });
  afterEach(() => {
    delete globalThis.window;
  });

  it("starts empty regardless of storage (no hydration mismatch)", () => {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ selectedClass: { id: "c1" }, selectedQuestions: {} }),
    );
    const store = makeStore();
    expect(store.getState().selection.selectedClass).toBeNull();

    store.dispatch(hydrateSelection(loadSelectionState()));
    expect(store.getState().selection.selectedClass).toEqual({ id: "c1" });
  });

  it("does not write before hydration, then mirrors every change", () => {
    const store = makeStore();
    store.dispatch(selectClass({ id: "early" }));
    expect(window.localStorage.getItem(KEY)).toBeNull();

    store.dispatch(hydrateSelection(null));
    store.dispatch(selectClass({ id: "c2" }));
    store.dispatch(toggleQuestion({ id: "q1", marks: 2 }));
    expect(loadSelectionState()).toMatchObject({
      selectedClass: { id: "c2" },
      selectedQuestions: { q1: { id: "q1", marks: 2 } },
    });

    store.dispatch(clearTest());
    expect(loadSelectionState().selectedQuestions).toEqual({});
    expect(loadSelectionState().selectedClass).toEqual({ id: "c2" });

    store.dispatch(clearSelection());
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });
});
