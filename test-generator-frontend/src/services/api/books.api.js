import { API_ENDPOINTS } from "../apiEnpoint";
import { SplitApiSettings } from "../SplitApiSetting";

function buildBooksUrl(classId) {
  if (!classId) return API_ENDPOINTS.getBooks;
  const separator = API_ENDPOINTS.getBooks.includes("?") ? "&" : "?";
  return `${API_ENDPOINTS.getBooks}${separator}classId=${encodeURIComponent(classId)}`;
}

function normalizeBooks(response) {
  if (!Array.isArray(response)) return [];
  return response.map((item) => ({
    deletedAt: item.deletedAt ?? null,
    id: item.id,
    name: item.book_name ?? item.name ?? "",
    classId: item.classId ?? item.class?.id ?? item.class?.classId ?? "",
    className: item.class_name ?? item.class?.name ?? "",
    description: item.description ?? "",
    edition: item.edition ?? "",
    subject: item.edition?.trim() || "General",
    author: item.class_name ?? item.className ?? item.class?.name ?? "",
    chaptersCount: Number(item.chaptersCount ?? 0),
  }));
}

export const booksApi = SplitApiSettings.injectEndpoints({
  endpoints: (builder) => ({
    
    getBooks: builder.query({
      query: (classId) => ({
        url: buildBooksUrl(classId),
        method: "GET",
      }),
      transformResponse: (response) => normalizeBooks(response),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((item) => ({ type: "Book", id: item.id })),
              { type: "Book", id: "LIST" },
            ]
          : [{ type: "Book", id: "LIST" }],
    }),

    /** Soft-deleted books (admin only), for restoring. */
    getDeletedBooks: builder.query({
      query: () => ({
        url: API_ENDPOINTS.getDeletedBooks,
        method: "GET",
      }),
      transformResponse: (response) => normalizeBooks(response),
      providesTags: [{ type: "Book", id: "DELETED" }],
    }),

    restoreBook: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.restoreBook(id),
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Book", id },
        { type: "Book", id: "LIST" },
        { type: "Book", id: "DELETED" },
        { type: "SchoolClass", id: "LIST" },
        { type: "Chapter", id: "LIST" },
        { type: "Question", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),

    addBook: builder.mutation({
      query: (newBook) => ({
        url: API_ENDPOINTS.addBook,
        method: "POST",
        body: newBook,
      }),
      invalidatesTags: [
        { type: "Book", id: "LIST" },
        { type: "SchoolClass", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),

    updateBook: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: API_ENDPOINTS.updateBook(id),
        method: "PATCH",
        body: payload,
      }),
      // Chapters and questions embed the book name.
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Book", id },
        { type: "Book", id: "LIST" },
        { type: "Chapter", id: "LIST" },
        { type: "Question", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),

    /** Soft delete: hides the book and its content; restorable. */
    deleteBook: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.deleteBook(id),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Book", id },
        { type: "Book", id: "LIST" },
        { type: "Book", id: "DELETED" },
        { type: "SchoolClass", id: "LIST" },
        { type: "Chapter", id: "LIST" },
        { type: "Question", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetDeletedBooksQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useRestoreBookMutation,
} = booksApi;
