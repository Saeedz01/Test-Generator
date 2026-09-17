import { API_ENDPOINTS } from "../apiEnpoint";
import { SplitApiSettings } from "../SplitApiSetting";

function buildChaptersUrl(arg) {
  const bookId = typeof arg === "string" ? arg : arg?.bookId;
  const classId = typeof arg === "object" && arg ? arg.classId : undefined;
  const params = new URLSearchParams();

  if (bookId) params.set("bookId", bookId);
  if (classId) params.set("classId", classId);

  const query = params.toString();
  if (!query) return API_ENDPOINTS.getChapters;

  const separator = API_ENDPOINTS.getChapters.includes("?") ? "&" : "?";
  return `${API_ENDPOINTS.getChapters}${separator}${query}`;
}

function normalizeChapters(response) {
  if (!Array.isArray(response)) return [];
  return response.map((item) => ({
    id: item.id,
    name: item.name ?? item.chapter_name ?? "",
    classId: item.classId ?? item.class?.id ?? "",
    className: item.className ?? item.class?.name ?? "",
    bookId: item.bookId ?? item.book?.id ?? "",
    bookName: item.bookName ?? item.book?.book_name ?? item.book?.name ?? "",
    order: item.order ?? 0,
    description: item.description ?? "",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
}

export const chaptersApi = SplitApiSettings.injectEndpoints({
  endpoints: (builder) => ({
    getChapters: builder.query({
      query: (arg) => ({
        url: buildChaptersUrl(arg),
        method: "GET",
      }),
      transformResponse: (response) => normalizeChapters(response),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((item) => ({ type: "Chapter", id: item.id })),
              { type: "Chapter", id: "LIST" },
            ]
          : [{ type: "Chapter", id: "LIST" }],
    }),
    addChapter: builder.mutation({
      query: (newChapter) => ({
        url: API_ENDPOINTS.addChapter,
        method: "POST",
        body: newChapter,
      }),
      invalidatesTags: [
        { type: "Chapter", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),

    updateChapter: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: API_ENDPOINTS.updateChapter(id),
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Chapter", id },
        { type: "Chapter", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),

    deleteChapter: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.deleteChapter(id),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Chapter", id },
        { type: "Chapter", id: "LIST" },
        { type: "Question", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),
  }),
});

export const {
  useGetChaptersQuery,
  useAddChapterMutation,
  useUpdateChapterMutation,
  useDeleteChapterMutation,
} = chaptersApi;
