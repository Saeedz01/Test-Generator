import { box, baseDocument, push, squareBox } from "./templateHelpers";
import { campusPhotoSrc } from "./templatePhotos";

const OFFERS = [
  "Board exam preparation",
  "Concept classes 9–12",
  "Weekly test series",
  "Result coaching",
  "Limited new seats",
];

export function createAdmissionTemplate(formatId, paletteId = "royal") {
  const doc = baseDocument({
    formatId,
    paletteId,
    name: "New session admission",
    templateId: "admission",
  });
  const f = { width: doc.width, height: doc.height };

  push(doc, {
    type: "text",
    content: "LOGO",
    fontId: "jakarta",
    fontSize: 18,
    fontWeight: 700,
    align: "right",
    colorRole: "surface",
    ...box(f, 0.7, 0.03, 0.25, 0.04),
  });
  push(doc, {
    type: "shape",
    shape: "ellipse",
    fillRole: "surface",
    ...squareBox(f, 0.22, 0.04, 0.56),
  });
  push(doc, {
    type: "image",
    src: campusPhotoSrc(),
    clip: "circle",
    objectFit: "cover",
    placeholderLabel: "Campus photo",
    ...squareBox(f, 0.26, 0.075, 0.48),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "accent",
    radius: 8,
    ...box(f, 0.08, 0.48, 0.16, 0.045),
  });
  push(doc, {
    type: "text",
    content: "2026",
    fontId: "jakarta",
    fontSize: 20,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.08, 0.48, 0.16, 0.045),
  });
  push(doc, {
    type: "text",
    content: "School",
    fontId: "jakarta",
    fontSize: 64,
    fontWeight: 800,
    align: "left",
    colorRole: "surface",
    ...box(f, 0.08, 0.53, 0.84, 0.08),
  });
  push(doc, {
    type: "text",
    content: "Admission",
    fontId: "jakarta",
    fontSize: 64,
    fontWeight: 800,
    align: "left",
    colorRole: "accent",
    ...box(f, 0.08, 0.6, 0.84, 0.08),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "surface",
    ...box(f, 0, 0.7, 0.5, 0.3),
  });
  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "accent",
    radius: 16,
    ...box(f, 0.04, 0.72, 0.42, 0.05),
  });
  push(doc, {
    type: "text",
    content: "WE OFFER",
    fontId: "jakarta",
    fontSize: 20,
    fontWeight: 700,
    align: "center",
    colorRole: "accentText",
    ...box(f, 0.04, 0.72, 0.42, 0.05),
  });
  OFFERS.forEach((item, index) => {
    push(doc, {
      type: "text",
      content: `✓  ${item}`,
      fontId: "jakarta",
      fontSize: 18,
      fontWeight: 500,
      align: "left",
      colorRole: "accentText",
      ...box(f, 0.06, 0.78 + index * 0.038, 0.4, 0.036),
    });
  });
  push(doc, {
    type: "text",
    content: "WWW.YOURACADEMY.COM     0300-1234567",
    fontId: "jakarta",
    fontSize: 16,
    fontWeight: 600,
    align: "center",
    colorRole: "muted",
    ...box(f, 0.52, 0.92, 0.44, 0.05),
  });
  return doc;
}
