/**
 * Builds a printable HTML test paper from selected questions.
 * Keep this pure — swap the caller to a NestJS endpoint later without UI changes.
 */

const TYPE_ORDER = ["mcq", "short", "long"];
const TYPE_TITLE = {
  mcq: "Section A — Multiple Choice Questions",
  short: "Section B — Short Questions",
  long: "Section C — Long Questions",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sortQuestions(questions) {
  return [...questions].sort((a, b) => {
    const typeDiff = TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);
    if (typeDiff !== 0) return typeDiff;
    return String(a.id).localeCompare(String(b.id));
  });
}

function renderQuestion(question, index) {
  const marks = Number(question.marks) || 0;
  let optionsHtml = "";

  if (question.type === "mcq" && Array.isArray(question.options)) {
    optionsHtml = `<ol type="A" class="options">${question.options
      .map((option) => `<li>${escapeHtml(option)}</li>`)
      .join("")}</ol>`;
  }

  return `
    <article class="question">
      <header>
        <span class="q-no">Q${index}.</span>
        <span class="q-marks">[${marks} ${marks === 1 ? "Mark" : "Marks"}]</span>
      </header>
      <p class="q-text">${escapeHtml(question.statement)}</p>
      ${optionsHtml}
      ${question.type !== "mcq" ? '<div class="answer-space"></div>' : ""}
    </article>
  `;
}

/**
 * @param {object} meta
 * @param {string} [meta.className]
 * @param {string} [meta.bookName]
 * @param {string} [meta.chapterName]
 * @param {string} [meta.title]
 * @param {object[]} questions
 * @param {{ autoPrint?: boolean }} [options]
 */
export function buildTestPaperHtml(meta, questions, options = {}) {
  const { autoPrint = false } = options;
  const sorted = sortQuestions(questions);
  const totalMarks = sorted.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
  const date = new Date().toLocaleDateString();

  let questionNumber = 0;
  const sectionsHtml = TYPE_ORDER.map((type) => {
    const items = sorted.filter((q) => q.type === type);
    if (!items.length) return "";
    const body = items
      .map((question) => {
        questionNumber += 1;
        return renderQuestion(question, questionNumber);
      })
      .join("");
    return `<section><h2>${TYPE_TITLE[type]}</h2>${body}</section>`;
  }).join("");

  const printScript = autoPrint
    ? `<script>
    window.addEventListener("load", function () {
      setTimeout(function () { window.print(); }, 250);
    });
  </script>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(meta.title || "Generated Test")}</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px;
      font-family: "Segoe UI", system-ui, sans-serif;
      color: #1a1a18;
      line-height: 1.5;
    }
    .sheet { max-width: 800px; margin: 0 auto; }
    .brand { color: #587b2a; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; font-size: 12px; }
    h1 { margin: 8px 0 4px; font-size: 28px; }
    .meta { color: #5c5c55; font-size: 14px; margin-bottom: 8px; }
    .summary { display: flex; gap: 16px; flex-wrap: wrap; margin: 16px 0 24px; font-size: 14px; }
    .summary span { border: 1px solid #e3e3de; border-radius: 8px; padding: 6px 10px; }
    h2 { margin: 28px 0 12px; font-size: 16px; color: #446022; border-bottom: 1px solid #e3e3de; padding-bottom: 6px; }
    .question { margin: 0 0 18px; page-break-inside: avoid; }
    .question header { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 4px; font-weight: 600; }
    .q-marks { color: #5c5c55; font-size: 13px; font-weight: 600; }
    .q-text { margin: 0; }
    .options { margin: 8px 0 0 1.25rem; padding: 0; }
    .options li { margin: 4px 0; }
    .answer-space { margin-top: 10px; border: 1px dashed #cfcfc8; border-radius: 8px; min-height: 72px; }
    .footer { margin-top: 32px; font-size: 12px; color: #78786f; }
    @media print {
      body { padding: 12px; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="brand">Test Generator</div>
    <h1>${escapeHtml(meta.title || "Class Test")}</h1>
    <p class="meta">
      ${escapeHtml(meta.className || "—")}
      ${meta.bookName ? ` · ${escapeHtml(meta.bookName)}` : ""}
      ${meta.chapterName ? ` · ${escapeHtml(meta.chapterName)}` : ""}
    </p>
    <div class="summary">
      <span>Date: ${escapeHtml(date)}</span>
      <span>Questions: ${sorted.length}</span>
      <span>Total Marks: ${totalMarks}</span>
      <span>Time Allowed: ________</span>
    </div>
    ${sectionsHtml}
    <p class="footer">Generated with Test Generator · Print or Save as PDF from your browser.</p>
  </div>
  ${printScript}
</body>
</html>`;
}
