"use client";
import React from "react";

import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface WorkflowNodeProps {
  children: React.ReactNode;
  showToolbar?: boolean;
  name?: string;
  description?: string;
  onSettings?: () => void;
  onDelete?: () => void;
}
export const WorkflowNode = ({
  children,
  showToolbar,
  name,
  description,
  onSettings,
  onDelete,
}: WorkflowNodeProps) => {
  return (
    <>
      {showToolbar && (
        <NodeToolbar isVisible>
          <Button onClick={onSettings} size="icon-sm" variant="ghost">
            <SettingsIcon className="size-4" />
          </Button>
          <Button onClick={onDelete} size="icon-sm" variant="ghost">
            <TrashIcon className="size-4" />
          </Button>
        </NodeToolbar>
      )}

      {children}

      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-[200px] text-center"
        >
          <p className="font-medium ">{name}</p>
          {description && (
            <p className="text-muted-foreground truncate text-sm">
              {description}
            </p>
          )}
        </NodeToolbar>
      )}
    </>
  );
};
