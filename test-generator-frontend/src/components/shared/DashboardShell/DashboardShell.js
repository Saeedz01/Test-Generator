"use client";

import DashboardHeader from "../DashboardHeader/DashboardHeader";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import { DashboardAuthGuard } from "@/app/(dashboard)/dashboard/features/DashboardAuthGuard";

export default function DashboardShell({ children }) {
  return (
    <DashboardAuthGuard>
      <div className="flex min-h-full flex-1 flex-col bg-neutral-50">
        <DashboardHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardAuthGuard>
  );
}
