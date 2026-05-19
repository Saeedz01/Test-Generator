import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

/** Wraps routed pages with global chrome (header/footer). */
export function MainShell({ children }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
    </div>
  );
}
