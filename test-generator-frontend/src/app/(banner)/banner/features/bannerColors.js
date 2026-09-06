import { resolveRoleColor } from "./bannerPalettes";

export function backgroundFill(doc) {
  if (doc.background?.fill) return doc.background.fill;
  return resolveRoleColor(doc.paletteId, doc.background?.fillRole, "#111111");
}

export function elementFill(el, paletteId) {
  if (el.fill === "transparent" || el.fill === "none") return "transparent";
  if (el.fill) return el.fill;
  return resolveRoleColor(paletteId, el.fillRole, "#444444");
}

export function textBoxFill(el, paletteId) {
  if (!el.fill && !el.fillRole) return null;
  return elementFill(el, paletteId);
}

export function elementColor(el, paletteId) {
  if (el.color) return el.color;
  return resolveRoleColor(paletteId, el.colorRole, "#f4f4f0");
}

export function elementStroke(el, paletteId) {
  if (el.stroke) return el.stroke;
  if (el.strokeRole) return resolveRoleColor(paletteId, el.strokeRole, "#000000");
  return "#000000";
}
