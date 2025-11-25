import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import { type LucideIcon } from "lucide-react";
import Image from "next/image";
import React, { memo } from "react";

import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { WorkflowNode } from "@/components/react-flow/custom/WorkflowNode";
import {
  NodeStatus,
  NodeStatusIndicator,
} from "@/components/react-flow/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: React.ReactNode;
  status?: NodeStatus;

  onSettings?: () => void;
  onDoubleClick?: () => void;
}

const BaseTriggerNodeComponent = (props: BaseTriggerNodeProps) => {
  const { setNodes, setEdges } = useReactFlow();

  // Delete a node from the nodes array
  const handleDelete = () => {
    setNodes((currentNodes) => {
      const updatedNodes = currentNodes.filter((node) => node.id !== props.id);
      return updatedNodes;
    });
    setEdges((currentEdges) => {
      const updatedEdges = currentEdges.filter(
        (edge) => edge.source !== props.id && edge.target !== props.id
      );
      return updatedEdges;
    });
  };

  return (
    <WorkflowNode
      showToolbar={props.selected}
      name={props.name}
      description={props.description}
      onSettings={props.onSettings}
      onDelete={handleDelete}
    >
      <NodeStatusIndicator status={props.status} className="rounded-l-2xl">
        <BaseNode
          onDoubleClick={props.onDoubleClick}
          className="rounded-l-2xl relative group"
          status={props.status}
        >
          <BaseNodeContent>
            {typeof props.icon === "string" ? (
              <Image src={props.icon} alt={props.name} width={16} height={16} />
            ) : (
              <props.icon className="size-4" />
            )}
            {props.children}
            <BaseHandle id="source-1" type="source" position={Position.Right} />
          </BaseNodeContent>
        </BaseNode>
      </NodeStatusIndicator>
    </WorkflowNode>
  );
};

export const BaseTriggerNode = memo(BaseTriggerNodeComponent);
BaseTriggerNode.displayName = "BaseTriggerNode";
