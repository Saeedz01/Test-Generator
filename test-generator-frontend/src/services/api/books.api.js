import { API_ENDPOINTS } from "../apiEnpoint";
import { SplitApiSettings } from "../SplitApiSetting";

function normalizeBooks(response) {
  if (!Array.isArray(response)) return [];
  return response.map((item) => ({
    id: item.id,
    name: item.book_name ?? item.name ?? "",
    classId: item.classId ?? item.class?.id ?? item.class?.classId ?? "",
    description: item.description ?? "",
    edition: item.edition ?? "",
  }));
}

export const booksApi = SplitApiSettings.injectEndpoints({
  endpoints: (builder) => ({
    
    getBooks: builder.query({
      query: () => ({
        url: API_ENDPOINTS.getBooks,
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
      invalidatesTags: [{ type: "Book", id: "LIST" }],
    }),
  }),
});

export const { useGetBooksQuery, useAddBookMutation } = booksApi;
