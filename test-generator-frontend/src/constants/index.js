/**
 * =============================================================================
 * constants
 * =============================================================================
 * Application-wide static values and configuration keys.
 *
 * WHAT BELONGS HERE
 * - Route paths, query keys, pagination defaults, role names, status enums,
 *   feature flags, and other immutable config that is not environment-secret.
 *
 * WHAT DOES NOT BELONG HERE
 * - Secrets / API keys (use `.env.local` + `process.env`).
 * - Mutable state or runtime-computed values.
 * - Dummy datasets (→ data/).
 *
 * Prefer named exports grouped by domain file (e.g. routes.js, roles.js).
 * =============================================================================
 */

export { ROUTES } from "./routes";
export { ROLES } from "./roles";
