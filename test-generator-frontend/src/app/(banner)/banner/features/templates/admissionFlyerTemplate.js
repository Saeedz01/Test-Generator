import { baseDocument, push, squareBox } from "./templateHelpers";
import { rect, txt, photo } from "./templateDraw";
import { academyLogoSrc, classroomPhotoSrc } from "./templatePhotos";

const MAROON = "#6b1d2a";
const GOLD = "#c5a028";
const CREAM = "#fbf6ea";
const WHITE = "#ffffff";
const INK = "#3b1418";

const CLASSES = [
  ["9th", "Matric"],
  ["10th", "Matric"],
  ["1st Year", "F.Sc / I.Com"],
  ["2nd Year", "F.Sc / I.Com"],
];
const POINTS = [
  "روزانہ ٹیسٹ اور نوٹس",
  "تجربہ کار اساتذہ",
  "بورڈ پیپر پیٹرن",
  "حد محدود سیٹیں",
];

export function createAdmissionFlyerTemplate(formatId, paletteId = "college") {
  const doc = baseDocument({
    formatId,
    paletteId,
    name: "Admission flyer",
    templateId: "admission-flyer",
  });
  const f = { width: doc.width, height: doc.height };

  rect(doc, f, CREAM, 0, 0, 1, 1);
  rect(doc, f, MAROON, 0, 0, 1, 0.2);
  push(doc, {
    type: "image",
    src: academyLogoSrc(),
    clip: "circle",
    objectFit: "cover",
    ...squareBox(f, 0.035, 0.035, 0.13),
  });
  txt(doc, f, "علم سائنس اکیڈمی", 0.18, 0.028, 0.78, 0.08, {
    fontId: "arabic",
    fontSize: 44,
    fontWeight: 800,
    dir: "rtl",
    align: "right",
  });
  txt(doc, f, "YOUR ACADEMY  ·  PUNJAB", 0.18, 0.11, 0.5, 0.055, {
    fontSize: 18,
    fontWeight: 600,
    color: GOLD,
    align: "left",
  });

  rect(doc, f, GOLD, 0, 0.2, 1, 0.065);
  txt(doc, f, "داخلہ جاری ہے  ·  ADMISSIONS OPEN 2026", 0, 0.2, 1, 0.065, {
    fontId: "urdu",
    fontSize: 22,
    fontWeight: 700,
    color: MAROON,
    dir: "rtl",
  });

  photo(doc, f, classroomPhotoSrc(), 0.04, 0.29, 0.92, 0.22, {
    radius: 12,
    strokeWidth: 4,
    stroke: GOLD,
  });

  txt(doc, f, "CLASSES", 0.05, 0.53, 0.42, 0.04, {
    fontSize: 14,
    fontWeight: 800,
    color: GOLD,
    align: "left",
  });
  CLASSES.forEach((item, index) => {
    const y = 0.575 + index * 0.055;
    rect(doc, f, WHITE, 0.05, y, 0.42, 0.048, {
      radius: 8,
      strokeWidth: 1,
      stroke: GOLD,
    });
    txt(doc, f, `${item[0]}   ${item[1]}`, 0.05, y, 0.42, 0.048, {
      fontSize: 18,
      fontWeight: 700,
      color: INK,
      align: "left",
    });
  });

  txt(doc, f, "WHY JOIN", 0.53, 0.53, 0.42, 0.04, {
    fontSize: 14,
    fontWeight: 800,
    color: GOLD,
    align: "left",
  });
  POINTS.forEach((line, index) => {
    const y = 0.575 + index * 0.055;
    rect(doc, f, MAROON, 0.53, y, 0.42, 0.048, { radius: 8 });
    txt(doc, f, line, 0.53, y, 0.42, 0.048, {
      fontId: "urdu",
      fontSize: 16,
      fontWeight: 600,
      dir: "rtl",
    });
  });

  rect(doc, f, MAROON, 0.18, 0.81, 0.64, 0.07, { radius: 10 });
  txt(doc, f, "ابھی داخلہ لیں  ·  REGISTER NOW", 0.18, 0.81, 0.64, 0.07, {
    fontId: "urdu",
    fontSize: 20,
    fontWeight: 700,
    dir: "rtl",
  });

  rect(doc, f, MAROON, 0, 0.9, 1, 0.1);
  txt(doc, f, "0300-1234567   ·   City Campus, Punjab", 0.04, 0.91, 0.92, 0.08, {
    fontSize: 18,
    fontWeight: 700,
  });
  return doc;
}
