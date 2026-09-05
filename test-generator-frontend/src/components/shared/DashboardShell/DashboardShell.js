"use client";

import { useState } from "react";
import DashboardHeader from "../DashboardHeader/DashboardHeader";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import { DashboardAuthGuard } from "@/app/(dashboard)/dashboard/features/DashboardAuthGuard";
import { ConfirmHost } from "@/app/(dashboard)/dashboard/features/ConfirmDialog/ConfirmDialog";

export default function DashboardShell({ children }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <DashboardAuthGuard>
      <div className="flex min-h-full flex-1 flex-col bg-neutral-50">
        <DashboardHeader
          menuOpen={navOpen}
          onMenuClick={() => setNavOpen(true)}
        />
        <div className="flex flex-1">
          <AdminSidebar open={navOpen} onClose={() => setNavOpen(false)} />
          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
        <ConfirmHost />
      </div>
    </DashboardAuthGuard>
  );
}
