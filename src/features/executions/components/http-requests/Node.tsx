"use client";

import { Node, NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";

import { BaseExecutionNode } from "@/features/executions/components/BaseExecutionNode";
import { memo } from "react";

type HttpRequestNodeData = {
  endpoint?: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
  [x: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

const HttpRequestNodeComponent = (props: NodeProps<HttpRequestNodeType>) => {
  const nodeData = props.data as HttpRequestNodeData;
  const description = nodeData.endpoint
    ? `${nodeData.method || "GET"}:${nodeData.endpoint}`
    : "Not Configured";
  return (
    <BaseExecutionNode
      icon={GlobeIcon}
      name="HTTP Request"
      description={description}
      onDoubleClick={() => {}}
      onSettings={() => {}}
      {...props}
    />
  );
};

export const HttpRequestNode = memo(HttpRequestNodeComponent);
HttpRequestNode.displayName = "HttpRequestNode";
