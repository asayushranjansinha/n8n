"use client";

import { memo, useState } from "react";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";

import { HttpRequestDialog } from "./Dialog";
import { BaseExecutionNode } from "@/features/executions/components/BaseExecutionNode";

type HttpRequestNodeData = {
  endpoint?: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

const HttpRequestNodeComponent = ({
  data,
  ...props
}: NodeProps<HttpRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const description = data.endpoint
    ? `${data.method || "GET"}:${data.endpoint}`
    : "Not Configured";

  const { setNodes } = useReactFlow();

  const status = "initial";
  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: {
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;
  }) => {
    setNodes((nodes) => {
      return nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              endpoint: values.endpoint,
              method: values.method,
              body: values.body,
            },
          };
        }
        return node;
      });
    });
    setDialogOpen(false);
  };

  return (
    <>
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultEndpoint={data.endpoint}
        defaultMethod={data.method}
      />
      <BaseExecutionNode
        icon={GlobeIcon}
        data={data}
        name="HTTP Request"
        description={description}
        status={status}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
        {...props}
      />
    </>
  );
};

export const HttpRequestNode = memo(HttpRequestNodeComponent);
HttpRequestNode.displayName = "HttpRequestNode";
