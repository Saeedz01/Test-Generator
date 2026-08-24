/**
 * Browse shell — public class/test flow (no admin sidebar).
 */
import Header from "../Header/Header";

export default function BrowseShell({ children }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-neutral-50">
      <Header />
      <main className="mx-auto min-w-0 w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
