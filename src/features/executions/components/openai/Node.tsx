"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useState } from "react";

import { fetchOpenAIRealtimeToken } from "@/features/executions/actions/openai";
import { BaseExecutionNode } from "@/features/executions/components/BaseExecutionNode";
import { useNodeStatus } from "@/features/executions/hooks/useNodeStatus";
import { OPEN_AI_REQUEST_CHANNEL_NAME } from "@/inngest/channels/openai";
import { AVAILABLE_MODELS, OpenAIDialog } from "./Dialog";

type openAIModel = (typeof AVAILABLE_MODELS)[number];
type openAINodeData = {
  variableName?: string;
  model?: openAIModel;
  userPrompt?: string;
  systemPrompt?: string;
};

type openAINode = Node<openAINodeData>;

const OpenAINodeComponent = ({ id, data, ...props }: NodeProps<openAINode>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const status = useNodeStatus({
    nodeId: id,
    channel: OPEN_AI_REQUEST_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchOpenAIRealtimeToken,
  });

  const description = data.userPrompt
    ? data.userPrompt.slice(0, 50) + (data.userPrompt.length > 50 ? "..." : "")
    : "Not Configured";

  const handleOpenSettings = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (values: openAINodeData) => {
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
      <OpenAIDialog
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
        icon="/openai.svg"
        name="Open AI"
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

export const OpenAINode = memo(OpenAINodeComponent);
OpenAINode.displayName = "OpenAINode";
