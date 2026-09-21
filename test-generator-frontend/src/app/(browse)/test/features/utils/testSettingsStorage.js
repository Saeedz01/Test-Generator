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
  /** Institute / title size in px (one paper per page default). */
  headingFontSize: 22,
  /** Body / question / meta size in px (one paper per page default). */
  subtextFontSize: 14,
  /** Paper medium: en | ur | both */
  paperLanguage: "en",
  /** Show institute / student fields / summary badges on the paper */
  showPaperHeader: true,
};

function clampFontSize(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(48, Math.max(8, Math.round(n)));
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** True for the various "storage is full" errors browsers throw. */
function isQuotaError(error) {
  return (
    error?.name === "QuotaExceededError" ||
    error?.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    error?.code === 22 ||
    error?.code === 1014
  );
}

/**
 * Writes JSON to localStorage without throwing. Storage can be full (saved
 * banners and papers share the same quota) or blocked entirely (private
 * windows, blocked site data).
 */
function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: isQuotaError(error) ? "full" : "unavailable" };
  }
}

/** User-facing explanation for a failed save. */
export function storageErrorMessage(reason) {
  return reason === "full"
    ? "Your browser storage is full, so these settings were not saved for next time. Your paper is unaffected. To fix it, delete some saved papers or banners from this device."
    : "Your browser is not allowing this site to save data, so these settings were not saved for next time. Your paper is unaffected. Private browsing and blocked site data are the usual causes.";
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
      paperLanguage: ["en", "ur", "both"].includes(parsed.paperLanguage)
        ? parsed.paperLanguage
        : DEFAULT_TEST_SETTINGS.paperLanguage,
      showPaperHeader:
        typeof parsed.showPaperHeader === "boolean"
          ? parsed.showPaperHeader
          : DEFAULT_TEST_SETTINGS.showPaperHeader,
    };
  } catch {
    return { ...DEFAULT_TEST_SETTINGS };
  }
}

/**
 * Persists the settings for next time.
 * @returns {{ ok: boolean, reason?: "unavailable"|"full" }} Never throws:
 * the caller warns the user and carries on generating the paper.
 */
export function saveTestSettings(settings) {
  if (!canUseStorage()) return { ok: false, reason: "unavailable" };
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
    paperLanguage: ["en", "ur", "both"].includes(settings.paperLanguage)
      ? settings.paperLanguage
      : DEFAULT_TEST_SETTINGS.paperLanguage,
    showPaperHeader:
      typeof settings.showPaperHeader === "boolean"
        ? settings.showPaperHeader
        : DEFAULT_TEST_SETTINGS.showPaperHeader,
  };
  return writeStorage(SETTINGS_KEY, payload);
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
    // Best effort: a failed save is reported by saveTestSettings().
    writeStorage(INSTITUTES_KEY, next);
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
