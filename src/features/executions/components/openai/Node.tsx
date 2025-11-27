"use client";

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useCallback, useState } from "react";

import { fetchOpenAIRealtimeToken } from "@/features/executions/actions/openai";
import { BaseExecutionNode } from "@/features/executions/components/BaseExecutionNode";
import { OPENAI_AVAILABLE_MODELS } from "@/features/executions/constants/openai";
import { useNodeStatus } from "@/features/executions/hooks/useNodeStatus";
import { OPEN_AI_REQUEST_CHANNEL_NAME } from "@/inngest/channels/openai";
import { OpenAiDialog } from "./Dialog";

type OpenAIModel = (typeof OPENAI_AVAILABLE_MODELS)[number];
type OpenAiNodeData = {
  model?: OpenAIModel;
  credentialId?: string;
  userPrompt?: string;
  systemPrompt?: string;
  variableName?: string;
};

type OpenAiNode = Node<OpenAiNodeData>;

const OpenAiNodeComponent = ({ id, data, ...props }: NodeProps<OpenAiNode>) => {
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
    (values: OpenAiNodeData) => {
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
      <OpenAiDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={data}
      />

      <BaseExecutionNode
        id={id}
        icon="/openai.svg"
        name="OpenAI"
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

export const OpenAiNode = memo(OpenAiNodeComponent);
OpenAiNode.displayName = "OpenAiNode";
