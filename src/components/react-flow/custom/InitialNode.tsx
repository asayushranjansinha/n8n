"use client";

import { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo } from "react";
import { PlaceholderNode } from "../placeholder-node";
import { WorkflowNode } from "./WorkflowNode";
import { NodeSelector } from "./NodeSelector";
import { useState } from "react";

const InitialNodeComponent = (props: NodeProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <WorkflowNode name="Initial Node" description="Click to add a node" showToolbar={props.selected} >
        <PlaceholderNode {...props} onClick={() => setSelectorOpen(true)}>
          <div className="flex items-center justify-center">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
};

export const InitialNode = memo(InitialNodeComponent);
InitialNode.displayName = "InitialNode";
