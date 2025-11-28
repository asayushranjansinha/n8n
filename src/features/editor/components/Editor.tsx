"use client";

import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

import { NodeType } from "@/generated/prisma/enums";

import { ErrorView } from "@/components/entity/ErrorView";
import { LoadingView } from "@/components/entity/LoadingView";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "@/features/editor/components/AddNodeButton";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/useWorkflows";
import { ExecuteWorkflowButton } from "./ExecuteWorkflowButton";

import { editorAtom } from "../store/atoms";

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const { resolvedTheme } = useTheme();

  const setEditor = useSetAtom(editorAtom);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const hasManualTrigger = useMemo(() => {
    return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
  }, [nodes]);

  
  return (
    <div className="h-full w-full">
      <ReactFlow
        colorMode={resolvedTheme === 'dark' ? 'dark' : 'light'}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeComponents}
        proOptions={{
          hideAttribution: true,
        }}
        onInit={setEditor}
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
      >
        <Background />
        <MiniMap />
        <Controls />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};

export const EditorLoading = () => {
  return <LoadingView message="Loading Editor" />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};
