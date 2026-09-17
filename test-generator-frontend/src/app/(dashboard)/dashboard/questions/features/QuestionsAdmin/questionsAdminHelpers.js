export function emptyMcqOptions() {
  return [
    { en: "", ur: "" },
    { en: "", ur: "" },
    { en: "", ur: "" },
    { en: "", ur: "" },
  ];
}

export function buildMcqOptions(options) {
  if (!Array.isArray(options)) return emptyMcqOptions();
  return options.map((option) => {
    if (typeof option === "string") {
      return { en: String(option ?? "").trim(), ur: "" };
    }
    return {
      en: String(option?.en ?? "").trim(),
      ur: String(option?.ur ?? "").trim(),
    };
  });
}

export function buildMcqOptionsForForm(options) {
  const normalized = buildMcqOptions(options);
  while (normalized.length < 4) {
    normalized.push({ en: "", ur: "" });
  }
  return normalized.slice(0, 4);
}

export function buildCreatePayload(form) {
  const payload = {
    statement: form.statement.trim(),
    statementUr: form.statementUr.trim(),
    chapterId: form.chapterId,
  };

  if (form.type === "mcq") {
    payload.options = buildMcqOptionsForForm(form.options).map((option) => ({
      en: option.en.trim(),
      ur: option.ur.trim(),
    }));
  }

  return payload;
}

export function buildQuestionFormFromItem(item) {
  return {
    statement: item.statement || "",
    statementUr: item.statementUr || "",
    type: item.type || "mcq",
    classId: item.classId || "",
    bookId: item.bookId || "",
    chapterId: item.chapterId || "",
    options:
      item.type === "mcq"
        ? buildMcqOptionsForForm(item.options)
        : emptyMcqOptions(),
  };
}

export function normalizeChapter(item) {
  return {
    ...item,
    name: item.name ?? item.chapter_name ?? "",
    classId: item.classId ?? item.class?.id ?? "",
    bookId: item.bookId ?? item.book?.id ?? "",
    order: item.order ?? 0,
  };
}
