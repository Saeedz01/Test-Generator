/**
 * =============================================================================
 * store/
 * =============================================================================
 * Redux Toolkit store configuration and the client Provider for App Router.
 *
 * FILES
 * - index.ts      → configureStore, root reducer, middleware (RTK Query)
 * - providers.tsx → client `<Provider>` wrapper used in `app/layout`
 *
 * BOUNDARIES
 * - Store owns global client state + RTK Query cache middleware.
 * - API endpoint definitions live in `services/api`, not here.
 * - Feature-local UI state stays in features (or component state).
 *
 * Wire `StoreProvider` once at the root layout so all routes can use
 * RTK Query hooks. No reducers or middleware are registered yet.
 * =============================================================================
 */

export {};
