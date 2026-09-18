/**
 * Returns the printable test paper CSS string.
 * Includes Noto Nastaliq Urdu for Urdu / bilingual papers.
 * "Both" mode uses side-by-side EN/UR columns with content-driven height.
 */
export function testPaperCss({
  headingPx,
  subtextPx,
  detailPx,
  compact,
  copiesPerPage,
  paperLanguage = "en",
}) {
  const useUrduFont = paperLanguage === "ur" || paperLanguage === "both";
  const isBoth = paperLanguage === "both";

  return `
    @import url("https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap");

    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    @page { size: A4; margin: 5mm 3mm; }
    html, body {
      margin: 0;
      padding: 0;
      font-family: "Segoe UI", system-ui, sans-serif;
      color: #1a1a18;
      font-size: ${subtextPx}px;
      line-height: 1.28;
      width: 100%;
    }
    .q-text-ur,
    .opt-ur,
    .section-title-ur,
    [lang="ur"] {
      font-family: "Noto Nastaliq Urdu", "Segoe UI", serif;
      line-height: ${isBoth ? "1.45" : "1.7"};
    }
    ${
      useUrduFont
        ? `
    .sheet[data-language="ur"] {
      font-family: "Noto Nastaliq Urdu", "Segoe UI", serif;
      line-height: 1.7;
    }
    `
        : ""
    }
    .page {
      display: grid;
      width: 100%;
      max-width: 100%;
      min-height: 287mm;
      height: auto;
      gap: 2mm;
      page-break-after: always;
      break-after: page;
    }
    .layout-1 {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }
    .layout-2 {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;
    }
    .layout-2 .test-cell {
      min-height: calc((287mm - 2mm) / 2);
    }
    .layout-4 {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
    }
    .layout-4 .test-cell {
      min-height: calc((287mm - 2mm) / 2);
    }
    /* Multi-copy pages are narrow — stack bilingual columns */
    .layout-2 .section-title-both,
    .layout-4 .section-title-both,
    .layout-2 .q-text-bilingual,
    .layout-4 .q-text-bilingual {
      grid-template-columns: 1fr;
      row-gap: 1px;
    }
    .layout-2 .options-inline.options-both,
    .layout-4 .options-inline.options-both {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .test-cell {
      min-height: 0;
      overflow: visible;
      border: 1px dashed #cfcfc8;
      padding: ${compact ? "1.5mm 1mm" : "0 1mm"};
      ${copiesPerPage === 1 ? "border: none; padding: 0 1mm;" : ""}
    }
    .sheet { width: 100%; max-width: 100%; height: auto; overflow: visible; }
    .sheet-questions-only .section-title:first-child,
    .sheet-questions-only h2:first-child {
      margin-top: 0;
    }
    .institute {
      text-align: center;
      font-size: ${headingPx}px;
      font-weight: 700;
      letter-spacing: 0.02em;
      margin: 0 0 3px;
      text-transform: uppercase;
    }
    .meta {
      text-align: center;
      color: #5c5c55;
      font-size: ${detailPx}px;
      margin: 0 0 4px;
    }
    .student-row {
      display: flex;
      gap: ${compact ? "8px" : "16px"};
      justify-content: space-between;
      align-items: baseline;
      margin: 0 0 4px;
      font-size: ${subtextPx}px;
      white-space: nowrap;
    }
    .student-row .field { flex: 1; min-width: 0; }
    .student-row .line {
      display: inline-block;
      border-bottom: 1px solid #1a1a18;
      min-width: ${compact ? "3.5rem" : "8rem"};
      width: 65%;
      margin-left: 3px;
      vertical-align: baseline;
    }
    .summary {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
      margin: 0 0 ${compact ? "4px" : "6px"};
      font-size: ${detailPx}px;
    }
    .summary span {
      border: 1px solid #e3e3de;
      border-radius: 4px;
      padding: 1px 5px;
    }

    /* —— Section titles —— */
    h2, .section-title {
      margin: ${compact ? "5px 0 3px" : "8px 0 4px"};
      font-size: ${subtextPx}px;
      color: #446022;
      border-bottom: 1px solid #e3e3de;
      padding-bottom: 2px;
      font-weight: 700;
    }
    .section-title-both {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      column-gap: 8px;
      align-items: baseline;
    }
    .section-title-en {
      text-align: left;
      min-width: 0;
    }
    .section-title-ur {
      text-align: right;
      min-width: 0;
    }

    /* —— Question shell —— */
    .question {
      margin: 0 0 ${compact ? "3px" : "5px"};
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .q-main {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      column-gap: 4px;
      align-items: start;
    }
    .q-no {
      font-weight: 700;
      padding-top: 1px;
      white-space: nowrap;
    }
    .q-marks {
      color: #5c5c55;
      font-weight: 600;
      padding-top: 1px;
      white-space: nowrap;
    }
    .q-body {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: ${compact ? "1px" : "2px"};
    }
    .q-text { margin: 0; }

    /* —— Both: statement side-by-side —— */
    .q-text-bilingual {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      column-gap: 10px;
      align-items: start;
      width: 100%;
    }
    .q-text-bilingual .q-text-en {
      margin: 0;
      text-align: left;
      min-width: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .q-text-bilingual .q-text-ur {
      margin: 0;
      text-align: right;
      min-width: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    /* Single-language statement (en or ur only) */
    .question:not(.question-both) .q-text {
      margin: 0;
    }

    /* —— MCQ options —— */
    .options-inline {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      column-gap: ${compact ? "4px" : "8px"};
      row-gap: ${compact ? "2px" : "3px"};
      margin-top: 1px;
      font-size: ${detailPx}px;
      width: 100%;
    }
    .options-inline .option {
      min-width: 0;
      display: flex;
      align-items: flex-start;
      gap: 2px;
    }
    .opt-label {
      flex: 0 0 auto;
      font-weight: 700;
    }
    .opt-body {
      min-width: 0;
      flex: 1 1 auto;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .option-both {
      align-items: flex-start;
    }
    .option-both .opt-body {
      display: flex;
      flex-direction: column;
      gap: 0;
      min-width: 0;
    }
    .option-both .opt-en {
      text-align: left;
      line-height: 1.25;
    }
    .option-both .opt-ur {
      text-align: right;
      line-height: 1.4;
      margin-top: 0;
    }

    /* Narrow preview / 2-up / 4-up: stack bilingual columns */
    @media (max-width: 520px) {
      .section-title-both,
      .q-text-bilingual {
        grid-template-columns: 1fr;
        row-gap: 2px;
      }
      .section-title-ur,
      .q-text-bilingual .q-text-ur {
        text-align: right;
      }
      .options-inline {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    ${
      compact
        ? `
    .section-title-both,
    .q-text-bilingual {
      column-gap: 6px;
    }
    .options-inline {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    `
        : ""
    }

    @media print {
      body { padding: 0; margin: 0; width: 100%; }
      .page {
        min-height: 0;
        height: auto;
        max-height: none;
        width: 100%;
      }
      .test-cell { overflow: visible; }
      .sheet { height: auto; overflow: visible; }
      .question { page-break-inside: avoid; break-inside: avoid; }
      /* Prefer side-by-side on print for single-copy papers */
      .sheet[data-language="both"] .section-title-both,
      .sheet[data-language="both"] .q-text-bilingual {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      }
      .sheet[data-language="both"] .options-inline.options-both {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
  `;
}
