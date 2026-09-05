import { resolveRoleColor } from "./bannerPalettes";

export function backgroundFill(doc) {
  if (doc.background?.fill) return doc.background.fill;
  return resolveRoleColor(doc.paletteId, doc.background?.fillRole, "#111111");
}

export function elementFill(el, paletteId) {
  if (el.fill) return el.fill;
  return resolveRoleColor(paletteId, el.fillRole, "#444444");
}

export function elementColor(el, paletteId) {
  if (el.color) return el.color;
  return resolveRoleColor(paletteId, el.colorRole, "#f4f4f0");
}
