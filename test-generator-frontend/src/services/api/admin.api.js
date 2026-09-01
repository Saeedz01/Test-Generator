import { API_ENDPOINTS } from "../apiEnpoint";
import { SplitApiSettings } from "../SplitApiSetting";

function normalizeDashboardStats(response) {
  return {
    classes: Number(response?.classes ?? 0),
    books: Number(response?.books ?? 0),
    chapters: Number(response?.chapters ?? 0),
    questions: Number(response?.questions ?? 0),
  };
}

export const adminApi = SplitApiSettings.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardStats: builder.query({
      query: () => ({
        url: API_ENDPOINTS.getAdminDashboardStats,
        method: "GET",
      }),
      transformResponse: (response) => normalizeDashboardStats(response),
      providesTags: [{ type: "DashboardStats", id: "SUMMARY" }],
    }),
  }),
});

export const { useGetAdminDashboardStatsQuery } = adminApi;
