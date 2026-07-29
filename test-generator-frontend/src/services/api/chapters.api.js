import { API_ENDPOINTS } from "../apiEnpoint";
import { SplitApiSettings } from "../SplitApiSetting";

export const chaptersApi = SplitApiSettings.injectEndpoints({
  endpoints: (builder) => ({
    getChapters: builder.query({
      query: () => ({
        url: API_ENDPOINTS.getChapters,
        method: "GET",
      }),
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
      invalidatesTags: [{ type: "Chapter", id: "LIST" }],
    }),
  }),
});

export const { useGetChaptersQuery, useAddChapterMutation } = chaptersApi;
