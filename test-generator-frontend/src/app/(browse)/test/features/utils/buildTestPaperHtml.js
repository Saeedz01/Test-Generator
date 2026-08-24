/**
 * Builds a printable HTML test paper from selected questions.
 * Supports 1 / 2 / 4 identical tests per A4 page.
 */

import { testPaperCss } from "./testPaperCss";
import {
  TYPE_ORDER,
  TYPE_TITLE,
  renderQuestion,
  renderTestBody,
  sortQuestions,
} from "./testPaperRender";

/**
 * @param {object} meta
 * @param {1|2|4} [meta.copiesPerPage]
 * @param {object[]} questions
 * @param {{ autoPrint?: boolean }} [options]
 */
export function buildTestPaperHtml(meta, questions, options = {}) {
  const { autoPrint = false } = options;
  const sorted = sortQuestions(questions);
  const totalMarks =
    meta.totalMarks ??
    sorted.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

  const copiesPerPage = [1, 2, 4].includes(Number(meta.copiesPerPage))
    ? Number(meta.copiesPerPage)
    : 1;
  const compact = copiesPerPage > 1;

  const headingPx = (() => {
    const n = Number(meta.headingFontSize);
    if (Number.isFinite(n)) return Math.min(48, Math.max(8, Math.round(n)));
    return compact ? 12 : 18;
  })();
  const subtextPx = (() => {
    const n = Number(meta.subtextFontSize);
    if (Number.isFinite(n)) return Math.min(48, Math.max(8, Math.round(n)));
    return compact ? 9.5 : 12;
  })();
  const detailPx = Math.max(8, Math.round(subtextPx * 0.9));

  let questionNumber = 0;
  const sectionsHtml = TYPE_ORDER.map((type) => {
    const items = sorted.filter((q) => q.type === type);
    if (!items.length) return "";
    const body = items
      .map((question) => {
        questionNumber += 1;
        return renderQuestion(question, questionNumber, compact);
      })
      .join("");
    return `<section class="section"><h2>${TYPE_TITLE[type]}</h2>${body}</section>`;
  }).join("");

  const oneTest = renderTestBody(meta, sectionsHtml, totalMarks, sorted.length);
  const cells = Array.from({ length: copiesPerPage }, (_, index) => {
    return `<div class="test-cell" data-copy="${index + 1}">${oneTest}</div>`;
  }).join("");

  const printScript = autoPrint
    ? `<script>
    window.addEventListener("load", function () {
      setTimeout(function () { window.print(); }, 250);
    });
  </script>`
    : "";

  const css = testPaperCss({
    headingPx,
    subtextPx,
    detailPx,
    compact,
    copiesPerPage,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title></title>
  <style>
${css}
  </style>
</head>
<body>
  <div class="page layout-${copiesPerPage}">
    ${cells}
  </div>
  ${printScript}
</body>
</html>`;
}
