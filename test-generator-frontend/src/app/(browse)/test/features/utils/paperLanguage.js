/**
 * Resolve question/option text for paper language: en | ur | both.
 */

export function resolveStatement(question, language = "en") {
  const en = String(question?.statement ?? "").trim();
  const ur = String(question?.statementUr ?? "").trim();

  if (language === "ur") {
    return ur || en;
  }
  if (language === "both") {
    return { en, ur: ur || "" };
  }
  return en || ur;
}

export function resolveOptionText(option, language = "en") {
  if (typeof option === "string") {
    return option;
  }
  const en = String(option?.en ?? "").trim();
  const ur = String(option?.ur ?? "").trim();

  if (language === "ur") {
    return ur || en;
  }
  if (language === "both") {
    return { en, ur: ur || "" };
  }
  return en || ur;
}

export const TYPE_TITLE = {
  en: {
    mcq: "Section A — Multiple Choice Questions",
    short: "Section B — Short Questions",
    long: "Section C — Long Questions",
  },
  ur: {
    mcq: "حصہ الف — کثیر الانتخابی سوالات",
    short: "حصہ ب — مختصر سوالات",
    long: "حصہ ج — طویل سوالات",
  },
};

export function sectionTitle(type, language = "en") {
  if (language === "ur") {
    return TYPE_TITLE.ur[type] || TYPE_TITLE.en[type];
  }
  if (language === "both") {
    const en = TYPE_TITLE.en[type];
    const ur = TYPE_TITLE.ur[type];
    return { en, ur };
  }
  return TYPE_TITLE.en[type];
}
