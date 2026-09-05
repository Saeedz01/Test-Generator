import { box, baseDocument, push } from "./templateHelpers";

export function createExamNewsTemplate(formatId, paletteId = "announce") {
  const doc = baseDocument({
    formatId,
    paletteId,
    name: "Result announcement",
    templateId: "exam-news",
  });
  const f = { width: doc.width, height: doc.height };

  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    radius: 8,
    ...box(f, 0.04, 0.04, 0.36, 0.055),
  });
  push(doc, {
    type: "text",
    content: "BREAKING NEWS",
    fontId: "jakarta",
    fontSize: 20,
    fontWeight: 800,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.04, 0.04, 0.36, 0.055),
  });
  push(doc, {
    type: "text",
    content: "BOARD 2026",
    fontId: "jakarta",
    fontSize: 64,
    fontWeight: 800,
    align: "left",
    colorRole: "text",
    ...box(f, 0.04, 0.12, 0.55, 0.1),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "accent",
    ...box(f, 0.04, 0.24, 0.55, 0.09),
  });
  push(doc, {
    type: "text",
    content: "RESULT OUT",
    fontId: "jakarta",
    fontSize: 40,
    fontWeight: 800,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.04, 0.24, 0.55, 0.09),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fill: "#1b5e20",
    ...box(f, 0.04, 0.35, 0.55, 0.09),
  });
  push(doc, {
    type: "text",
    content: "HIGH ACHIEVERS",
    fontId: "jakarta",
    fontSize: 32,
    fontWeight: 800,
    align: "center",
    colorRole: "text",
    ...box(f, 0.04, 0.35, 0.55, 0.09),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    ...box(f, 0.04, 0.46, 0.55, 0.09),
  });
  push(doc, {
    type: "text",
    content: "SESSION 2026",
    fontId: "jakarta",
    fontSize: 32,
    fontWeight: 800,
    align: "center",
    colorRole: "text",
    ...box(f, 0.04, 0.46, 0.55, 0.09),
  });
  push(doc, {
    type: "image",
    src: "",
    objectFit: "cover",
    placeholderLabel: "Students / campus",
    ...box(f, 0.6, 0.08, 0.36, 0.5),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    radius: 18,
    ...box(f, 0.04, 0.62, 0.22, 0.16),
  });
  push(doc, {
    type: "text",
    content: "Result\ndeclared",
    fontId: "jakarta",
    fontSize: 20,
    fontWeight: 700,
    align: "center",
    colorRole: "text",
    lineHeight: 1.25,
    ...box(f, 0.04, 0.64, 0.22, 0.12),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fill: "#1b5e20",
    radius: 18,
    ...box(f, 0.28, 0.62, 0.22, 0.16),
  });
  push(doc, {
    type: "text",
    content: "Merit\nlist out",
    fontId: "jakarta",
    fontSize: 20,
    fontWeight: 700,
    align: "center",
    colorRole: "text",
    lineHeight: 1.25,
    ...box(f, 0.28, 0.64, 0.22, 0.12),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "accent",
    radius: 18,
    ...box(f, 0.52, 0.62, 0.22, 0.16),
  });
  push(doc, {
    type: "text",
    content: "Join your\ndream class",
    fontId: "jakarta",
    fontSize: 18,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    lineHeight: 1.25,
    ...box(f, 0.52, 0.64, 0.22, 0.12),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    radius: 18,
    ...box(f, 0.76, 0.62, 0.2, 0.16),
  });
  push(doc, {
    type: "text",
    content: "Fair\nprocess",
    fontId: "jakarta",
    fontSize: 18,
    fontWeight: 700,
    align: "center",
    colorRole: "text",
    lineHeight: 1.25,
    ...box(f, 0.76, 0.64, 0.2, 0.12),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "accent",
    ...box(f, 0, 0.86, 1, 0.14),
  });
  push(doc, {
    type: "text",
    content: "CITY CAMPUS  ·  0300-1234567  ·  YOUR ACADEMY",
    fontId: "jakarta",
    fontSize: 22,
    fontWeight: 800,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.04, 0.89, 0.92, 0.08),
  });
  return doc;
}
