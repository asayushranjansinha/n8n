"use client";
import { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo } from "react";
import { PlaceholderNode } from "../placeholder-node";
import { WorkflowNode } from "./WorkflowNode";

const InitialNodeComponent = (props: NodeProps) => {
  return (
    <WorkflowNode name="Initial Node" description="Click to add a node">
      <PlaceholderNode {...props} onClick={() => {}}>
        <div className="flex items-center justify-center">
          <PlusIcon className="size-4" />
        </div>
      </PlaceholderNode>
    </WorkflowNode>
  );
};

export const InitialNode = memo(InitialNodeComponent);
