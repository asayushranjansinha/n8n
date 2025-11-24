// import { Connection, Node } from "@xyflow/react";
import { Connection, Node } from "@/generated/prisma/client";
import toposort from "toposort";
import { includes, string } from "zod";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  // if no connections return node as is,(there are no connections)

  if (connections.length === 0) {
    return nodes;
  }

  // Create array for edges
  const edges: [string, string][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ]);

  // Add nodes with no connection as self-edges to ensure they're included
  const connectionNodeIds = new Set<string>();
  for (const connection of connections) {
    connectionNodeIds.add(connection.fromNodeId);
    connectionNodeIds.add(connection.toNodeId);
  }

  for (const node of nodes) {
    if (!connectionNodeIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  // Perform topological sort
  let sortedNodeIds: string[];

  try {
    sortedNodeIds = toposort(edges);

    // Remove duplicate (from self edge)
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains a cycle");
    }
    throw error;
  }

  //   Map Sorted Ids to back node object
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};
