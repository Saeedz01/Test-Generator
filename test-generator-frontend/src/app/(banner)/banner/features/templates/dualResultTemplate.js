import { baseDocument, push, squareBox } from "./templateHelpers";
import { rect, txt } from "./templateDraw";
import { academyLogoSrc } from "./templatePhotos";

const MAROON = "#7a1020";
const RED = "#e10600";
const YELLOW = "#ffe000";
const BLUE = "#0a2eb5";
const DARK = "#071433";
const GREEN = "#1b7a32";
const WHITE = "#ffffff";
const ORANGE = "#e85d04";

const CLASS9 = [
  ["230101", "علی رضا", "533"],
  ["230102", "حسن علی", "519"],
  ["230103", "عمر شیخ", "514"],
  ["230104", "بلال احمد", "502"],
  ["230105", "عثمان طارق", "530"],
  ["230106", "حمزہ اقبال", "448"],
  ["230107", "سعد رحمان", "436"],
  ["230108", "احمد نور", "413"],
  ["230109", "زین ملک", "408"],
  ["230110", "فرحان علی", "406"],
  ["230111", "کامران شاہ", "399"],
  ["230112", "یوسف خان", "392"],
];
const CLASS10 = [
  ["103519", "عائشہ خان", "1100"],
  ["103520", "سارہ احمد", "1086"],
  ["103521", "زینب فاطمہ", "1081"],
  ["103522", "حرا ملک", "1071"],
  ["103523", "نور جہاں", "996"],
  ["103524", "فاطمہ نور", "965"],
  ["103525", "مریم علی", "952"],
  ["103526", "اقراء شاہ", "941"],
  ["103527", "سنا طارق", "919"],
  ["103528", "ہانیہ رضا", "910"],
  ["103529", "رباب علی", "898"],
  ["103530", "مہوش خان", "886"],
];

function scoreCard(doc, f, x, y, w, h, roll, name, score, scoreColor, tagFill) {
  rect(doc, f, WHITE, x, y, w, h, {
    radius: 4,
    strokeWidth: 2,
    stroke: BLUE,
  });
  rect(doc, f, tagFill, x + 0.004, y + 0.004, w - 0.008, h * 0.26, { radius: 3 });
  txt(doc, f, roll, x, y + 0.004, w, h * 0.26, { fontSize: 12, fontWeight: 800 });
  txt(doc, f, name, x, y + h * 0.28, w, h * 0.26, {
    fontId: "urdu",
    fontSize: 13,
    fontWeight: 700,
    color: RED,
    dir: "rtl",
  });
  txt(doc, f, score, x, y + h * 0.52, w, h * 0.44, {
    fontSize: 28,
    fontWeight: 800,
    color: scoreColor,
  });
}

