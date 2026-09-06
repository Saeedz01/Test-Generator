import { baseDocument, push, squareBox } from "./templateHelpers";
import { rect, txt, photo } from "./templateDraw";
import { academyLogoSrc, studentPhotoForName } from "./templatePhotos";

const GREEN = "#0d4a2c";
const GOLD = "#c5a028";
const CREAM = "#f7f3e8";
const WHITE = "#ffffff";
const INK = "#14301f";

const STUDENTS = [
  ["علی رضا", "528"],
  ["حسن علی", "521"],
  ["عائشہ خان", "519"],
  ["عمر شیخ", "514"],
  ["زینب فاطمہ", "510"],
  ["بلال احمد", "506"],
  ["حرا ملک", "501"],
  ["عثمان طارق", "498"],
  ["مریم علی", "492"],
  ["حمزہ اقبال", "488"],
  ["اقراء شاہ", "481"],
  ["سعد رحمان", "476"],
];

export function createClassResultTemplate(formatId, paletteId = "cream") {
  const doc = baseDocument({
    formatId,
    paletteId,
    name: "Class result",
    templateId: "class-result",
  });
  const f = { width: doc.width, height: doc.height };

  rect(doc, f, CREAM, 0, 0, 1, 1);
  rect(doc, f, GREEN, 0, 0, 1, 0.16);
  push(doc, {
    type: "image",
    src: academyLogoSrc(),
    clip: "circle",
    objectFit: "cover",
    ...squareBox(f, 0.03, 0.025, 0.11),
  });
  txt(doc, f, "علم سائنس اکیڈمی", 0.16, 0.02, 0.8, 0.07, {
    fontId: "arabic",
    fontSize: 40,
    fontWeight: 800,
    dir: "rtl",
    align: "right",
  });
  txt(doc, f, "YOUR ACADEMY  ·  0300-1234567", 0.16, 0.09, 0.8, 0.045, {
    fontSize: 16,
    fontWeight: 600,
    color: GOLD,
    align: "left",
  });

  rect(doc, f, GOLD, 0.08, 0.175, 0.84, 0.055, { radius: 8 });
  txt(doc, f, "ہمارے ٹاپرز  ·  CLASS 9TH RESULT 2026", 0.08, 0.175, 0.84, 0.055, {
    fontId: "urdu",
    fontSize: 20,
    fontWeight: 700,
    color: GREEN,
    dir: "rtl",
  });

  const cols = 4;
  const rows = 3;
  const gridX = 0.05;
  const gridY = 0.255;
  const gridW = 0.9;
  const gridH = 0.58;
  const cellW = gridW / cols;
  const cellH = gridH / rows;

  STUDENTS.forEach((student, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = gridX + col * cellW;
    const y = gridY + row * cellH;
    const photoSize = Math.min(cellW * 0.72, cellH * 0.55);
    const px = x + (cellW - photoSize) / 2;
    const py = y + 0.012;

    rect(doc, f, WHITE, x + 0.012, y + 0.008, cellW - 0.024, cellH - 0.016, {
      radius: 14,
    });
    photo(doc, f, studentPhotoForName(student[0], index), px, py, photoSize, photoSize, {
      clip: "circle",
      strokeWidth: 5,
      stroke: GOLD,
      aspectLocked: true,
    });
    txt(doc, f, student[0], x, py + photoSize + 0.008, cellW, 0.032, {
      fontId: "urdu",
      fontSize: 15,
      fontWeight: 700,
      color: INK,
      dir: "rtl",
    });
    txt(doc, f, student[1], x, py + photoSize + 0.038, cellW, 0.03, {
      fontSize: 18,
      fontWeight: 800,
      color: GREEN,
    });
  });

  rect(doc, f, GREEN, 0, 0.86, 1, 0.14);
  txt(doc, f, "مبارک ہو  ·  Congratulations to all position holders", 0.04, 0.875, 0.92, 0.05, {
    fontId: "urdu",
    fontSize: 20,
    fontWeight: 700,
    dir: "rtl",
  });
  txt(doc, f, "City Campus, Punjab  ·  0300-1234567", 0.04, 0.93, 0.92, 0.045, {
    fontSize: 16,
    fontWeight: 600,
    color: GOLD,
  });
  return doc;
}
