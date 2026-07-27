import { API_ENDPOINTS } from "../apiEnpoint";
import { SplitApiSettings } from "../SplitApiSetting";

export const booksApi = SplitApiSettings.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: () => ({
        url: API_ENDPOINTS.getBooks,
        method: "GET",
      }),
    }),

    addBook: builder.mutation({
      query: (newBook) => ({
        url: API_ENDPOINTS.addBook,
        method: "POST",
        body: newBook,
      }),
    }),
  }),
});

export {};