export function createDualResultTemplate(formatId, paletteId = "flyer") {
  const doc = baseDocument({
    formatId,
    paletteId,
    name: "Board result flyer",
    templateId: "dual-result",
  });
  const f = { width: doc.width, height: doc.height };

  rect(doc, f, WHITE, 0.014, 0.014, 0.972, 0.972);
  rect(doc, f, MAROON, 0.014, 0.014, 0.972, 0.2);
  push(doc, {
    type: "image",
    src: academyLogoSrc(),
    clip: "circle",
    objectFit: "cover",
    ...squareBox(f, 0.03, 0.03, 0.12),
  });
  rect(doc, f, GREEN, 0.17, 0.025, 0.34, 0.032, { radius: 16 });
  txt(doc, f, "علم روشنی ہے", 0.17, 0.025, 0.34, 0.032, {
    fontId: "urdu",
    fontSize: 13,
    fontWeight: 700,
    dir: "rtl",
  });
  txt(doc, f, "آپ کی اکیڈمی", 0.16, 0.055, 0.8, 0.09, {
    fontId: "arabic",
    fontSize: 56,
    fontWeight: 900,
    color: YELLOW,
    dir: "rtl",
    stroke: BLUE,
    strokeWidth: 6,
    shadow: "3px 4px 0 #001a5c",
  });
  rect(doc, f, YELLOW, 0.18, 0.15, 0.66, 0.048);
  txt(doc, f, "الحمدللہ! کلاس نہم و دہم 2026 کا شاندار رزلٹ", 0.18, 0.15, 0.66, 0.048, {
    fontId: "urdu",
    fontSize: 18,
    fontWeight: 700,
    color: DARK,
    dir: "rtl",
  });

  rect(doc, f, YELLOW, 0.04, 0.23, 0.22, 0.09, {
    radius: 6,
    strokeWidth: 5,
    stroke: BLUE,
  });
  txt(doc, f, "545", 0.04, 0.23, 0.22, 0.09, {
    fontSize: 54,
    fontWeight: 800,
    color: BLUE,
  });
  rect(doc, f, RED, 0.28, 0.23, 0.16, 0.028, { radius: 3 });
  txt(doc, f, "100001", 0.28, 0.23, 0.16, 0.028, { fontSize: 14, fontWeight: 800 });
  txt(doc, f, "طالب علم کا نام", 0.28, 0.262, 0.5, 0.032, {
    fontId: "urdu",
    fontSize: 24,
    fontWeight: 700,
    color: RED,
    dir: "rtl",
    align: "right",
  });
  txt(doc, f, "BOYS TOPPER", 0.28, 0.294, 0.28, 0.026, {
    fontSize: 18,
    fontWeight: 800,
    color: RED,
    align: "left",
  });
  txt(doc, f, "in your city", 0.56, 0.294, 0.4, 0.026, {
    fontSize: 16,
    fontWeight: 700,
    color: RED,
    align: "left",
  });

  const leftX = 0.03;
  const leftW = 0.44;
  const rightX = 0.54;
  const rightW = 0.43;
  const gridY = 0.34;
  const gridH = 0.5;

  rect(doc, f, YELLOW, leftX, gridY, leftW, 0.042);
  txt(doc, f, "کلاس نہم 2026 کا شاندار رزلٹ", leftX, gridY, leftW, 0.042, {
    fontId: "urdu",
    fontSize: 16,
    fontWeight: 700,
    color: DARK,
    dir: "rtl",
  });
  const nineW = leftW / 2;
  const nineH = (gridH - 0.048) / 6;
  CLASS9.forEach((row, index) => {
    const col = index % 2;
    const r = Math.floor(index / 2);
    scoreCard(
      doc,
      f,
      leftX + col * nineW + 0.004,
      gridY + 0.048 + r * nineH,
      nineW - 0.008,
      nineH - 0.006,
      row[0],
      row[1],
      row[2],
      BLUE,
      ORANGE,
    );
  });

  rect(doc, f, YELLOW, 0.475, gridY + 0.05, 0.055, gridH - 0.06);
  txt(doc, f, "نمایاں پوزیشن", 0.475, gridY + 0.08, 0.055, gridH - 0.12, {
    fontId: "urdu",
    fontSize: 14,
    fontWeight: 700,
    color: DARK,
    dir: "rtl",
    writingMode: "vertical-rl",
  });

  rect(doc, f, RED, rightX, gridY, rightW, 0.042);
  txt(doc, f, "کلاس دہم 2026 کا شاندار رزلٹ", rightX, gridY, rightW, 0.042, {
    fontId: "urdu",
    fontSize: 16,
    fontWeight: 700,
    dir: "rtl",
  });
  const tenW = rightW / 3;
  const tenH = (gridH - 0.048) / 4;
  CLASS10.forEach((row, index) => {
    const col = index % 3;
    const r = Math.floor(index / 3);
    scoreCard(
      doc,
      f,
      rightX + col * tenW + 0.004,
      gridY + 0.048 + r * tenH,
      tenW - 0.008,
      tenH - 0.006,
      row[0],
      row[1],
      row[2],
      RED,
      BLUE,
    );
  });

  rect(doc, f, DARK, 0.014, 0.86, 0.972, 0.126);
  txt(doc, f, "0300-1234567\n0301-7654321", 0.04, 0.875, 0.3, 0.1, {
    fontSize: 20,
    fontWeight: 800,
    align: "left",
    lineHeight: 1.35,
  });
  txt(
    doc,
    f,
    "سٹی کیمپس، مین روڈ، آپ کا شہر",
    0.36,
    0.88,
    0.6,
    0.09,
    {
      fontId: "urdu",
      fontSize: 18,
      fontWeight: 700,
      color: YELLOW,
      dir: "rtl",
      align: "right",
    },
  );
  return doc;
}
