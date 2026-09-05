/**
 * localStorage drafts and last-used style for Banner Designer (this browser only).
 */

const STORAGE_KEY = "testora_banner_drafts";
const STYLE_KEY = "testora_banner_last_style";
const CHANGED_EVENT = "testora-banners-changed";
const MAX_DRAFTS = 12;
const MAX_CHARS = 4_000_000;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notify() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CHANGED_EVENT));
}

export function subscribeBannerDrafts(onChange) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange();
  window.addEventListener(CHANGED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function loadBannerDrafts() {
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

function persist(drafts) {
  if (!canUseStorage()) return { ok: false, error: "Storage unavailable" };
  const serialized = JSON.stringify(drafts);
  if (serialized.length > MAX_CHARS) {
    return {
      ok: false,
      error: "This banner is too large to save locally. Export a PNG instead.",
    };
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, serialized);
    notify();
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Could not save. Photos may be too large for this browser.",
    };
  }
}

function createSaveId() {
  return `banner-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function isFreshTemplateId(id) {
  return typeof id === "string" && /^banner-(blank|result|class-result|admission|toppers|advertise|exam-news|admission-flyer)-/.test(id);
}

function withoutPhotos(doc) {
  return {
    ...doc,
    elements: (doc.elements || []).map((el) =>
      el.type === "image" ? { ...el, src: "" } : el,
    ),
  };
}

export function saveBannerDraft(doc) {
  const id = !doc.id || isFreshTemplateId(doc.id) ? createSaveId() : doc.id;
  const record = {
    ...doc,
    id,
    updatedAt: Date.now(),
  };
  const rest = loadBannerDrafts().filter((item) => item.id !== id);
  let result = persist([record, ...rest].slice(0, MAX_DRAFTS));
  let photosSaved = true;
  if (!result.ok) {
    const stripped = withoutPhotos(record);
    result = persist([stripped, ...rest].slice(0, MAX_DRAFTS));
    photosSaved = false;
    if (result.ok) {
      result.error =
        "Saved without photos — they were too large for this browser.";
    }
  }
  return { ...result, doc: record, photosSaved };
}

export function deleteBannerDraft(id) {
  return persist(loadBannerDrafts().filter((item) => item.id !== id));
}

export function getBannerDraft(id) {
  return loadBannerDrafts().find((item) => item.id === id) ?? null;
}

export function saveLastStyle(style) {
  if (!canUseStorage() || !style) return { ok: false };
  try {
    window.localStorage.setItem(STYLE_KEY, JSON.stringify(style));
    notify();
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export function loadLastStyle() {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STYLE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
