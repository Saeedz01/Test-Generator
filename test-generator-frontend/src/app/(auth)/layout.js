/**
 * Auth route group layout — shared AuthShell for all auth pages.
 */
import { AuthShell } from "@/components/shared";

/** Private surface — keep it out of search results. */
export const metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }) {
  return <AuthShell>{children}</AuthShell>;
}
