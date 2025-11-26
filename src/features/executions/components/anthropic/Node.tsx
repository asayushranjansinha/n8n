"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useState } from "react";

import { fetchAnthropicRealtimeToken } from "@/features/executions/actions/anthropic";
import { BaseExecutionNode } from "@/features/executions/components/BaseExecutionNode";
import { useNodeStatus } from "@/features/executions/hooks/useNodeStatus";
import { ANTHROPIC_REQUEST_CHANNEL_NAME } from "@/inngest/channels/anthropic";
import { AVAILABLE_MODELS, AnthropicDialog } from "./Dialog";

type AnthropicModel = (typeof AVAILABLE_MODELS)[number];
type anthropicNodeData = {
  variableName?: string;
  model?: AnthropicModel;
  userPrompt?: string;
  systemPrompt?: string;
};

type anthropicNode = Node<anthropicNodeData>;

const AnthropicNodeComponent = ({ id, data, ...props }: NodeProps<anthropicNode>) => {
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
    (values: anthropicNodeData) => {
      // Log the old data and the new submitted values
      console.log("Before update:", { old: data, incoming: values });

      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...values } } : node
        )
      );

      setDialogOpen(false);
    },
    [id, setNodes, data]
  );

  return (
    <>
      <AnthropicDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={{
          model: data.model,
          systemPrompt: data.systemPrompt,
          userPrompt: data.userPrompt,
          variableName: data.variableName,
        }}
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
