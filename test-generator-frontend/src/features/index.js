/**
 * =============================================================================
 * features
 * =============================================================================
 * Feature-based (domain) modules — the primary unit of frontend scalability.
 *
 * Each feature mirrors a NestJS backend module where possible (auth, questions,
 * books, chapters, classes, admin, dashboard) and owns its UI, hooks, and utils.
 *
 * STANDARD FEATURE SHAPE
 *   features/<name>/
 *     components/   → feature-specific UI
 *     hooks/        → feature-specific React hooks
 *     utils/        → feature-specific helpers
 *     index.js      → public barrel — only export what other layers may use
 *
 * RULES
 * - Features may import from components/, utils/, constants/, types/, hooks/,
 *   services/ (RTK Query hooks), and store/.
 * - Network/API definitions live in `services/api`, NOT inside features.
 * - Features should NOT import from other features' private internals.
 * - Prefer importing another feature only via its barrel.
 * - App Router pages (`app/`) stay thin: compose feature components, no logic.
 *
 * Dummy data may be imported temporarily from `@/data` during UI scaffolding.
 * =============================================================================
 */

export {};
