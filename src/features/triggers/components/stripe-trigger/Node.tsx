"use client";

import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";

import { BaseTriggerNode } from "../BaseTriggerNode";
import { StripeTriggerDialog } from "./Dialog";

import { useNodeStatus } from "@/features/executions/hooks/useNodeStatus";
import { fetchStripeTriggerRealtimeToken } from "@/features/triggers/actions/stripe-trigger";
import { STRIPE_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger";

const StripeTriggerNodeComponent = ({ id, ...props }: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const status = useNodeStatus({
    nodeId: id,
    channel: STRIPE_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchStripeTriggerRealtimeToken,
  });
  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        id={id}
        icon={"/stripe.svg"}
        name="Stripe"
        description="When stripe event is captured"
        status={status}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
};

export const StripeTriggerNode = memo(StripeTriggerNodeComponent);
StripeTriggerNode.displayName = "StripeTriggerNode";
