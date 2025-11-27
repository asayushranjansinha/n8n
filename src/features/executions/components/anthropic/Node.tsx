"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useState } from "react";

import { fetchAnthropicRealtimeToken } from "@/features/executions/actions/anthropic";
import { BaseExecutionNode } from "@/features/executions/components/BaseExecutionNode";
import { ANTHROPIC_AVAILABLE_MODELS } from "@/features/executions/constants/anthropic";
import { useNodeStatus } from "@/features/executions/hooks/useNodeStatus";
import { ANTHROPIC_REQUEST_CHANNEL_NAME } from "@/inngest/channels/anthropic";
import { AnthropicDialog } from "./Dialog";

type AnthropicModel = (typeof ANTHROPIC_AVAILABLE_MODELS)[number];
type AnthropicNodeData = {
  model?: AnthropicModel;
  credentialId?: string;
  userPrompt?: string;
  systemPrompt?: string;
  variableName?: string;
};

type AnthropicNode = Node<AnthropicNodeData>;

const AnthropicNodeComponent = ({ id, data, ...props }: NodeProps<AnthropicNode>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const status = useNodeStatus({
    nodeId: id,
    channel: ANTHROPIC_REQUEST_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchAnthropicRealtimeToken,
  });

  const description = data.userPrompt
    ? data.userPrompt.slice(0, 50) + (data.userPrompt.length > 50 ? "..." : "")
    : "Not Configured";

  const handleOpenSettings = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (values: AnthropicNodeData) => {
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
      <AnthropicDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={data}
      />

      <BaseExecutionNode
        id={id}
        icon="/anthropic.svg"
        name="Anthropic"
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

export const AnthropicNode = memo(AnthropicNodeComponent);
AnthropicNode.displayName = "AnthropicNode";
