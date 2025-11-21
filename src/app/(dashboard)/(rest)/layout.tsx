import type React from "react";
import { AppHeader } from "@/components/dashboard/AppHeader";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="flex-1 flex flex-col">{children}</main>
    </>
  );
}

export default Layout;
