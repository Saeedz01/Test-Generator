/**
 * Public / marketing route group layout.
 * Wraps landing pages with shared public chrome (header + footer).
 */
import { Footer, Header } from "@/components/shared";

export default function MarketingLayout({ children }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
