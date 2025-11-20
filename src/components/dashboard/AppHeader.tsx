import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const AppHeader = () => {
  return (
    <header className="flex h-[49px] shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
    </header>
  );
};
