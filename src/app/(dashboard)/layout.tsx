import type React from "react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireAuth } from "@/lib/auth-utils";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(); //either in each page or in dashboard layout whichever is preferred
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="bg-accent/20 flex-1 flex flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
