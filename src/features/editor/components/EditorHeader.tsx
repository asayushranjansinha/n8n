"use client";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { EditorBreadcrumbs } from "./EditorBreadcrumbs";
import { EditorSaveButton } from "./EditorSaveButton";

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
  return (
    <header className="flex h-[49px] shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
      <div className="flex flex-row items-center justify-between gap-x-4 w-full">
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </div>
    </header>
  );
};
