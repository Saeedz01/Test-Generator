import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/api`,
  credentials: "include",
});

function requestUrl(args) {
  return typeof args === "string" ? args : args?.url || "";
}

async function baseQueryWithReauth(args, api, extraOptions) {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status !== 401) {
    return result;
  }

  const url = String(requestUrl(args));
  if (url.includes("auth/login") || url.includes("auth/refresh")) {
    return result;
  }

  const refresh = await rawBaseQuery(
    { url: "auth/refresh", method: "POST" },
    api,
    extraOptions,
  );
  if (refresh.error) {
    return result;
  }

  return rawBaseQuery(args, api, extraOptions);
}

export const SplitApiSettings = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "SchoolClass",
    "Book",
    "Chapter",
    "Question",
    "DashboardStats",
    "Auth",
    "AdminUser",
  ],
  endpoints: () => ({}),
});
