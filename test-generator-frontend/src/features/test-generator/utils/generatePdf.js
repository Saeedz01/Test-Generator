/**
 * Prints a test paper via a hidden iframe (no pop-up window).
 * Uses a blob URL so the print footer does not show /test.
 * Later: replace with `fetch('/api/tests/pdf', { method: 'POST', body })`.
 */

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
