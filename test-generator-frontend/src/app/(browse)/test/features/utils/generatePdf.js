/**
 * Prints a test paper via a hidden iframe, and downloads a text/vector PDF
 * from the same HTML/CSS used by the on-screen preview (not a page screenshot).
 */

import { createRenderer } from "@imggion/html2realpdf";
import { buildTestPaperHtml } from "./buildTestPaperHtml";
import { NASTALIQ_FAMILY, NASTALIQ_FONT_FILES } from "./paperFonts";
import { scopePaperCss } from "./scopePaperCss";

const FRAME_ID = "test-generator-print-frame";
const PAPER_HOST_CLASS = "testora-paper-host";
/** Upper bound on waiting for web fonts before printing anyway. */
const FONT_WAIT_MS = 5000;

/** @type {ReturnType<typeof createRenderer> | null} */
let rendererPromise = null;

function getPrintFrame() {
  let iframe = document.getElementById(FRAME_ID);

  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = FRAME_ID;
    iframe.title = "Printable test paper";
    iframe.setAttribute("aria-hidden", "true");
    // Same-origin keeps the blob document scriptable from here (print, fonts);
    // modals is what lets print() open the dialog. Scripts stay disabled.
    iframe.setAttribute("sandbox", "allow-same-origin allow-modals");
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
  if (!doc?.fonts?.ready) return Promise.resolve();
  return Promise.race([
    doc.fonts.ready.catch(() => undefined),
    new Promise((resolve) => window.setTimeout(resolve, FONT_WAIT_MS)),
  ]);
}

/**
 * Mounts the paper HTML off-screen so layout/fonts match the preview.
 * The paper's document-level CSS (html/body/:root/*) is rewritten to target
 * the host, and every other rule is scoped under it, so the live app is not
 * restyled while the PDF renders.
 * @param {string} html
 */
function mountPaperHost(html) {
  const host = document.createElement("div");
  host.className = PAPER_HOST_CLASS;
  Object.assign(host.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: "210mm",
    background: "#fff",
    zIndex: "-1",
  });

  const parsed = new DOMParser().parseFromString(html, "text/html");
  for (const styleEl of parsed.querySelectorAll("style")) {
    const scoped = document.createElement("style");
    scoped.textContent = scopePaperCss(
      styleEl.textContent || "",
      `.${PAPER_HOST_CLASS}`,
    );
    host.appendChild(scoped);
  }
  for (const child of [...parsed.body.childNodes]) {
    host.appendChild(document.importNode(child, true));
  }

  document.body.appendChild(host);
  return host;
}

async function fetchFontBytes(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Font download failed (${response.status})`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

async function getPdfRenderer() {
  if (!rendererPromise) {
    rendererPromise = (async () => {
      const fonts = [];
      try {
        const files = await Promise.all(
          NASTALIQ_FONT_FILES.map(async ({ weight, path }) => ({
            family: NASTALIQ_FAMILY,
            data: await fetchFontBytes(path),
            weight,
            style: "normal",
          })),
        );
        fonts.push(...files);
      } catch {
        // Built-in Arabic shaping still works; Nastaliq embedding is best-effort.
      }
      return createRenderer({
        fonts,
        execution: "main",
        wasmUrl: "/libhtml2realpdf.wasm",
      });
    })().catch((error) => {
      rendererPromise = null;
      throw error;
    });
  }
  return rendererPromise;
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

    const triggerPrint = async () => {
      const frameWindow = iframe.contentWindow;
      if (!frameWindow) {
        cleanup();
        return;
      }
      // Urdu (Nastaliq) must be loaded before the print snapshot is taken.
      await waitForFonts(frameWindow.document);
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
      iframe.onload = null;
      window.setTimeout(triggerPrint, 100);
    };
    iframe.src = blobUrl;

    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong while preparing the PDF." };
  }
}

function buildDownloadFilename(meta) {
  const safeName = String(meta.instituteName || "testora-paper")
    .trim()
    .replace(/[^\w\-]+/g, "-")
    .slice(0, 40);
  return `${safeName || "testora-paper"}.pdf`;
}

/**
 * Downloads an A4 PDF built from the same HTML/CSS as the preview.
 * Output is selectable text/vectors (not a full-page PNG embedded in jsPDF).
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

  let host = null;
  let pdf = null;

  try {
    const html = buildTestPaperHtml(meta, questions, { autoPrint: false });
    host = mountPaperHost(html);
    const page = host.querySelector(".page") || host;

    await waitForFonts(document);
    await new Promise((resolve) => window.setTimeout(resolve, 400));

    const renderer = await getPdfRenderer();
    pdf = await renderer.render(page, {
      cssProfile: "web",
      mediaType: "print",
      layoutContext: "page",
      unsupportedCss: "ignore",
      fallback: "rasterize-subtree",
      page: {
        format: "a4",
        orientation: "portrait",
        unit: "mm",
        // Matches paper @page { margin: 5mm 3mm } — [vertical, horizontal]
        margin: [5, 3],
      },
      pageBreak: {
        avoid: [".question"],
      },
      metadata: {
        title: String(meta.instituteName || "Testora paper"),
        creator: "Testora",
      },
    });

    pdf.download(buildDownloadFilename(meta));
    if (pdf.diagnostics?.length && typeof console !== "undefined") {
      console.warn("PDF diagnostics", pdf.diagnostics);
    }
    return { ok: true };
  } catch (error) {
    if (typeof console !== "undefined") {
      console.error("PDF download failed", error);
    }
    return { ok: false, error: "Could not download the PDF file." };
  } finally {
    pdf?.dispose();
    host?.remove();
  }
}
