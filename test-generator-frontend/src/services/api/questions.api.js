import { API_ENDPOINTS } from "../apiEnpoint";
import { SplitApiSettings } from "../SplitApiSetting";
import {
  MAX_PAGE_SIZE,
  fetchAllQuestionPages,
  fetchQuestionPage,
} from "./questionsPaging";

const QUESTION_TYPES = [
  { type: "long", url: API_ENDPOINTS.getLongQuestions },
  { type: "short", url: API_ENDPOINTS.getShortQuestions },
  { type: "mcq", url: API_ENDPOINTS.getMcqQuestions },
];

function questionScopeParams(arg) {
  const params = typeof arg === "string" ? { chapterId: arg } : arg || {};
  return {
    chapterId: params.chapterId,
    bookId: params.bookId,
    classId: params.classId,
  };
}

function questionListTags(items, arg) {
  const scope =
    (typeof arg === "object" &&
      (arg?.chapterId || arg?.bookId || arg?.classId)) ||
    "ALL";
  return [
    ...(items ?? []).map((item) => ({ type: "Question", id: item.id })),
    { type: "Question", id: "LIST" },
    { type: "Question", id: `SCOPE-${scope}` },
  ];
}

export const questionsApi = SplitApiSettings.injectEndpoints({
  endpoints: (builder) => ({
    /** Every question in scope (all pages of long, short, and MCQ). */
    getQuestions: builder.query({
      async queryFn(arg = {}, _queryApi, _extraOptions, baseQuery) {
        const params = questionScopeParams(arg);
        const results = await Promise.all(
          QUESTION_TYPES.map(({ type, url }) =>
            fetchAllQuestionPages(baseQuery, url, params, type),
          ),
        );

        const failed = results.find((result) => result.error);
        if (failed) return { error: failed.error };

        return { data: results.flatMap((result) => result.data) };
      },
      providesTags: (result, _error, arg) => questionListTags(result, arg),
    }),

    /**
     * One page per question type (optionally a single `type`), merged.
     * `meta.total` sums backend totals; `meta.totalPages` is the largest type's.
     */
    getQuestionsPage: builder.query({
      async queryFn(arg = {}, _queryApi, _extraOptions, baseQuery) {
        const params = {
          ...questionScopeParams(arg),
          page: Math.max(1, Number(arg?.page) || 1),
          limit: Math.min(MAX_PAGE_SIZE, Number(arg?.limit) || 50),
        };
        const types = QUESTION_TYPES.filter(
          ({ type }) => !arg?.type || arg.type === type,
        );
        const results = await Promise.all(
          types.map(({ type, url }) =>
            fetchQuestionPage(baseQuery, url, params, type),
          ),
        );

        const failed = results.find((result) => result.error);
        if (failed) return { error: failed.error };

        const metas = results.map((result) => result.data.meta);
        return {
          data: {
            items: results.flatMap((result) => result.data.items),
            meta: {
              total: metas.reduce((sum, meta) => sum + meta.total, 0),
              page: params.page,
              limit: params.limit,
              totalPages: Math.max(1, ...metas.map((meta) => meta.totalPages)),
            },
          },
        };
      },
      providesTags: (result, _error, arg) =>
        questionListTags(result?.items, arg),
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

    updateLongQuestion: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: API_ENDPOINTS.updateLongQuestion(id),
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Question", id },
        { type: "Question", id: "LIST" },
      ],
    }),

    updateShortQuestion: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: API_ENDPOINTS.updateShortQuestion(id),
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Question", id },
        { type: "Question", id: "LIST" },
      ],
    }),

    updateMcqQuestion: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: API_ENDPOINTS.updateMcqQuestion(id),
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Question", id },
        { type: "Question", id: "LIST" },
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
  useGetQuestionsPageQuery,
  useCreateLongQuestionMutation,
  useCreateShortQuestionMutation,
  useCreateMcqQuestionMutation,
  useUpdateLongQuestionMutation,
  useUpdateShortQuestionMutation,
  useUpdateMcqQuestionMutation,
  useDeleteLongQuestionMutation,
  useDeleteShortQuestionMutation,
  useDeleteMcqQuestionMutation,
} = questionsApi;
