import { API_ENDPOINTS } from "../apiEnpoint";
import { SplitApiSettings } from "../SplitApiSetting";

function asClassList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.classes)) return response.classes;
  return [];
}

export const schoolclassApi = SplitApiSettings.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query({
      query: () => ({
        url: API_ENDPOINTS.getClasses,
        method: "GET",
      }),
      transformResponse: (response) => asClassList(response),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((item) => ({ type: "SchoolClass", id: item.id })),
              { type: "SchoolClass", id: "LIST" },
            ]
          : [{ type: "SchoolClass", id: "LIST" }],
    }),

    addClass: builder.mutation({
      query: (newClass) => ({
        url: API_ENDPOINTS.addSchoolClass,
        method: "POST",
        body: newClass,
      }),
      invalidatesTags: [{ type: "SchoolClass", id: "LIST" }],
    }),
  }),
});

export const { useGetClassesQuery, useAddClassMutation } = schoolclassApi;
