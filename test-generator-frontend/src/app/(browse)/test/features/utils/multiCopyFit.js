/**
 * Dynamic font sizing for 2-up / 4-up papers so each copy fills one A4 cell.
 *
 * Ideal sample (fills the cell at ~scale 1): 12 questions = 5 MCQ + 5 short + 2 long.
 * 2-per-page uses a larger base than 4-per-page. A fit pass then grows or shrinks
 * --fit-scale so content covers the full cell height without overflowing.
 *
 * One-paper-per-page layouts never use this module.
 */

function round1(n) {
  return Math.round(n * 10) / 10;
}

/** Reference paper that should fill a multi-copy cell at scale ≈ 1. */
export const IDEAL_MULTI_COPY_QUESTION_COUNT = 12;

/**
 * Starting font sizes before grow/shrink fit (px).
 * Tuned for the ideal 12-question sample; 2-up is larger than 4-up.
 * @param {2|4} copiesPerPage
 * @param {number} questionCount
 * @param {{ bilingual?: boolean }} [options]
 */
export function estimateMultiCopyFonts(
  copiesPerPage,
  questionCount,
  options = {},
) {
  const bilingual = Boolean(options.bilingual);
  const q = Math.max(1, Number(questionCount) || 1);

  // Bases sized so ~12 questions (5 MCQ / 5 short / 2 long) fill the cell.
  // Slightly conservative so Q12 is never clipped before the fit pass.
  let subtext = copiesPerPage === 2 ? 12.8 : 10.6;
  const delta = IDEAL_MULTI_COPY_QUESTION_COUNT - q;
  subtext += delta * (copiesPerPage === 2 ? 0.18 : 0.15);

  if (bilingual) {
    subtext *= 0.9;
  }

  const maxSub = copiesPerPage === 2 ? 16 : 13.5;
  const minSub = copiesPerPage === 2 ? 7.5 : 6.5;
  subtext = Math.min(maxSub, Math.max(minSub, subtext));

  const heading = Math.min(
    copiesPerPage === 2 ? 18 : 14.5,
    Math.max(copiesPerPage === 2 ? 9 : 8, subtext * 1.28),
  );
  const detail = Math.max(6.5, subtext * 0.9);

  return {
    headingPx: round1(heading),
    subtextPx: round1(subtext),
    detailPx: round1(detail),
  };
}

/**
 * Grow or shrink --fit-scale so sheet content fills each cell without overflow.
 * @param {ParentNode} [root]
 */
export function fitMultiCopySheets(root = document) {
  const page =
    root.querySelector?.(".page.layout-2, .page.layout-4") ||
    (root.classList?.contains?.("layout-2") ||
    root.classList?.contains?.("layout-4")
      ? root
      : null);
  if (!page) return;

  const cells = [...page.querySelectorAll(".test-cell")];
  if (!cells.length) return;

  const overflows = () =>
    cells.some((cell) => {
      const sheet = cell.querySelector(".sheet");
      if (!sheet) return false;
      const prevHeight = sheet.style.height;
      const prevOverflow = sheet.style.overflow;
      sheet.style.height = "auto";
      sheet.style.overflow = "visible";
      const contentHeight = sheet.scrollHeight;
      const contentWidth = sheet.scrollWidth;
      sheet.style.height = prevHeight;
      sheet.style.overflow = prevOverflow;
      const cs = window.getComputedStyle(cell);
      const padY =
        (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      const padX =
        (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      const availableH = cell.clientHeight - padY;
      const availableW = cell.clientWidth - padX;
      // Small safety margin so the last question is not clipped
      return contentHeight > availableH - 2 || contentWidth > availableW - 2;
    });

  const apply = (scale) => {
    page.style.setProperty("--fit-scale", String(scale));
  };

  // Largest scale that still fits → fills vertical space (ideal 12-q sample ≈ 1).
  let lo = 0.4;
  let hi = 2.4;

  apply(lo);
  void page.offsetHeight;
  if (overflows()) {
    apply(lo);
    return;
  }

  apply(hi);
  void page.offsetHeight;
  if (!overflows()) {
    apply(hi);
    return;
  }

  for (let i = 0; i < 20; i += 1) {
    const mid = (lo + hi) / 2;
    apply(mid);
    void page.offsetHeight;
    if (overflows()) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  apply(lo);
}

/** Inline script for preview / print iframes (no module imports). */
export const FIT_MULTI_COPY_INLINE_SCRIPT = `
(function () {
  function fitMultiCopySheets(root) {
    var page = (root || document).querySelector(".page.layout-2, .page.layout-4");
    if (!page) return;
    var cells = Array.prototype.slice.call(page.querySelectorAll(".test-cell"));
    if (!cells.length) return;
    function overflows() {
      return cells.some(function (cell) {
        var sheet = cell.querySelector(".sheet");
        if (!sheet) return false;
        var prevHeight = sheet.style.height;
        var prevOverflow = sheet.style.overflow;
        sheet.style.height = "auto";
        sheet.style.overflow = "visible";
        var contentHeight = sheet.scrollHeight;
        var contentWidth = sheet.scrollWidth;
        sheet.style.height = prevHeight;
        sheet.style.overflow = prevOverflow;
        var cs = window.getComputedStyle(cell);
        var padY =
          (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
        var padX =
          (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
        var availableH = cell.clientHeight - padY;
        var availableW = cell.clientWidth - padX;
        return contentHeight > availableH - 2 || contentWidth > availableW - 2;
      });
    }
    function apply(scale) {
      page.style.setProperty("--fit-scale", String(scale));
    }
    var lo = 0.4;
    var hi = 2.4;
    apply(lo);
    void page.offsetHeight;
    if (overflows()) {
      apply(lo);
      return;
    }
    apply(hi);
    void page.offsetHeight;
    if (!overflows()) {
      apply(hi);
      return;
    }
    for (var i = 0; i < 20; i++) {
      var mid = (lo + hi) / 2;
      apply(mid);
      void page.offsetHeight;
      if (overflows()) hi = mid;
      else lo = mid;
    }
    apply(lo);
  }
  function run() {
    fitMultiCopySheets(document);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      setTimeout(run, 50);
    }).catch(function () {
      setTimeout(run, 80);
    });
  } else {
    setTimeout(run, 80);
  }
  window.addEventListener("beforeprint", run);
})();
`;
