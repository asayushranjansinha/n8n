"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useState } from "react";

import { fetchDiscordRealtimeToken } from "@/features/executions/actions/discord";
import { BaseExecutionNode } from "@/features/executions/components/BaseExecutionNode";
import { useNodeStatus } from "@/features/executions/hooks/useNodeStatus";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";

import { DiscordDialog } from "./Dialog";

type DiscordNodeData = {
  variableName: string;
  webhookUrl: string;
  content: string;
  username?: string;
};

type DiscordNode = Node<DiscordNodeData>;

const DiscordNodeComponent = ({
  id,
  data,
  ...props
}: NodeProps<DiscordNode>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const status = useNodeStatus({
    nodeId: id,
    channel: DISCORD_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchDiscordRealtimeToken,
  });

  const description = data.content
    ? data.content.slice(0, 50) + (data.content.length > 50 ? "..." : "")
    : "Not Configured";

  const handleOpenSettings = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (values: DiscordNodeData) => {
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
      <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={data}
      />

      <BaseExecutionNode
        id={id}
        icon="/discord.svg"
        name="Discord"
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

export const DiscordNode = memo(DiscordNodeComponent);
DiscordNode.displayName = "DiscordNode";
