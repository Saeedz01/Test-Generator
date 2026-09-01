import { API_ENDPOINTS } from "../apiEnpoint";
import { SplitApiSettings } from "../SplitApiSetting";

function normalizeUser(response) {
  if (!response) return null;
  return {
    id: response.id,
    email: response.email ?? "",
    name: response.name ?? "",
    role: response.role ?? "",
    isSuspended: Boolean(response.isSuspended),
  };
}

function normalizeAdminList(response) {
  if (!Array.isArray(response)) return [];
  return response.map((item) => ({
    id: item.id,
    email: item.email ?? "",
    name: item.name ?? "",
    role: item.role ?? "admin",
    isSuspended: Boolean(item.isSuspended),
  }));
}

export const authApi = SplitApiSettings.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: API_ENDPOINTS.login,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response) => normalizeUser(response?.user ?? response),
      invalidatesTags: [{ type: "Auth", id: "ME" }],
    }),

    getMe: builder.query({
      query: () => ({
        url: API_ENDPOINTS.getMe,
        method: "GET",
      }),
      transformResponse: (response) => normalizeUser(response),
      providesTags: [{ type: "Auth", id: "ME" }],
    }),

    logout: builder.mutation({
      query: () => ({
        url: API_ENDPOINTS.logout,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Auth", id: "ME" }],
    }),

    getAdmins: builder.query({
      query: () => ({
        url: API_ENDPOINTS.getAdmins,
        method: "GET",
      }),
      transformResponse: (response) => normalizeAdminList(response),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((item) => ({ type: "AdminUser", id: item.id })),
              { type: "AdminUser", id: "LIST" },
            ]
          : [{ type: "AdminUser", id: "LIST" }],
    }),

    createAdmin: builder.mutation({
      query: (payload) => ({
        url: API_ENDPOINTS.createAdmin,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "AdminUser", id: "LIST" }],
    }),

    suspendAdmin: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.suspendAdmin(id),
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "AdminUser", id },
        { type: "AdminUser", id: "LIST" },
      ],
    }),

    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: API_ENDPOINTS.deleteAdmin(id),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "AdminUser", id },
        { type: "AdminUser", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
  useGetAdminsQuery,
  useCreateAdminMutation,
  useSuspendAdminMutation,
  useDeleteAdminMutation,
} = authApi;
