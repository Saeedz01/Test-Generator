/**
 * Authenticated app chrome — header + sidebar + main content region.
 * @param {{ children: import("react").ReactNode }} props
 */
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardShell({ children }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
