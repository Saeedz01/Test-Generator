import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ROUTES } from "@/constants/routes";
import { clearUser } from "@/store/authSlice";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/api`,
  credentials: "include",
});

function requestUrl(args) {
  return typeof args === "string" ? args : args?.url || "";
}

/** Shared in-flight refresh so concurrent 401s trigger a single /auth/refresh. */
let refreshPromise = null;

function refreshSession(api, extraOptions) {
  if (!refreshPromise) {
    // Detach from the first caller's AbortSignal: other waiters share this call.
    refreshPromise = rawBaseQuery(
      { url: "auth/refresh", method: "POST" },
      { ...api, signal: undefined },
      extraOptions,
    ).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function isSessionRejected(error) {
  return error?.status === 401 || error?.status === 403;
}

function endSession(api) {
  api.dispatch(clearUser());
  if (
    typeof window !== "undefined" &&
    window.location.pathname.startsWith(ROUTES.DASHBOARD)
  ) {
    window.location.replace(ROUTES.LOGIN);
  }
}

async function baseQueryWithReauth(args, api, extraOptions) {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status !== 401) {
    return result;
  }

  const url = String(requestUrl(args));
  if (
    url.includes("auth/login") ||
    url.includes("auth/refresh") ||
    url.includes("auth/logout")
  ) {
    return result;
  }

  const refresh = await refreshSession(api, extraOptions);
  if (refresh.error) {
    if (isSessionRejected(refresh.error)) {
      endSession(api);
    }
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
