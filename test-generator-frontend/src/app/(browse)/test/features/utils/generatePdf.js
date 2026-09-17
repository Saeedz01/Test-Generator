/**
 * Prints a test paper via a hidden iframe, and downloads a real PDF via html-to-image + jsPDF.
 */

import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { buildTestPaperHtml } from "./buildTestPaperHtml";

const FRAME_ID = "test-generator-print-frame";

function getPrintFrame() {
  let iframe = document.getElementById(FRAME_ID);

  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = FRAME_ID;
    iframe.title = "Printable test paper";
    iframe.setAttribute("aria-hidden", "true");
    Object.assign(iframe.style, {
      position: "fixed",
      right: "0",
      bottom: "0",
      width: "0",
      height: "0",
      border: "0",
      opacity: "0",
      pointerEvents: "none",
    });
    document.body.appendChild(iframe);
  }

  return iframe;
}

function waitForFonts(doc) {
  if (doc?.fonts?.ready) {
    return doc.fonts.ready.catch(() => undefined);
  }
  return Promise.resolve();
}

/**
 * @param {object} meta
 * @param {object[]} questions
 * @returns {{ ok: boolean, error?: string }}
 */
export function generatePdf(meta, questions) {
  if (typeof window === "undefined") {
    return { ok: false, error: "PDF generation is only available in the browser." };
  }

  if (!questions?.length) {
    return {
      ok: false,
      error: "Select at least one question before generating a PDF.",
    };
  }

  try {
    const html = buildTestPaperHtml(meta, questions, { autoPrint: false });
    const iframe = getPrintFrame();
    const blob = new Blob([html], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);

    const cleanup = () => {
      URL.revokeObjectURL(blobUrl);
    };

    const triggerPrint = () => {
      const frameWindow = iframe.contentWindow;
      if (!frameWindow) {
        cleanup();
        return;
      }
      try {
        frameWindow.document.title = " ";
      } catch {
        // ignore cross-document title issues
      }
      frameWindow.focus();
      frameWindow.print();
      window.setTimeout(cleanup, 1000);
    };

    iframe.onload = () => {
      window.setTimeout(triggerPrint, 100);
    };
    iframe.src = blobUrl;

    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong while preparing the PDF." };
  }
}

/**
 * Downloads an A4 PDF file of the paper (client-side).
 * @param {object} meta
 * @param {object[]} questions
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function downloadPdfFile(meta, questions) {
  if (typeof window === "undefined") {
    return { ok: false, error: "PDF download is only available in the browser." };
  }
  if (!questions?.length) {
    return {
      ok: false,
      error: "Select at least one question before downloading a PDF.",
    };
  }

  try {
    const html = buildTestPaperHtml(meta, questions, { autoPrint: false });
    const host = document.createElement("div");
    Object.assign(host.style, {
      position: "fixed",
      left: "-10000px",
      top: "0",
      width: "210mm",
      background: "#fff",
      zIndex: "-1",
    });
    host.innerHTML = html;
    document.body.appendChild(host);

    const page = host.querySelector(".page") || host;
    await waitForFonts(document);
    // Allow Nastaliq webfont + layout to settle
    await new Promise((resolve) => window.setTimeout(resolve, 400));

    const dataUrl = await toPng(page, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = dataUrl;
    });

    const imgWidth = pageWidth;
    const imgHeight = (img.height * imgWidth) / img.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const safeName = String(meta.instituteName || "testora-paper")
      .trim()
      .replace(/[^\w\-]+/g, "-")
      .slice(0, 40);
    pdf.save(`${safeName || "testora-paper"}.pdf`);

    host.remove();
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not download the PDF file." };
  }
}
