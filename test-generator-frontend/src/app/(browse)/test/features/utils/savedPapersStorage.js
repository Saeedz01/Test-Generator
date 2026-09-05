/**
 * localStorage history of generated test papers (this browser only).
 */

const STORAGE_KEY = "testora_saved_papers";
const CHANGED_EVENT = "testora-papers-changed";
const MAX_PAPERS = 20;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notify() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CHANGED_EVENT));
}

export function subscribeSavedPapers(onChange) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange();
  window.addEventListener(CHANGED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function loadSavedPapers() {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(papers) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
  notify();
}

/**
 * @param {{ meta: object, questions: object[] }} paper
 */
export function saveGeneratedPaper({ meta, questions }) {
  if (!questions?.length) return null;

  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    instituteName: meta?.instituteName || "",
    className: meta?.className || "",
    bookName: meta?.bookName || "",
    chapterName: meta?.chapterName || "",
    questionCount: questions.length,
    totalMarks: Number(meta?.totalMarks) || 0,
    meta,
    questions,
  };

  const next = [record, ...loadSavedPapers()].slice(0, MAX_PAPERS);
  persist(next);
  return record;
}

export function deleteSavedPaper(id) {
  persist(loadSavedPapers().filter((paper) => paper.id !== id));
}

export function getSavedPaper(id) {
  return loadSavedPapers().find((paper) => paper.id === id) ?? null;
}

export function paperLabel(paper) {
  const parts = [paper.className, paper.chapterName || paper.bookName].filter(
    Boolean,
  );
  return parts.join(" · ") || "Untitled paper";
}

export function paperDateLabel(createdAt) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(createdAt));
  } catch {
    return "";
  }
}
