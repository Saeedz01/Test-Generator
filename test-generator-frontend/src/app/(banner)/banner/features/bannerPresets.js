import { makeElement, nextZ } from "./bannerModel";

export function createPresetElement(kind, doc) {
  const z = nextZ(doc.elements);
  const x = 80 + (doc.elements.length % 4) * 24;
  const y = 80 + (doc.elements.length % 4) * 24;
  if (kind === "heading") {
    return makeElement({
      type: "text",
      content: "Heading",
      fontId: "playfair",
      fontSize: 56,
      fontWeight: 700,
      align: "left",
      colorRole: "text",
      x,
      y,
      width: 520,
      height: 90,
      z,
    });
  }
  if (kind === "image") {
    return makeElement({
      type: "image",
      src: "",
      objectFit: "cover",
      objectPosition: "center",
      aspectLocked: true,
      placeholderLabel: "Add image",
      x,
      y,
      width: 320,
      height: 320,
      z,
    });
  }
  if (kind === "rect" || kind === "ellipse") {
    return makeElement({
      type: "shape",
      shape: kind,
      fillRole: "accent",
      x,
      y,
      width: 280,
      height: 160,
      z,
    });
  }
  return makeElement({
    type: "text",
    content: "Supporting text",
    fontId: "jakarta",
    fontSize: 28,
    fontWeight: 500,
    align: "left",
    colorRole: "muted",
    x,
    y,
    width: 480,
    height: 80,
    z,
  });
}

export function createImageElement(doc, src) {
  return makeElement({
    type: "image",
    src,
    objectFit: "cover",
    objectPosition: "center",
    aspectLocked: true,
    x: 120,
    y: 120,
    width: 360,
    height: 360,
    z: nextZ(doc.elements),
  });
}
