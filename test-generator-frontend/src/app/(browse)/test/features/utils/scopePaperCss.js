/**
 * Scopes the paper stylesheet to one container so it can be mounted inside
 * the live app (for PDF rendering) without restyling the rest of the page.
 *
 * - `html`, `body`, `:root` selectors → the scope element itself
 * - `*` → the scope element and everything inside it
 * - every other selector → prefixed with the scope
 * - `@media` / `@supports` blocks are scoped recursively
 * - `@page`, `@font-face`, and other at-rules are kept as-is
 */

const ROOT_SELECTORS = new Set(["html", "body", ":root"]);

function scopeSelector(selector, scope) {
  const trimmed = selector.trim();
  if (ROOT_SELECTORS.has(trimmed)) return [scope];
  if (trimmed === "*") return [scope, `${scope} *`];
  return [`${scope} ${trimmed}`];
}

function scopeSelectorList(selectorText, scope) {
  // Paper CSS only uses simple selector lists (no commas inside :is()/:not()).
  const scoped = selectorText
    .split(",")
    .flatMap((selector) => scopeSelector(selector, scope));
  return [...new Set(scoped)].join(", ");
}

function scopeRules(rules, scope) {
  return [...rules]
    .map((rule) => {
      if (rule instanceof CSSStyleRule) {
        const body = rule.cssText.slice(rule.cssText.indexOf("{"));
        return `${scopeSelectorList(rule.selectorText, scope)} ${body}`;
      }
      if (rule instanceof CSSMediaRule) {
        return `@media ${rule.media.mediaText} {\n${scopeRules(rule.cssRules, scope)}\n}`;
      }
      if (typeof CSSSupportsRule !== "undefined" && rule instanceof CSSSupportsRule) {
        return `@supports ${rule.conditionText} {\n${scopeRules(rule.cssRules, scope)}\n}`;
      }
      return rule.cssText;
    })
    .join("\n");
}

/**
 * @param {string} css
 * @param {string} scope CSS selector of the container, e.g. `.paper-host`
 * @returns {string} scoped CSS (falls back to the input if the browser can't parse it)
 */
export function scopePaperCss(css, scope) {
  if (typeof CSSStyleSheet === "undefined") return css;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    return scopeRules(sheet.cssRules, scope);
  } catch {
    return css;
  }
}
