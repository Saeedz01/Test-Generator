import { makeElement, nextZ } from "../bannerModel";
import { getBannerFormat } from "../bannerFormats";
import { getBannerPalette } from "../bannerPalettes";

export function box(format, rx, ry, rw, rh) {
  return {
    x: Math.round(rx * format.width),
    y: Math.round(ry * format.height),
    width: Math.round(rw * format.width),
    height: Math.round(rh * format.height),
  };
}

export function squareBox(format, rx, ry, size) {
  const px = Math.round(size * Math.min(format.width, format.height));
  return {
    x: Math.round(rx * format.width),
    y: Math.round(ry * format.height),
    width: px,
    height: px,
  };
}

export function baseDocument({ formatId, paletteId, name, templateId }) {
  const format = getBannerFormat(formatId);
  const palette = getBannerPalette(paletteId);
  return {
    id: `banner-${templateId}-${format.id}`,
    name,
    templateId,
    formatId: format.id,
    width: format.width,
    height: format.height,
    paletteId: palette.id,
    background: { fillRole: "canvas" },
    elements: [],
  };
}

export function push(doc, partial) {
  const z = nextZ(doc.elements);
  const id = `el-${doc.templateId || "doc"}-${doc.elements.length}`;
  doc.elements.push(makeElement({ z, ...partial, id }));
  return doc;
}
