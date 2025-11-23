"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  Background,
  MiniMap,
  Controls,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useSuspenseWorkflow } from "@/features/workflows/hooks/useWorkflows";
import { LoadingView } from "@/components/entity/LoadingView";
import { ErrorView } from "@/components/entity/ErrorView";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "@/components/react-flow/custom/AddNodeButton";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const setEditor = useSetAtom(editorAtom)

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

  return (
    <div className="h-full w-full">
      <ReactFlow
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
        snapGrid={[10,10]}
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
