import { baseDocument, push, squareBox } from "./templateHelpers";
import { rect, txt, photo } from "./templateDraw";
import { academyLogoSrc, classroomPhotoSrc } from "./templatePhotos";

const GREEN = "#0d4a2c";
const GOLD = "#c5a028";
const CREAM = "#f7f3e8";
const NAVY = "#14301f";
const WHITE = "#ffffff";

export function createExamNewsTemplate(formatId, paletteId = "announce") {
  const doc = baseDocument({
    formatId,
    paletteId,
    name: "Result announcement",
    templateId: "exam-news",
  });
  const f = { width: doc.width, height: doc.height };

  rect(doc, f, CREAM, 0, 0, 1, 1);
  rect(doc, f, GREEN, 0, 0, 1, 0.2);
  push(doc, {
    type: "image",
    src: academyLogoSrc(),
    clip: "circle",
    objectFit: "cover",
    ...squareBox(f, 0.035, 0.035, 0.13),
  });
  txt(doc, f, "علم سائنس اکیڈمی", 0.18, 0.03, 0.78, 0.09, {
    fontId: "arabic",
    fontSize: 48,
    fontWeight: 800,
    dir: "rtl",
    align: "right",
  });
  txt(doc, f, "YOUR ACADEMY  ·  BISE PUNJAB", 0.18, 0.12, 0.78, 0.05, {
    fontSize: 18,
    fontWeight: 600,
    align: "left",
    color: GOLD,
  });

  rect(doc, f, GOLD, 0, 0.2, 1, 0.07);
  txt(doc, f, "الحمدللہ  ·  رزلٹ 2026 جاری  ·  RESULT DECLARED", 0, 0.2, 1, 0.07, {
    fontId: "urdu",
    fontSize: 22,
    fontWeight: 700,
    color: GREEN,
    dir: "rtl",
  });

  txt(doc, f, "BOARD EXAM RESULT", 0.05, 0.3, 0.5, 0.045, {
    fontSize: 16,
    fontWeight: 700,
    color: GOLD,
    align: "left",
  });
  txt(doc, f, "Matric & Intermediate", 0.05, 0.34, 0.5, 0.07, {
    fontSize: 36,
    fontWeight: 800,
    color: GREEN,
    align: "left",
  });
  txt(doc, f, "میٹرک اور انٹر کا شاندار رزلٹ", 0.05, 0.41, 0.5, 0.05, {
    fontId: "urdu",
    fontSize: 22,
    fontWeight: 600,
    color: NAVY,
    dir: "rtl",
    align: "right",
  });

  const stats = [
    ["98%", "Pass"],
    ["12", "Positions"],
    ["45", "A+ Grades"],
  ];
  stats.forEach((item, index) => {
    const x = 0.05 + index * 0.17;
    rect(doc, f, WHITE, x, 0.49, 0.155, 0.16, {
      radius: 12,
      strokeWidth: 2,
      stroke: GOLD,
    });
    txt(doc, f, item[0], x, 0.5, 0.155, 0.09, {
      fontSize: 36,
      fontWeight: 800,
      color: GREEN,
    });
    txt(doc, f, item[1], x, 0.58, 0.155, 0.055, {
      fontSize: 16,
      fontWeight: 600,
      color: NAVY,
    });
  });

  photo(doc, f, classroomPhotoSrc(), 0.58, 0.3, 0.37, 0.46, {
    radius: 16,
    strokeWidth: 6,
    stroke: GOLD,
  });

  rect(doc, f, GREEN, 0.05, 0.7, 0.5, 0.12, { radius: 10 });
  txt(doc, f, "Merit list available at campus", 0.05, 0.71, 0.5, 0.05, {
    fontSize: 16,
    fontWeight: 600,
    color: GOLD,
  });
  txt(doc, f, "کامیاب طلبہ کی فہرست کیمپس سے حاصل کریں", 0.05, 0.76, 0.5, 0.045, {
    fontId: "urdu",
    fontSize: 16,
    fontWeight: 600,
    dir: "rtl",
  });

  rect(doc, f, GREEN, 0, 0.86, 1, 0.14);
  txt(doc, f, "0300-1234567   ·   0301-7654321", 0.04, 0.88, 0.5, 0.1, {
    fontSize: 20,
    fontWeight: 800,
    align: "left",
  });
  txt(doc, f, "City Campus, Punjab  ·  Session 2026", 0.5, 0.88, 0.46, 0.1, {
    fontSize: 16,
    fontWeight: 600,
    color: GOLD,
    align: "right",
  });
  return doc;
}
