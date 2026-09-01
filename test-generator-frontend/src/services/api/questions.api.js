import { API_ENDPOINTS } from "../apiEnpoint";
import { SplitApiSettings } from "../SplitApiSetting";

function isEmptyQuestionsError(error) {
  if (!error) return false;
  if (error.status === 404) return true;
  const message = String(error?.data?.message || error?.error || "").toLowerCase();
  return message.includes("no questions found");
}

function normalizeQuestion(item, type) {
  return {
    id: item.id,
    type: item.type ?? type,
    statement: item.question_text ?? item.statement ?? "",
    classId: item.classId ?? item.class?.id ?? "",
    bookId: item.bookId ?? item.book?.id ?? "",
    chapterId: item.chapterId ?? item.chapter?.id ?? "",
    className: item.className ?? item.class?.name ?? "",
    bookName: item.bookName ?? item.book?.book_name ?? item.book?.name ?? "",
    chapterName:
      item.chapterName ?? item.chapter?.chapter_name ?? item.chapter?.name ?? "",
    options: Array.isArray(item.options) ? item.options : [],
  };
}

function normalizeQuestionList(response, type) {
  if (!Array.isArray(response)) return [];
  return response.map((item) => normalizeQuestion(item, type));
}

async function fetchQuestionType(baseQuery, url, type) {
  const result = await baseQuery({ url, method: "GET" });

  if (result.error) {
    if (isEmptyQuestionsError(result.error)) {
      return { data: [] };
    }
    return { error: result.error };
  }

  return { data: normalizeQuestionList(result.data, type) };
}

export const questionsApi = SplitApiSettings.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const [longResult, shortResult, mcqResult] = await Promise.all([
          fetchQuestionType(baseQuery, API_ENDPOINTS.getLongQuestions, "long"),
          fetchQuestionType(baseQuery, API_ENDPOINTS.getShortQuestions, "short"),
          fetchQuestionType(baseQuery, API_ENDPOINTS.getMcqQuestions, "mcq"),
        ]);

        if (longResult.error) return { error: longResult.error };
        if (shortResult.error) return { error: shortResult.error };
        if (mcqResult.error) return { error: mcqResult.error };

        return {
          data: [
            ...longResult.data,
            ...shortResult.data,
            ...mcqResult.data,
          ],
        };
      },
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((item) => ({ type: "Question", id: item.id })),
              { type: "Question", id: "LIST" },
            ]
          : [{ type: "Question", id: "LIST" }],
    }),

    createLongQuestion: builder.mutation({
      query: (payload) => ({
        url: API_ENDPOINTS.createLongQuestion,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Question", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),

    createShortQuestion: builder.mutation({
      query: (payload) => ({
        url: API_ENDPOINTS.createShortQuestion,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Question", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),

    createMcqQuestion: builder.mutation({
      query: (payload) => ({
        url: API_ENDPOINTS.createMcqQuestion,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [
        { type: "Question", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),

    deleteLongQuestion: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.deleteLongQuestion(id),
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Question", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),

    deleteShortQuestion: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.deleteShortQuestion(id),
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Question", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),

    deleteMcqQuestion: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.deleteMcqQuestion(id),
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Question", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useCreateLongQuestionMutation,
  useCreateShortQuestionMutation,
  useCreateMcqQuestionMutation,
  useDeleteLongQuestionMutation,
  useDeleteShortQuestionMutation,
  useDeleteMcqQuestionMutation,
} = questionsApi;
