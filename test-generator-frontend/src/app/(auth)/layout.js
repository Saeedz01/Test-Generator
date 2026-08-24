/**
 * Auth route group layout — shared AuthShell for all auth pages.
 */
import { AuthShell } from "@/components/shared";

export default function AuthLayout({ children }) {
  return <AuthShell>{children}</AuthShell>;
}
