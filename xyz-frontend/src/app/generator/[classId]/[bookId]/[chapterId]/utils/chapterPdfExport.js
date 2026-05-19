"use client";

/**
 * Build an A4 PDF from selected chapter questions (client-only; dynamic-loads jsPDF).
 *
 * @param {{ headingLines: string[], questions: { kind: string, text: string, options?: string[] }[] }} payload
 */
export async function downloadChapterPdf({ headingLines, questions }) {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = margin;

  const space = () => pageHeight - margin - y;

  /** @param {number} drain */
  function ensure(drain) {
    if (space() < drain) {
      doc.addPage();
      y = margin;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  headingLines.slice(0, 3).forEach((line) => {
    const lines = doc.splitTextToSize(line, pageWidth - margin * 2);
    ensure(lines.length * 6);
    doc.text(lines, margin, y);
    y += lines.length * 6 + 2;
  });
  y += 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  questions.forEach((q, i) => {
    const head = `${i + 1}. [${q.kind.toUpperCase()}]`;
    const body = doc.splitTextToSize(`${head} ${q.text}`, pageWidth - margin * 2);
    ensure(body.length * 5 + 2);
    doc.text(body, margin, y);
    y += body.length * 5 + 3;

    if (q.options?.length) {
      q.options.forEach((opt, j) => {
        const letter = String.fromCharCode(65 + j);
        const opts = doc.splitTextToSize(`   (${letter}) ${opt}`, pageWidth - margin * 2 - 6);
        ensure(opts.length * 5);
        doc.text(opts, margin + 4, y);
        y += opts.length * 5 + 1;
      });
      y += 2;
    } else {
      y += 2;
      ensure(0);
    }
  });

  doc.save("test-generator-sheet.pdf");
}
