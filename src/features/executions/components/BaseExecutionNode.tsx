import { type NodeProps, Position } from "@xyflow/react";
import { type LucideIcon } from "lucide-react";
import React from "react";
import Image from "next/image";
import { memo } from "react";

import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/react-flow/custom/WorkflowNode";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";

interface BaseExecutionNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: React.ReactNode;
  //   status?: NodeStatus;

  onSettings?: () => void;
  onDoubleClick?: () => void;
}

const BaseExecutionNodeComponent = (props: BaseExecutionNodeProps) => {
  // TODO: Add Delete function
  const handleDelete = () => {};
  return (
    <WorkflowNode
      showToolbar={props.selected}
      name={props.name}
      description={props.description}
      onSettings={props.onSettings}
      onDelete={handleDelete}
    >
      <BaseNode onDoubleClick={props.onDoubleClick}>
        <BaseNodeContent>
          {typeof props.icon === "string" ? (
            <Image src={props.icon} alt={props.name} width={16} height={16} />
          ) : (
            <props.icon className="size-4" />
          )}
          {props.children}
          <BaseHandle id="target-1" type="target" position={Position.Left} />
          <BaseHandle id="source-1" type="source" position={Position.Right} />
        </BaseNodeContent>
      </BaseNode>
    </WorkflowNode>
  );
};

export const BaseExecutionNode = memo(BaseExecutionNodeComponent);
BaseExecutionNode.displayName = "BaseExecutionNode";
