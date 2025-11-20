import { AppHeader } from "@/components/dashboard/AppHeader";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="flex-1 flex flex-col">{children}</main>
    </>
  );
}

export default Layout;
