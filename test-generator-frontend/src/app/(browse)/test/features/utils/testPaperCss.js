/**
 * Returns the printable test paper CSS string.
 */
export function testPaperCss({
  headingPx,
  subtextPx,
  detailPx,
  compact,
  copiesPerPage,
}) {
  return `
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    @page { size: A4; margin: 5mm 3mm; }
    html, body {
      margin: 0;
      padding: 0;
      font-family: "Segoe UI", system-ui, sans-serif;
      color: #1a1a18;
      font-size: ${subtextPx}px;
      line-height: 1.3;
      width: 100%;
    }
    .page {
      display: grid;
      width: 100%;
      max-width: 100%;
      min-height: 287mm;
      height: 287mm;
      gap: 2mm;
      page-break-after: always;
      break-after: page;
    }
    .layout-1 {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    }
    .layout-2 {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
    }
    .layout-4 {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
    }
    .test-cell {
      min-height: 0;
      overflow: hidden;
      border: 1px dashed #cfcfc8;
      padding: ${compact ? "1.5mm 1mm" : "0 1mm"};
      ${copiesPerPage === 1 ? "border: none; padding: 0 1mm;" : ""}
    }
    .sheet { width: 100%; max-width: 100%; height: 100%; overflow: hidden; }
    .institute {
      text-align: center;
      font-size: ${headingPx}px;
      font-weight: 700;
      letter-spacing: 0.02em;
      margin: 0 0 4px;
      text-transform: uppercase;
    }
    .meta {
      text-align: center;
      color: #5c5c55;
      font-size: ${detailPx}px;
      margin: 0 0 6px;
    }
    .student-row {
      display: flex;
      gap: ${compact ? "8px" : "16px"};
      justify-content: space-between;
      align-items: baseline;
      margin: 0 0 6px;
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
      gap: 6px;
      flex-wrap: wrap;
      margin: 0 0 6px;
      font-size: ${detailPx}px;
    }
    .summary span {
      border: 1px solid #e3e3de;
      border-radius: 4px;
      padding: 2px 6px;
    }
    h2 {
      margin: ${compact ? "6px 0 4px" : "12px 0 8px"};
      font-size: ${subtextPx}px;
      color: #446022;
      border-bottom: 1px solid #e3e3de;
      padding-bottom: 2px;
    }
    .question {
      margin: 0 0 ${compact ? "4px" : "8px"};
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .question header {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      margin-bottom: 1px;
      font-weight: 600;
      font-size: inherit;
    }
    .q-marks { color: #5c5c55; font-weight: 600; }
    .q-text { margin: 0; }
    .options-inline {
      display: flex;
      flex-wrap: nowrap;
      gap: ${compact ? "4px" : "10px"};
      margin-top: 2px;
      font-size: ${detailPx}px;
      white-space: nowrap;
      overflow: hidden;
    }
    .options-inline .option {
      flex: 1 1 0;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .answer-space {
      margin-top: 2px;
      border: 1px dashed #cfcfc8;
      border-radius: 3px;
    }
    .answer-space-short { min-height: 28px; }
    .answer-space-long { min-height: 48px; }
    .answer-space-short.compact { min-height: 14px; }
    .answer-space-long.compact { min-height: 22px; }
    @media print {
      body { padding: 0; margin: 0; width: 100%; }
      .page {
        min-height: 0;
        height: auto;
        max-height: 287mm;
        width: 100%;
      }
      .test-cell { overflow: hidden; }
      .question { page-break-inside: avoid; break-inside: avoid; }
    }
  `;
}
