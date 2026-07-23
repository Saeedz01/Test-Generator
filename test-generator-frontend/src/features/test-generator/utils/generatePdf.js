/**
 * Prints a test paper via a hidden iframe (no pop-up window).
 * Browsers allow print() from a user click without enabling pop-ups.
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
    const frameWindow = iframe.contentWindow;
    const frameDocument = frameWindow?.document;

    if (!frameWindow || !frameDocument) {
      return { ok: false, error: "Could not prepare the print view. Please try again." };
    }

    frameDocument.open();
    frameDocument.write(html);
    frameDocument.close();

    // document.write often skips the load event — print on the next frames.
    const triggerPrint = () => {
      frameWindow.focus();
      frameWindow.print();
    };

    if (frameDocument.readyState === "complete") {
      window.setTimeout(triggerPrint, 100);
    } else {
      iframe.onload = () => window.setTimeout(triggerPrint, 100);
      window.setTimeout(triggerPrint, 400);
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong while preparing the PDF." };
  }
}
