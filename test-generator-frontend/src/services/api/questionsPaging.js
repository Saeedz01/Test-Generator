/**
 * Question list normalization + pagination helpers for `questions.api.js`.
 * The backend paginates each question type separately and returns `{ data, meta }`.
 */

function isEmptyQuestionsError(error) {
  if (!error) return false;
  if (error.status === 404) return true;
  const message = String(error?.data?.message || error?.error || "").toLowerCase();
  return message.includes("no questions found");
}

function normalizeQuestion(item, type) {
  const options = Array.isArray(item.options)
    ? item.options.map((option) => {
        if (typeof option === "string") {
          return { en: option, ur: "" };
        }
        return {
          en: String(option?.en ?? ""),
          ur: String(option?.ur ?? ""),
        };
      })
    : [];

  return {
    id: item.id,
    type: item.type ?? type,
    statement: item.question_text ?? item.statement ?? "",
    statementUr: item.questionTextUr ?? item.statementUr ?? "",
    marks: Number(item.marks) || 0,
    difficulty: item.difficulty ?? "medium",
    classId: item.classId ?? item.class?.id ?? "",
    bookId: item.bookId ?? item.book?.id ?? "",
    chapterId: item.chapterId ?? item.chapter?.id ?? "",
    className: item.className ?? item.class?.name ?? "",
    bookName: item.bookName ?? item.book?.book_name ?? item.book?.name ?? "",
    chapterName:
      item.chapterName ?? item.chapter?.chapter_name ?? item.chapter?.name ?? "",
    options,
  };
}

function unwrapQuestionList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function normalizeQuestionList(response, type) {
  return unwrapQuestionList(response).map((item) =>
    normalizeQuestion(item, type),
  );
}

/** Backend caps `limit` at 200 per request (see ListQuestionsQueryDto). */
export const MAX_PAGE_SIZE = 200;

function readPageMeta(response, items, page, limit) {
  const meta = Array.isArray(response) ? null : response?.meta;
  const total = Number(meta?.total ?? items.length) || 0;
  const pageSize = Number(meta?.limit ?? limit) || limit;
  return {
    total,
    page: Number(meta?.page ?? page) || page,
    limit: pageSize,
    totalPages:
      Number(meta?.totalPages) || Math.max(1, Math.ceil(total / pageSize)),
  };
}

function buildQuestionsUrl(baseUrl, params = {}) {
  const search = new URLSearchParams();
  if (params.chapterId) search.set("chapterId", params.chapterId);
  if (params.bookId) search.set("bookId", params.bookId);
  if (params.classId) search.set("classId", params.classId);
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const query = search.toString();
  if (!query) return baseUrl;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}${query}`;
}

/** Fetches one page of one question type → `{ data: { items, meta } }`. */
export async function fetchQuestionPage(baseQuery, baseUrl, params, type) {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || MAX_PAGE_SIZE;
  const url = buildQuestionsUrl(baseUrl, { ...params, page, limit });
  const result = await baseQuery({ url, method: "GET" });

  if (result.error) {
    if (isEmptyQuestionsError(result.error)) {
      return {
        data: { items: [], meta: { total: 0, page, limit, totalPages: 1 } },
      };
    }
    return { error: result.error };
  }

  const items = normalizeQuestionList(result.data, type);
  return { data: { items, meta: readPageMeta(result.data, items, page, limit) } };
}

/** Walks every page of one question type so nothing is silently truncated. */
export async function fetchAllQuestionPages(baseQuery, baseUrl, params, type) {
  const scope = { ...params, page: 1, limit: MAX_PAGE_SIZE };
  const first = await fetchQuestionPage(baseQuery, baseUrl, scope, type);
  if (first.error) return first;

  const { totalPages } = first.data.meta;
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
      fetchQuestionPage(
        baseQuery,
        baseUrl,
        { ...scope, page: index + 2 },
        type,
      ),
    ),
  );
  const failed = rest.find((result) => result.error);
  if (failed) return { error: failed.error };

  const seen = new Set();
  const items = [first, ...rest]
    .flatMap((result) => result.data.items)
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  return { data: items };
}
