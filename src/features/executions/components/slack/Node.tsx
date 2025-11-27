"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useState } from "react";

import { fetchSlackRealtimeToken } from "@/features/executions/actions/slack";
import { BaseExecutionNode } from "@/features/executions/components/BaseExecutionNode";
import { useNodeStatus } from "@/features/executions/hooks/useNodeStatus";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";

import { SlackDialog } from "./Dialog";

type SlackNodeData = {
  variableName: string;
  webhookUrl: string;
  content: string;
};

type SlackNode = Node<SlackNodeData>;

const SlackNodeComponent = ({ id, data, ...props }: NodeProps<SlackNode>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const status = useNodeStatus({
    nodeId: id,
    channel: SLACK_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchSlackRealtimeToken,
  });

  const description = data.content
    ? data.content.slice(0, 50) + (data.content.length > 50 ? "..." : "")
    : "Not Configured";

  const handleOpenSettings = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (values: SlackNodeData) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...values } } : node
        )
      );

      setDialogOpen(false);
    },
    [id, setNodes]
  );

  return (
    <>
      <SlackDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={data}
      />

      <BaseExecutionNode
        id={id}
        icon="/slack.svg"
        name="Slack"
        description={description}
        status={status}
        data={data}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        {...props}
      />
    </>
  );
};

export const SlackNode = memo(SlackNodeComponent);
SlackNode.displayName = "SlackNode";
