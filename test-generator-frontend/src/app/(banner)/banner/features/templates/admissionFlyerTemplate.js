import { box, baseDocument, push, squareBox } from "./templateHelpers";

export function createAdmissionFlyerTemplate(formatId, paletteId = "royal") {
  const doc = baseDocument({
    formatId,
    paletteId,
    name: "Admission flyer",
    templateId: "admission-flyer",
  });
  const f = { width: doc.width, height: doc.height };

  push(doc, {
    type: "image",
    src: "",
    objectFit: "cover",
    placeholderLabel: "Class photo",
    ...box(f, 0, 0, 1, 0.28),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    ...box(f, 0, 0.28, 0.55, 0.6),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "accent",
    ...box(f, 0.55, 0.28, 0.45, 0.6),
  });
  push(doc, {
    type: "text",
    content: "SCHOOL ADMISSION",
    fontId: "jakarta",
    fontSize: 36,
    fontWeight: 800,
    align: "left",
    colorRole: "accentText",
    ...box(f, 0.04, 0.31, 0.48, 0.07),
  });
  push(doc, {
    type: "text",
    content: "OPEN FOR 2026",
    fontId: "jakarta",
    fontSize: 22,
    fontWeight: 600,
    align: "left",
    colorRole: "accent",
    ...box(f, 0.04, 0.38, 0.48, 0.045),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "accent",
    radius: 8,
    ...box(f, 0.04, 0.45, 0.28, 0.045),
  });
  push(doc, {
    type: "text",
    content: "FOCUS SKILL",
    fontId: "jakarta",
    fontSize: 16,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.04, 0.45, 0.28, 0.045),
  });
  push(doc, {
    type: "text",
    content:
      "•  Board prep & design\n•  Concept classes\n•  Weekly tests\n•  Result coaching",
    fontId: "jakarta",
    fontSize: 20,
    fontWeight: 500,
    align: "left",
    colorRole: "accentText",
    lineHeight: 1.45,
    ...box(f, 0.04, 0.51, 0.46, 0.2),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    ...box(f, 0.6, 0.32, 0.35, 0.1),
  });
  push(doc, {
    type: "text",
    content: "50% OFF\nbefore 1 Sept",
    fontId: "jakarta",
    fontSize: 26,
    fontWeight: 800,
    align: "center",
    colorRole: "accentText",
    lineHeight: 1.15,
    ...box(f, 0.6, 0.32, 0.35, 0.1),
  });
  push(doc, {
    type: "text",
    content: "SCHOOL REWARD",
    fontId: "jakarta",
    fontSize: 18,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.58, 0.45, 0.38, 0.04),
  });
  push(doc, {
    type: "text",
    content: "• Best teaching 2025\n• High board results\n• Focused classrooms",
    fontId: "jakarta",
    fontSize: 18,
    fontWeight: 500,
    align: "left",
    colorRole: "accentText",
    lineHeight: 1.4,
    ...box(f, 0.58, 0.5, 0.38, 0.14),
  });
  push(doc, {
    type: "image",
    src: "",
    clip: "circle",
    objectFit: "cover",
    placeholderLabel: "Photo",
    ...squareBox(f, 0.48, 0.62, 0.16),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fill: "#c62128",
    radius: 12,
    ...box(f, 0.18, 0.78, 0.64, 0.08),
  });
  push(doc, {
    type: "text",
    content: "REGISTER NOW",
    fontId: "jakarta",
    fontSize: 28,
    fontWeight: 800,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.18, 0.78, 0.64, 0.08),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fill: "#c62128",
    ...box(f, 0, 0.88, 1, 0.12),
  });
  push(doc, {
    type: "text",
    content: "YOUR ACADEMY     0300-1234567     hello@academy.com",
    fontId: "jakarta",
    fontSize: 18,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.04, 0.91, 0.92, 0.07),
  });
  return doc;
}
