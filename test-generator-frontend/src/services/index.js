/**
 * =============================================================================
 * services/
 * =============================================================================
 * Backend integration layer for the NestJS API, powered by RTK Query.
 *
 * WHAT BELONGS HERE
 * - RTK Query `createApi` base configuration
 * - Feature endpoint slices that inject into the base API
 * - Shared tag types, base query helpers, and prepareHeaders (later)
 *
 * WHAT DOES NOT BELONG HERE
 * - React components or feature UI (→ features/)
 * - Redux store wiring (→ store/)
 * - Pure helpers with no network I/O (→ utils/)
 * - Dummy fixtures (→ data/)
 *
 * ORGANIZATION
 *   services/api/
 *     baseApi.ts       → shared createApi instance
 *     auth.api.ts      → auth endpoints
 *     classes.api.ts   → class endpoints
 *     books.api.ts     → book endpoints
 *     chapters.api.ts  → chapter endpoints
 *     questions.api.ts → question endpoints
 *
 * App Router pages and features consume generated hooks from these slices.
 * Do not place API clients under lib/ or features/<name>/api.
 * =============================================================================
 */

export {};
