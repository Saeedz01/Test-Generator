/**
 * Prints a test paper via a hidden iframe, and downloads a text/vector PDF
 * from the same HTML/CSS used by the on-screen preview (not a page screenshot).
 */

import { createRenderer } from "@imggion/html2realpdf";
import { buildTestPaperHtml } from "./buildTestPaperHtml";

const FRAME_ID = "test-generator-print-frame";

/** Local TTF copies used so PDF Urdu stays selectable Nastaliq (not a page image). */
const NASTALIQ_REGULAR_URL = "/fonts/NotoNastaliqUrdu-Regular.ttf";
const NASTALIQ_BOLD_URL = "/fonts/NotoNastaliqUrdu-Bold.ttf";

/** @type {ReturnType<typeof createRenderer> | null} */
let rendererPromise = null;

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
 * Mounts the paper HTML off-screen so layout/fonts match the preview.
 * @param {string} html
 */
function mountPaperHost(html) {
  const host = document.createElement("div");
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
    host.appendChild(document.importNode(styleEl, true));
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
        const [regular, bold] = await Promise.all([
          fetchFontBytes(NASTALIQ_REGULAR_URL),
          fetchFontBytes(NASTALIQ_BOLD_URL),
        ]);
        fonts.push(
          {
            family: "Noto Nastaliq Urdu",
            data: regular,
            weight: 400,
            style: "normal",
          },
          {
            family: "Noto Nastaliq Urdu",
            data: bold,
            weight: 700,
            style: "normal",
          },
        );
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
