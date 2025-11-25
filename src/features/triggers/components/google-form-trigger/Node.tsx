"use client";

import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";

import { BaseTriggerNode } from "../BaseTriggerNode";
import { GoogleFormTriggerDialog } from "./Dialog";

import { useNodeStatus } from "@/features/executions/hooks/useNodeStatus";
import { fetchGoogleFormTriggerRealtimeToken } from "@/features/triggers/actions/google-form-trigger";
import { GOOGLE_FORM_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger";

const GoogleFormTriggerComponent = ({ id, ...props }: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const status = useNodeStatus({
    nodeId: id,
    channel: GOOGLE_FORM_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  });
  
  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        id={id}
        icon={"/googleform.svg"}
        name="Google Form"
        description="When form is submitted"
        status={status}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
};

export const GoogleFormTriggerNode = memo(GoogleFormTriggerComponent);
GoogleFormTriggerNode.displayName = "GoogleFormTriggerNode";
