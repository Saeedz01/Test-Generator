import { box, baseDocument, push, squareBox } from "./templateHelpers";
import { academyLogoSrc, studentPhotoForName } from "./templatePhotos";

const SCIENCE = [
  ["Fatima Nisar", "494/500"],
  ["Ali Raza", "489/500"],
  ["Sara Ahmed", "486/500"],
];
const COMMERCE = [
  ["Hassan Ali", "478/500"],
  ["Zainab Fatima", "471/500"],
  ["Omar Sheikh", "465/500"],
];

function pushStudent(doc, f, slot, name, marks, photoIndex) {
  push(doc, {
    type: "image",
    src: studentPhotoForName(name, photoIndex),
    clip: "circle",
    objectFit: "cover",
    aspectLocked: true,
    placeholderLabel: "Photo",
    ...squareBox(f, slot.x, slot.y, 0.18),
  });
  push(doc, {
    type: "text",
    content: name.toUpperCase(),
    fontId: "jakarta",
    fontSize: 18,
    fontWeight: 700,
    align: "center",
    colorRole: "text",
    ...box(f, slot.x - 0.02, slot.y + 0.185, 0.22, 0.035),
  });
  push(doc, {
    type: "text",
    content: marks,
    fontId: "jakarta",
    fontSize: 16,
    fontWeight: 500,
    align: "center",
    colorRole: "muted",
    ...box(f, slot.x - 0.02, slot.y + 0.215, 0.22, 0.03),
  });
}

export function createToppersTemplate(formatId, paletteId = "institute") {
  const doc = baseDocument({
    formatId,
    paletteId,
    name: "Top students",
    templateId: "toppers",
  });
  const f = { width: doc.width, height: doc.height };

  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    ...box(f, 0, 0, 1, 0.16),
  });
  push(doc, {
    type: "image",
    src: academyLogoSrc(),
    clip: "circle",
    objectFit: "cover",
    placeholderLabel: "Logo",
    ...squareBox(f, 0.03, 0.03, 0.1),
  });
  push(doc, {
    type: "text",
    content: "Fayaz Educational Institute",
    fontId: "jakarta",
    fontSize: 32,
    fontWeight: 700,
    align: "left",
    colorRole: "accentText",
    ...box(f, 0.16, 0.035, 0.8, 0.055),
  });
  push(doc, {
    type: "text",
    content: "Faiz-Abad, Nowgam, Srinagar",
    fontId: "jakarta",
    fontSize: 18,
    fontWeight: 500,
    align: "left",
    colorRole: "accentText",
    ...box(f, 0.16, 0.09, 0.7, 0.04),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    ...box(f, 0, 0.16, 1, 0.08),
  });
  push(doc, {
    type: "text",
    content: "Our 11th grade stars  ★  2026",
    fontId: "jakarta",
    fontSize: 34,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.05, 0.165, 0.9, 0.07),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    radius: 8,
    ...box(f, 0.08, 0.26, 0.84, 0.05),
  });
  push(doc, {
    type: "text",
    content: "Science Stream",
    fontId: "jakarta",
    fontSize: 22,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.08, 0.26, 0.84, 0.05),
  });
  SCIENCE.forEach((student, index) => {
    pushStudent(doc, f, { x: 0.1 + index * 0.28, y: 0.33 }, student[0], student[1], index);
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    radius: 8,
    ...box(f, 0.08, 0.58, 0.84, 0.05),
  });
  push(doc, {
    type: "text",
    content: "Commerce Stream",
    fontId: "jakarta",
    fontSize: 22,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.08, 0.58, 0.84, 0.05),
  });
  COMMERCE.forEach((student, index) => {
    pushStudent(doc, f, { x: 0.1 + index * 0.28, y: 0.65 }, student[0], student[1], index + 3);
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    radius: 40,
    ...box(f, 0.08, 0.9, 0.84, 0.07),
  });
  push(doc, {
    type: "text",
    content: "Congratulations  ·  Distinctions 113/120  ·  9419072646",
    fontId: "jakarta",
    fontSize: 18,
    fontWeight: 600,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.08, 0.9, 0.84, 0.07),
  });
  return doc;
}
