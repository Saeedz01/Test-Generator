/**
 * Auth route group layout — shared AuthShell for all auth pages.
 */
import { AuthShell } from "@/components/layouts";

export default function AuthLayout({ children }) {
  return <AuthShell>{children}</AuthShell>;
}
