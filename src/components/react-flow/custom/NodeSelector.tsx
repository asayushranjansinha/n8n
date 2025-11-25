"use client";
import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import React, { useCallback } from "react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { NodeType } from "@/generated/prisma/enums";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Manual Trigger",
    description: "Runs the flow when activated manually.",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "Runs the flow when a google form is submitted.",
    icon: '/googleform.svg',
  },
];

export const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make a request to an external service.",
    icon: GlobeIcon,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const NodeSelector = ({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) => {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      const nodes = getNodes();

      // Prevent duplicate manual triggers
      if (selection.type === "MANUAL_TRIGGER") {
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER
        );

        if (hasManualTrigger) {
          toast.error("Only one manual trigger is allowed in a workflow.");
          return;
        }
      }

      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAL
        );

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const position = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          data: {},
          position,
          type: selection.type,
        };

        return hasInitialTrigger ? [newNode] : [...nodes, newNode];
      });

      // Close sheet
      onOpenChange(false);
    },
    [getNodes, setNodes, onOpenChange, screenToFlowPosition]
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="sm:max-w-md w-full overflow-y-auto bg-background border-l shadow-2xl"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold tracking-tight">
            Add a Workflow Trigger
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            A workflow starts when one of these triggers runs.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 p-6 pt-0">
          {/* Trigger Section */}
          <div>
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wide">
              Triggers
            </h3>
            <div className="space-y-2">
              {triggerNodes.map((node) => {
                const Icon = node.icon;
                return (
                  <button
                    key={node.type}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/20 hover:border-primary transition-all text-left"
                    )}
                    onClick={() => {
                      handleNodeSelect(node);
                    }}
                  >
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        className="size-6 object-contain"
                        alt={node.label}
                      />
                    ) : (
                      <Icon className="size-5 text-primary" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{node.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {node.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Execution Section */}
          <div>
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wide">
              Actions
            </h3>
            <div className="space-y-2">
              {executionNodes.map((node) => {
                const Icon = node.icon;
                return (
                  <button
                    key={node.type}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/20 hover:border-primary transition-all text-left"
                    )}
                    onClick={() => {
                      handleNodeSelect(node);
                    }}
                  >
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        className="size-6 object-contain"
                        alt={node.label}
                      />
                    ) : (
                      <Icon className="size-5 text-primary" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{node.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {node.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
