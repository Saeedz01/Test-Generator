/**
 * Admin app chrome — header + admin sidebar + content.
 */
import Header from "../Header/Header";
import AdminSidebar from "../AdminSidebar/AdminSidebar";

export default function DashboardShell({ children }) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-neutral-50">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
