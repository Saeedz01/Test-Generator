/**
 * =============================================================================
 * hooks/
 * =============================================================================
 * Shared React hooks used by multiple features or routes.
 *
 * WHAT BELONGS HERE
 * - Cross-cutting hooks: useMediaQuery, useDebounce, useLocalStorage, etc.
 * - Thin wrappers around shared browser / UI concerns
 *
 * WHAT DOES NOT BELONG HERE
 * - Feature-specific hooks (→ features/<name>/hooks)
 * - RTK Query generated hooks (→ services/api/*.api.ts)
 * - Redux store setup (→ store/)
 *
 * Prefer colocating domain hooks inside the owning feature folder.
 * =============================================================================
 */

export {};
