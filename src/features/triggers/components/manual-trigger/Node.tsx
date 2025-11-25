"use client";

import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";

import { BaseTriggerNode } from "../BaseTriggerNode";
import { ManualTriggerDialog } from "./Dialog";
import { useNodeStatus } from "@/features/executions/hooks/useNodeStatus";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";
import { fetchHttpRequestRealtimeToken } from "@/features/executions/actions/http-request/action";

// TODO: Add onSettings and onDoubleClick functions
const ManualTriggerNodeComponent = ({ id, ...props }: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const status = useNodeStatus({
    nodeId: id,
    channel: MANUAL_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchHttpRequestRealtimeToken,
  });
  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        id={id}
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
