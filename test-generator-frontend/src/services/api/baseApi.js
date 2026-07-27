/**
 * =============================================================================
 * services/api/baseApi.ts
 * =============================================================================
 * Shared RTK Query API instance for all NestJS backend calls.
 *
 * INTENDED RESPONSIBILITIES (implement later)
 * - `createApi` with `fetchBaseQuery` / custom baseQuery
 * - `baseUrl` from `NEXT_PUBLIC_API_URL`
 * - Auth header injection (JWT / cookies)
 * - Global tag types for cache invalidation
 *
 * Feature files (`*.api.ts`) inject endpoints into this base API via
 * `baseApi.injectEndpoints(...)`.
 *
 * No endpoint definitions or business logic live here yet.
 * =============================================================================
 */

export {};
