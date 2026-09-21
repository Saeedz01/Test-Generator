import { API_ENDPOINTS } from "../apiEnpoint";
import { SplitApiSettings } from "../SplitApiSetting";

export const SEARCH_MIN_LENGTH = 2;

function normalizeSearch(response) {
  return {
    classes: (response?.classes ?? []).map((item) => ({
      id: item.id,
      name: item.name ?? "",
    })),
    books: (response?.books ?? []).map((item) => ({
      id: item.id,
      name: item.name ?? "",
      classId: item.classId ?? "",
      className: item.className ?? "",
    })),
    chapters: (response?.chapters ?? []).map((item) => ({
      id: item.id,
      name: item.name ?? "",
      bookId: item.bookId ?? "",
      bookName: item.bookName ?? "",
      classId: item.classId ?? "",
      className: item.className ?? "",
    })),
    questions: (response?.questions ?? []).map((item) => ({
      id: item.id,
      type: item.type ?? "long",
      text: item.text ?? "",
      textUr: item.textUr ?? "",
      chapterId: item.chapterId ?? "",
      chapterName: item.chapterName ?? "",
      bookId: item.bookId ?? "",
      bookName: item.bookName ?? "",
      classId: item.classId ?? "",
      className: item.className ?? "",
    })),
  };
}

export const searchApi = SplitApiSettings.injectEndpoints({
  endpoints: (builder) => ({
    /** Library-wide search: classes, books, chapters and questions. */
    searchLibrary: builder.query({
      query: (term) => ({
        url: `${API_ENDPOINTS.search}?q=${encodeURIComponent(term)}`,
        method: "GET",
      }),
      transformResponse: (response) => normalizeSearch(response),
      // One cache entry per term; searching again is instant.
      keepUnusedDataFor: 120,
    }),
  }),
});

export const { useSearchLibraryQuery } = searchApi;
