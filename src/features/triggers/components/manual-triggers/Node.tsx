"use client";

import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";

import { memo } from "react";
import { BaseTriggerNode } from "../BaseTriggerNode";

// TODO: Add onSettings and onDoubleClick functions
const ManualTriggerNodeComponent = (props: NodeProps) => {
  return (
    <BaseTriggerNode
      {...props}
      icon={MousePointerIcon}
      name="When clicking 'Execute Workflow'"
      onSettings={() => {}}
      onDoubleClick={() => {}}
    />
  );
};

export const ManualTriggerNode = memo(ManualTriggerNodeComponent);
ManualTriggerNode.displayName = "ManualTriggerNode";
