import { box, baseDocument, push, squareBox } from "./templateHelpers";

export function createResultTemplate(formatId, paletteId = "festive") {
  const doc = baseDocument({
    formatId,
    paletteId,
    name: "Student result",
    templateId: "result",
  });
  const f = { width: doc.width, height: doc.height };

  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    radius: Math.round(doc.width * 0.18),
    ...box(f, 0.58, 0, 0.42, 0.78),
  });
  push(doc, {
    type: "shape",
    shape: "ellipse",
    fillRole: "accent",
    ...squareBox(f, 0.08, 0.04, 0.035),
  });
  push(doc, {
    type: "shape",
    shape: "ellipse",
    fillRole: "surface",
    ...squareBox(f, 0.14, 0.07, 0.022),
  });
  push(doc, {
    type: "shape",
    shape: "ellipse",
    fillRole: "accent",
    ...squareBox(f, 0.2, 0.035, 0.018),
  });
  push(doc, {
    type: "shape",
    shape: "ellipse",
    fillRole: "accentText",
    ...squareBox(f, 0.72, 0.04, 0.14),
  });
  push(doc, {
    type: "text",
    content: "TA",
    fontId: "jakarta",
    fontSize: 36,
    fontWeight: 700,
    align: "center",
    colorRole: "surface",
    ...squareBox(f, 0.72, 0.055, 0.14),
  });
  push(doc, {
    type: "text",
    content: "Congratulations to",
    fontId: "script",
    fontSize: 58,
    fontWeight: 400,
    align: "left",
    colorRole: "accent",
    ...box(f, 0.06, 0.12, 0.5, 0.09),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    radius: 18,
    ...box(f, 0.06, 0.22, 0.46, 0.08),
  });
  push(doc, {
    type: "text",
    content: "Ayesha Khan",
    fontId: "jakarta",
    fontSize: 34,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.06, 0.22, 0.46, 0.08),
  });
  push(doc, {
    type: "image",
    src: "",
    clip: "circle",
    strokeWidth: 10,
    stroke: "#d01224",
    objectFit: "cover",
    aspectLocked: true,
    placeholderLabel: "Photo",
    ...squareBox(f, 0.56, 0.22, 0.38),
  });
  push(doc, {
    type: "text",
    content: "Make your dream come true.\nWe help you build your future.",
    fontId: "jakarta",
    fontSize: 20,
    fontWeight: 500,
    align: "left",
    colorRole: "muted",
    lineHeight: 1.35,
    ...box(f, 0.06, 0.33, 0.46, 0.08),
  });
  push(doc, {
    type: "text",
    content: "Overall Band Score",
    fontId: "playfair",
    fontSize: 28,
    fontWeight: 600,
    align: "left",
    colorRole: "text",
    ...box(f, 0.06, 0.44, 0.46, 0.05),
  });
  push(doc, {
    type: "shape",
    shape: "ellipse",
    fillRole: "surface",
    ...squareBox(f, 0.08, 0.51, 0.2),
  });
  push(doc, {
    type: "text",
    content: "8.5",
    fontId: "jakarta",
    fontSize: 48,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    ...squareBox(f, 0.08, 0.51, 0.2),
  });
  push(doc, {
    type: "text",
    content: "in IELTS AC",
    fontId: "jakarta",
    fontSize: 28,
    fontWeight: 700,
    align: "left",
    colorRole: "text",
    ...box(f, 0.3, 0.56, 0.26, 0.05),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    radius: 14,
    ...box(f, 0.06, 0.74, 0.42, 0.055),
  });
  push(doc, {
    type: "text",
    content: "Private Batch Success",
    fontId: "jakarta",
    fontSize: 18,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.06, 0.74, 0.42, 0.055),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    ...box(f, 0, 0.88, 0.72, 0.12),
  });
  push(doc, {
    type: "text",
    content: "City Campus  ·  Main Boulevard\n0300-1234567",
    fontId: "jakarta",
    fontSize: 20,
    fontWeight: 600,
    align: "left",
    colorRole: "accentText",
    lineHeight: 1.35,
    ...box(f, 0.05, 0.895, 0.62, 0.09),
  });
  return doc;
}
