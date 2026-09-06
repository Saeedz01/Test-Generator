import { getBannerFormat } from "./bannerFormats";
import { getBannerPalette } from "./bannerPalettes";

export function createElementId() {
  return `el-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * @param {object} partial
 */
export function makeElement(partial) {
  return {
    id: createElementId(),
    type: "text",
    x: 80,
    y: 80,
    width: 400,
    height: 80,
    rotation: 0,
    locked: false,
    ...partial,
  };
}

export function createBlankDocument({
  formatId = "ig-post",
  paletteId = "olive",
  name = "Untitled banner",
} = {}) {
  const format = getBannerFormat(formatId);
  const palette = getBannerPalette(paletteId);
  return {
    id: `banner-blank-${format.id}`,
    name,
    formatId: format.id,
    width: format.width,
    height: format.height,
    paletteId: palette.id,
    background: { fillRole: "canvas" },
    elements: [],
  };
}

export function cloneDocument(doc) {
  return structuredClone(doc);
}

export function applyFormat(doc, formatId) {
  const format = getBannerFormat(formatId);
  if (format.id === doc.formatId && format.width === doc.width && format.height === doc.height) {
    return doc;
  }
  const sx = format.width / doc.width;
  const sy = format.height / doc.height;
  // Keep type size tied to the short side so Post → Story → Post (and
  // Landscape) does not shrink text. All current formats share a 1080px edge.
  const sFont =
    Math.min(format.width, format.height) / Math.min(doc.width, doc.height);
  return {
    ...doc,
    formatId: format.id,
    width: format.width,
    height: format.height,
    elements: doc.elements.map((el) => ({
      ...el,
      x: Math.round(el.x * sx),
      y: Math.round(el.y * sy),
      width: Math.round(el.width * sx),
      height: Math.round(el.height * sy),
      fontSize: el.fontSize
        ? Math.max(12, Math.round(el.fontSize * sFont))
        : el.fontSize,
    })),
  };
}

export function applyPalette(doc, paletteId) {
  return { ...doc, paletteId };
}

export function sortElements(elements) {
  return [...elements].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));
}

export function nextZ(elements) {
  return elements.reduce((max, el) => Math.max(max, el.z ?? 0), 0) + 1;
}

export function findTextBackdrop(doc, text) {
  if (!doc || !text || text.type !== "text") return null;
  const textArea = Math.max(1, text.width * text.height);
  let best = null;
  let bestArea = Infinity;
  for (const el of doc.elements) {
    if (el.type !== "shape" || el.shape === "line") continue;
    const inside =
      text.x + 2 >= el.x &&
      text.y + 2 >= el.y &&
      text.x + text.width - 2 <= el.x + el.width &&
      text.y + text.height - 2 <= el.y + el.height;
    if (!inside) continue;
    const area = el.width * el.height;
    if (area > textArea * 8) continue;
    if (area < bestArea) {
      best = el;
      bestArea = area;
    }
  }
  return best;
}
