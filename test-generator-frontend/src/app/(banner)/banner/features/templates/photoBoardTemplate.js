import { baseDocument, push, squareBox } from "./templateHelpers";
import { rect, txt, photo } from "./templateDraw";
import { academyLogoSrc, studentPhotoSrc } from "./templatePhotos";

const MAROON = "#6b1d2a";
const RED = "#e10600";
const BLUE = "#0a2e8c";
const YELLOW = "#ffe000";
const WHITE = "#ffffff";
const BLACK = "#111111";

const ROW1 = [
  ["502", "علی رضا", "230101"],
  ["514", "حسن علی", "230102"],
  ["519", "عمر شیخ", "230103"],
  ["530", "بلال احمد", "230104"],
  ["533", "عثمان طارق", "230105"],
  ["533", "حمزہ اقبال", "230106"],
];
const ROW2 = [
  ["406", "سعد رحمان", "230107"],
  ["408", "احمد نور", "230108"],
  ["413", "زین ملک", "230109"],
  ["436", "فرحان علی", "230110"],
  ["448", "کامران شاہ", "230111"],
  ["488", "یوسف خان", "230112"],
];

function studentCard(doc, f, x, y, w, h, score, name, roll, src) {
  const photoH = h * 0.62;
  const tagH = h * 0.13;
  const scoreH = h * 0.25;
  photo(doc, f, src, x, y, w, photoH, { strokeWidth: 4, stroke: WHITE });
  rect(doc, f, BLUE, x, y + photoH - tagH * 0.35, w, tagH);
  txt(doc, f, `${roll}  ${name}`, x, y + photoH - tagH * 0.35, w, tagH, {
    fontId: "urdu",
    fontSize: 13,
    fontWeight: 600,
    dir: "rtl",
  });
  rect(doc, f, RED, x, y + photoH + tagH * 0.65, w, scoreH, { radius: 4 });
  txt(doc, f, score, x, y + photoH + tagH * 0.65, w, scoreH, {
    fontSize: 34,
    fontWeight: 800,
  });
}

export function createPhotoBoardTemplate(formatId, paletteId = "board") {
  const doc = baseDocument({
    formatId,
    paletteId,
    name: "Photo result board",
    templateId: "photo-board",
  });
  const f = { width: doc.width, height: doc.height };

  rect(doc, f, MAROON, 0.012, 0.012, 0.976, 0.84);
  push(doc, {
    type: "image",
    src: academyLogoSrc(),
    clip: "circle",
    objectFit: "cover",
    ...squareBox(f, 0.03, 0.025, 0.13),
  });
  txt(doc, f, "آپ کی اکیڈمی", 0.17, 0.02, 0.8, 0.1, {
    fontId: "arabic",
    fontSize: 64,
    fontWeight: 900,
    dir: "rtl",
    stroke: BLUE,
    strokeWidth: 7,
    shadow: "3px 4px 0 #001a5c",
  });
  rect(doc, f, BLACK, 0.2, 0.125, 0.62, 0.045, { radius: 4 });
  txt(doc, f, "الحمدللہ! کلاس نہم 2026 کا شاندار رزلٹ", 0.2, 0.125, 0.62, 0.045, {
    fontId: "urdu",
    fontSize: 20,
    fontWeight: 700,
    color: YELLOW,
    dir: "rtl",
  });
  rect(doc, f, YELLOW, 0.24, 0.175, 0.54, 0.045, {
    radius: 20,
    strokeWidth: 4,
    stroke: BLUE,
  });
  txt(doc, f, "علاقہ بھر میں نمایاں پوزیشن", 0.24, 0.175, 0.54, 0.045, {
    fontId: "urdu",
    fontSize: 18,
    fontWeight: 700,
    color: BLACK,
    dir: "rtl",
  });

  const gridX = 0.02;
  const gridY = 0.24;
  const topperW = 0.22;
  const gridW = 0.74;
  const gridH = 0.6;
  const cols = 6;
  const rows = 2;
  const cellW = gridW / cols;
  const cellH = gridH / rows;
  const all = [...ROW1, ...ROW2];

  all.forEach((row, index) => {
    const col = index % cols;
    const r = Math.floor(index / cols);
    studentCard(
      doc,
      f,
      gridX + col * cellW + 0.006,
      gridY + r * cellH + 0.008,
      cellW - 0.012,
      cellH - 0.016,
      row[0],
      row[1],
      row[2],
      studentPhotoSrc(index),
    );
  });

  const tx = 0.76;
  photo(doc, f, studentPhotoSrc(20), tx, 0.24, topperW, 0.42, {
    strokeWidth: 6,
    stroke: WHITE,
  });
  rect(doc, f, YELLOW, tx, 0.665, 0.15, 0.12, { radius: 6 });
  txt(doc, f, "545", tx, 0.665, 0.15, 0.12, {
    fontSize: 52,
    fontWeight: 800,
    color: RED,
  });
  rect(doc, f, BLUE, 0.915, 0.69, 0.07, 0.07, { radius: 6 });
  txt(doc, f, "BOYS\nTOPPER", 0.915, 0.69, 0.07, 0.07, {
    fontSize: 11,
    fontWeight: 800,
    lineHeight: 1.15,
  });

  rect(doc, f, BLUE, 0.012, 0.855, 0.976, 0.133);
  txt(doc, f, "0300-1234567\n0301-7654321", 0.03, 0.87, 0.28, 0.1, {
    fontSize: 22,
    fontWeight: 800,
    align: "left",
    lineHeight: 1.35,
  });
  txt(
    doc,
    f,
    "سٹی کیمپس، مین روڈ، آپ کا شہر",
    0.32,
    0.875,
    0.65,
    0.1,
    {
      fontId: "urdu",
      fontSize: 22,
      fontWeight: 700,
      color: YELLOW,
      dir: "rtl",
      align: "right",
    },
  );
  return doc;
}
