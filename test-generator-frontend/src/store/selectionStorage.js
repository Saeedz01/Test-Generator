/**
 * Client-only persistence for temporary teacher selection (class/book/chapter/questions).
 * Do not send this to the backend.
 */

const STORAGE_KEY = "testora_selection_v1";

function canUseStorage() {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

export function loadSelectionState() {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      selectedClass: parsed.selectedClass ?? null,
      selectedBook: parsed.selectedBook ?? null,
      selectedChapter: parsed.selectedChapter ?? null,
      selectedQuestions:
        parsed.selectedQuestions && typeof parsed.selectedQuestions === "object"
          ? parsed.selectedQuestions
          : {},
    };
  } catch {
    return null;
  }
}

export function saveSelectionState(state) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedClass: state.selectedClass ?? null,
        selectedBook: state.selectedBook ?? null,
        selectedChapter: state.selectedChapter ?? null,
        selectedQuestions: state.selectedQuestions ?? {},
      }),
    );
  } catch {
    // ignore quota / private mode errors
  }
}

export function clearSelectionState() {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
