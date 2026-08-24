/**
 * Dashboard route group layout — shared DashboardShell for authenticated pages.
 */
import { DashboardShell } from "@/components/shared";

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
