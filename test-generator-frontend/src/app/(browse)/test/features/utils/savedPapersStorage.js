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

/**
 * Raw stored JSON (a stable string) for `useSyncExternalStore` snapshots.
 * @returns {string | null}
 */
export function getSavedPapersSnapshot() {
  if (!canUseStorage()) return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** @param {string | null} raw */
export function parseSavedPapers(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadSavedPapers() {
  return parseSavedPapers(getSavedPapersSnapshot());
}

function isQuotaError(error) {
  return (
    error?.name === "QuotaExceededError" ||
    error?.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    error?.code === 22 ||
    error?.code === 1014
  );
}

/**
 * Writes the list; when storage is full, drops the oldest papers and retries.
 * `keepAtLeast` papers (newest first) must fit or the write fails.
 * @returns {boolean} whether the list was stored
 */
function persist(papers, keepAtLeast = 0) {
  if (!canUseStorage()) return false;
  let list = papers;
  for (;;) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      notify();
      return true;
    } catch (error) {
      if (!isQuotaError(error) || list.length <= keepAtLeast) {
        return false;
      }
      list = list.slice(0, -1);
    }
  }
}

/**
 * @param {{ meta: object, questions: object[] }} paper
 * @returns {object | null} the saved record, or null if it could not be stored
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
  return persist(next, 1) ? record : null;
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
