/**
 * localStorage helpers for PDF test settings + institute history.
 * Frontend-only — replace with user preferences API later.
 */

const SETTINGS_KEY = "tg_test_settings";
const INSTITUTES_KEY = "tg_institutes";

export const DEFAULT_TEST_SETTINGS = {
  timeAllowed: "1 hour 30 minutes",
  mcqMarks: 1,
  shortMarks: 2,
  longMarks: 5,
  lastInstitute: "",
  copiesPerPage: 1,
  /** Institute / title size in px (matches PDF default). */
  headingFontSize: 18,
  /** Body / question / meta size in px (matches PDF default). */
  subtextFontSize: 12,
};

function clampFontSize(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(48, Math.max(8, Math.round(n)));
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadTestSettings() {
  if (!canUseStorage()) return { ...DEFAULT_TEST_SETTINGS };
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_TEST_SETTINGS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_TEST_SETTINGS,
      ...parsed,
      mcqMarks: Number(parsed.mcqMarks) || DEFAULT_TEST_SETTINGS.mcqMarks,
      shortMarks: Number(parsed.shortMarks) || DEFAULT_TEST_SETTINGS.shortMarks,
      longMarks: Number(parsed.longMarks) || DEFAULT_TEST_SETTINGS.longMarks,
      timeAllowed: parsed.timeAllowed || DEFAULT_TEST_SETTINGS.timeAllowed,
      lastInstitute:
        typeof parsed.lastInstitute === "string" ? parsed.lastInstitute : "",
      copiesPerPage: [1, 2, 4].includes(Number(parsed.copiesPerPage))
        ? Number(parsed.copiesPerPage)
        : DEFAULT_TEST_SETTINGS.copiesPerPage,
      headingFontSize: clampFontSize(
        parsed.headingFontSize,
        DEFAULT_TEST_SETTINGS.headingFontSize,
      ),
      subtextFontSize: clampFontSize(
        parsed.subtextFontSize,
        DEFAULT_TEST_SETTINGS.subtextFontSize,
      ),
    };
  } catch {
    return { ...DEFAULT_TEST_SETTINGS };
  }
}

export function saveTestSettings(settings) {
  if (!canUseStorage()) return;
  const payload = {
    timeAllowed: String(settings.timeAllowed ?? "").trim(),
    mcqMarks: Number(settings.mcqMarks) || DEFAULT_TEST_SETTINGS.mcqMarks,
    shortMarks: Number(settings.shortMarks) || DEFAULT_TEST_SETTINGS.shortMarks,
    longMarks: Number(settings.longMarks) || DEFAULT_TEST_SETTINGS.longMarks,
    lastInstitute: String(settings.lastInstitute ?? "").trim(),
    copiesPerPage: [1, 2, 4].includes(Number(settings.copiesPerPage))
      ? Number(settings.copiesPerPage)
      : DEFAULT_TEST_SETTINGS.copiesPerPage,
    headingFontSize: clampFontSize(
      settings.headingFontSize,
      DEFAULT_TEST_SETTINGS.headingFontSize,
    ),
    subtextFontSize: clampFontSize(
      settings.subtextFontSize,
      DEFAULT_TEST_SETTINGS.subtextFontSize,
    ),
  };
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
}

export function loadInstitutes() {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(INSTITUTES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((name) => String(name).trim())
      .filter(Boolean)
      .filter((name, index, list) => list.indexOf(name) === index);
  } catch {
    return [];
  }
}

/**
 * Ensures institute is stored in history and becomes last selected.
 * @param {string} instituteName
 * @returns {string[]}
 */
export function rememberInstitute(instituteName) {
  const name = String(instituteName ?? "").trim();
  const current = loadInstitutes();
  if (!name) return current;

  const next = [name, ...current.filter((item) => item !== name)];
  if (canUseStorage()) {
    window.localStorage.setItem(INSTITUTES_KEY, JSON.stringify(next));
  }
  return next;
}

/**
 * Apply user-defined marks by question type and compute total.
 * @param {object[]} questions
 * @param {{ mcqMarks: number, shortMarks: number, longMarks: number }} marksConfig
 */
export function applyMarksConfig(questions, marksConfig) {
  const byType = {
    mcq: Number(marksConfig.mcqMarks) || 0,
    short: Number(marksConfig.shortMarks) || 0,
    long: Number(marksConfig.longMarks) || 0,
  };

  const scored = questions.map((question) => ({
    ...question,
    marks: byType[question.type] ?? (Number(question.marks) || 0),
  }));

  const totalMarks = scored.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
  const counts = {
    mcq: scored.filter((q) => q.type === "mcq").length,
    short: scored.filter((q) => q.type === "short").length,
    long: scored.filter((q) => q.type === "long").length,
  };

  return { scored, totalMarks, counts };
}
