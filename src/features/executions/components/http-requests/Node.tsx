"use client";
import { memo, useState, useCallback } from "react";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";

import { HttpRequestDialog } from "./Dialog";
import { BaseExecutionNode } from "@/features/executions/components/BaseExecutionNode";

type HttpRequestNodeData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

type HttpRequestNode = Node<HttpRequestNodeData>;

const HttpRequestNodeComponent = ({
  id,
  data,
  ...props
}: NodeProps<HttpRequestNode>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const description = data.endpoint
    ? `${data.method}:${data.endpoint}`
    : "Not Configured";

  const handleOpenSettings = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(
    (values: HttpRequestNodeData) => {
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
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={{
          endpoint: data.endpoint ?? "",
          method: data.method ?? "GET",
          body: data.body ?? "",
        }}
      />

      <BaseExecutionNode
        id={id}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        status="initial"
        data={data}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        {...props}
      />
    </>
  );
};

export const HttpRequestNode = memo(HttpRequestNodeComponent);
HttpRequestNode.displayName = "HttpRequestNode";
