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

    addBook: builder.mutation({
      query: (newBook) => ({
        url: API_ENDPOINTS.addBook,
        method: "POST",
        body: newBook,
      }),
      invalidatesTags: [
        { type: "Book", id: "LIST" },
        { type: "DashboardStats", id: "SUMMARY" },
      ],
    }),
  }),
});

export const { useGetBooksQuery, useAddBookMutation } = booksApi;
