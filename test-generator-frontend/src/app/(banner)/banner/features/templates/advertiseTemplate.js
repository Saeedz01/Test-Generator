import { box, baseDocument, push, squareBox } from "./templateHelpers";

const FEATURES = [
  "Online Registration",
  "Learn From Home Support",
  "International Standard",
  "Board & Entry Test Prep",
];

export function createAdvertiseTemplate(formatId, paletteId = "institute") {
  const doc = baseDocument({
    formatId,
    paletteId,
    name: "Academy advertisement",
    templateId: "advertise",
  });
  const f = { width: doc.width, height: doc.height };

  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    ...box(f, 0.28, 0, 0.72, 0.88),
  });
  push(doc, {
    type: "text",
    content: "School\nSLOGAN HERE",
    fontId: "jakarta",
    fontSize: 22,
    fontWeight: 700,
    align: "left",
    colorRole: "surface",
    lineHeight: 1.25,
    ...box(f, 0.04, 0.04, 0.28, 0.08),
  });
  push(doc, {
    type: "text",
    content: "www.example.com",
    fontId: "jakarta",
    fontSize: 16,
    fontWeight: 500,
    align: "right",
    colorRole: "accentText",
    ...box(f, 0.55, 0.04, 0.4, 0.04),
  });
  push(doc, {
    type: "image",
    src: "",
    clip: "circle",
    objectFit: "cover",
    placeholderLabel: "Student",
    ...squareBox(f, 0.04, 0.22, 0.38),
  });
  push(doc, {
    type: "text",
    content: "YEAR 2026",
    fontId: "jakarta",
    fontSize: 22,
    fontWeight: 700,
    align: "left",
    colorRole: "accent",
    ...box(f, 0.48, 0.18, 0.46, 0.045),
  });
  push(doc, {
    type: "text",
    content: "SCHOOL",
    fontId: "jakarta",
    fontSize: 56,
    fontWeight: 800,
    align: "left",
    colorRole: "accentText",
    ...box(f, 0.48, 0.23, 0.48, 0.08),
  });
  push(doc, {
    type: "text",
    content: "ADMISSION",
    fontId: "jakarta",
    fontSize: 44,
    fontWeight: 700,
    align: "left",
    colorRole: "accent",
    ...box(f, 0.48, 0.31, 0.48, 0.07),
  });
  push(doc, {
    type: "text",
    content: "The best guideline for your kids",
    fontId: "jakarta",
    fontSize: 20,
    fontWeight: 500,
    align: "left",
    colorRole: "accentText",
    ...box(f, 0.48, 0.39, 0.46, 0.06),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fill: "#145A32",
    radius: 28,
    ...box(f, 0.48, 0.48, 0.32, 0.07),
  });
  push(doc, {
    type: "text",
    content: "Enrol Now!",
    fontId: "jakarta",
    fontSize: 22,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.48, 0.48, 0.32, 0.07),
  });
  FEATURES.forEach((item, index) => {
    push(doc, {
      type: "text",
      content: `◆  ${item}`,
      fontId: "jakarta",
      fontSize: 18,
      fontWeight: 500,
      align: "left",
      colorRole: "accentText",
      ...box(f, 0.48, 0.6 + index * 0.055, 0.46, 0.05),
    });
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fill: "#145A32",
    ...box(f, 0, 0.88, 1, 0.12),
  });
  push(doc, {
    type: "text",
    content: "Call to find out more     000 123 456 789",
    fontId: "jakarta",
    fontSize: 22,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.05, 0.9, 0.9, 0.08),
  });
  return doc;
}
