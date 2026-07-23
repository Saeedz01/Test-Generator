/**
 * =============================================================================
 * utils
 * =============================================================================
 * Pure, framework-agnostic helper functions shared across the app.
 *
 * WHAT BELONGS HERE
 * - Formatting, class-name helpers (`cn`), validators, mappers
 *
 * WHAT DOES NOT BELONG HERE
 * - RTK Query / HTTP (→ services/api)
 * - Redux store setup (→ store/)
 * - React hooks (→ hooks/ or features/<name>/hooks)
 * - Feature-only helpers (→ features/<name>/utils)
 * - Hard-coded product values (→ constants)
 *
 * Keep functions small, typed (JSDoc/TS), and side-effect free when possible.
 * =============================================================================
 */

export { cn } from "./cn";
