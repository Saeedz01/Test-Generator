import { box, baseDocument, push, squareBox } from "./templateHelpers";

const COLS = 4;
const ROWS = 4;

const STUDENTS = [
  ["Rohit Sukla", "99%"],
  ["Ayesha Khan", "98%"],
  ["Ali Raza", "97%"],
  ["Sara Ahmed", "96%"],
  ["Hassan Ali", "95%"],
  ["Zainab Fatima", "94%"],
  ["Omar Sheikh", "93%"],
  ["Hira Malik", "92%"],
  ["Bilal Ahmed", "91%"],
  ["Noor Jahan", "90%"],
  ["Usman Tariq", "89%"],
  ["Fatima Noor", "88%"],
  ["Hamza Iqbal", "87%"],
  ["Maryam Ali", "86%"],
  ["Saad Rehman", "84%"],
  ["Iqra Shah", "82%"],
];

export function createClassResultTemplate(formatId, paletteId = "cream") {
  const doc = baseDocument({
    formatId,
    paletteId,
    name: "Class result",
    templateId: "class-result",
  });
  const f = { width: doc.width, height: doc.height };

  push(doc, {
    type: "shape",
    shape: "rect",
    fillRole: "accent",
    radius: 16,
    ...squareBox(f, 0.05, 0.035, 0.07),
  });
  push(doc, {
    type: "text",
    content: "Your Academy",
    fontId: "jakarta",
    fontSize: 28,
    fontWeight: 700,
    align: "left",
    colorRole: "accent",
    ...box(f, 0.14, 0.04, 0.45, 0.055),
  });
  push(doc, {
    type: "text",
    content: "+91 0300-1234567",
    fontId: "jakarta",
    fontSize: 22,
    fontWeight: 600,
    align: "right",
    colorRole: "text",
    ...box(f, 0.55, 0.045, 0.4, 0.045),
  });
  push(doc, {
    type: "text",
    content: "Board Exam Result 2026",
    fontId: "jakarta",
    fontSize: 24,
    fontWeight: 500,
    align: "center",
    colorRole: "muted",
    ...box(f, 0.1, 0.11, 0.8, 0.04),
  });
  push(doc, {
    type: "text",
    content: "Our Toppers",
    fontId: "jakarta",
    fontSize: 48,
    fontWeight: 700,
    align: "center",
    colorRole: "text",
    ...box(f, 0.1, 0.145, 0.8, 0.06),
  });

  const gridX = 0.05;
  const gridY = 0.22;
  const gridW = 0.9;
  const gridH = 0.62;
  const cellW = gridW / COLS;
  const cellH = gridH / ROWS;
  const photoPx = Math.round(
    Math.min(cellW * doc.width, cellH * doc.height * 0.58) * 0.82,
  );
  const photoW = photoPx / doc.width;
  const photoH = photoPx / doc.height;

  STUDENTS.forEach(([name, marks], index) => {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const cellX = gridX + col * cellW;
    const cellY = gridY + row * cellH;
    const photoX = cellX + (cellW - photoW) / 2;
    const photoY = cellY + 0.01;

    push(doc, {
      type: "image",
      src: "",
      clip: "circle",
      objectFit: "cover",
      aspectLocked: true,
      placeholderLabel: "",
      ...box(f, photoX, photoY, photoW, photoH),
    });
    push(doc, {
      type: "text",
      content: `${marks}  ${name}`,
      fontId: "jakarta",
      fontSize: 16,
      fontWeight: 700,
      align: "center",
      valign: "middle",
      colorRole: "text",
      ...box(f, cellX + 0.01, photoY + photoH + 0.004, cellW - 0.02, 0.032),
    });
  });

  push(doc, {
    type: "text",
    content: "Congratulations",
    fontId: "script",
    fontSize: 64,
    fontWeight: 400,
    align: "center",
    colorRole: "text",
    ...box(f, 0.08, 0.86, 0.84, 0.1),
  });
  return doc;
}
