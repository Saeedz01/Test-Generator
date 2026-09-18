/**
 * Dashboard route group layout — shared DashboardShell for authenticated pages.
 */
import { DashboardShell } from "@/components/shared";

/** Private surface — keep it out of search results. */
export const metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
