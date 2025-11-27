"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useState } from "react";

import { fetchGeminiRealtimeToken } from "@/features/executions/actions/gemini";
import { BaseExecutionNode } from "@/features/executions/components/BaseExecutionNode";
import { GEMINI_AVAILABLE_MODELS } from "@/features/executions/constants/gemini";
import { useNodeStatus } from "@/features/executions/hooks/useNodeStatus";
import { GEMINI_REQUEST_CHANNEL_NAME } from "@/inngest/channels/gemini";
import { GeminiDialog } from "./Dialog";

type GeminiModel = (typeof GEMINI_AVAILABLE_MODELS)[number];
type GeminiNodeData = {
  variableName?: string;
  model?: GeminiModel;
  userPrompt?: string;
  systemPrompt?: string;
};

type GeminiNode = Node<GeminiNodeData>;

const GeminiNodeComponent = ({ id, data, ...props }: NodeProps<GeminiNode>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const status = useNodeStatus({
    nodeId: id,
    channel: GEMINI_REQUEST_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchGeminiRealtimeToken,
  });

  const description = data.userPrompt
    ? data.userPrompt.slice(0, 50) + (data.userPrompt.length > 50 ? "..." : "")
    : "Not Configured";

  const handleOpenSettings = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (values: GeminiNodeData) => {
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
      <GeminiDialog
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
        icon="/gemini.svg"
        name="Gemini"
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

export const GeminiNode = memo(GeminiNodeComponent);
GeminiNode.displayName = "GeminiNode";
