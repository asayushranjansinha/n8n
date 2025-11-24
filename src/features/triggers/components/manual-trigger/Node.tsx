"use client";

import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";

import { memo, useState } from "react";
import { BaseTriggerNode } from "../BaseTriggerNode";
import { ManualTriggerDialog } from "./Dialog";

// TODO: Add onSettings and onDoubleClick functions
const ManualTriggerNodeComponent = (props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenSettings = () => setDialogOpen(true);

  const status = 'initial';
  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute Workflow'"
        status={status}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
};

export const ManualTriggerNode = memo(ManualTriggerNodeComponent);
ManualTriggerNode.displayName = "ManualTriggerNode";
