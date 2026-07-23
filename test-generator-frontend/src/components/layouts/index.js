/**
 * =============================================================================
 * components/layouts
 * =============================================================================
 * Shared application chrome used by App Router layout files.
 *
 * WHAT BELONGS HERE
 * - Header, Footer, Sidebar, AuthShell, DashboardShell, etc.
 * - Structural wrappers that define how pages are framed — not page content.
 *
 * HOW IT CONNECTS TO APP ROUTER
 * - `app/(auth)/layout.js` and `app/(dashboard)/layout.js` import from here.
 * - Route groups own *which* shell is used; this folder owns *how* the shell
 *   is rendered.
 *
 * WHAT DOES NOT BELONG HERE
 * - Route-level pages (→ app/).
 * - Feature widgets (→ features/<name>/components).
 * - UI primitives like Button (→ components/ui).
 * =============================================================================
 */

export { default as Header } from "./Header";
export { default as Footer } from "./Footer";
export { default as Sidebar } from "./Sidebar";
export { default as AdminSidebar } from "./AdminSidebar";
export { default as AuthShell } from "./AuthShell";
export { default as DashboardShell } from "./DashboardShell";
export { default as BrowseShell } from "./BrowseShell";
