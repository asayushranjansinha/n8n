import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NonRetriableError } from "inngest";

import {
  AllowedNodeTypes,
  getExecutor,
} from "@/features/executions/lib/executor-registry";
import prisma from "@/lib/database";
import { geminiChannel } from "./channels/gemini";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { inngest } from "./client";
import { topologicalSort } from "./utils";

const google = createGoogleGenerativeAI();

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", retries: 0 }, //TODO: Remove on production
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    console.log("🚀 executeWorkflow triggered with event:", event);

    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Missing WorkflowID");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      console.log("📦 Loaded workflow:", {
        id: workflowId,
        nodeCount: workflow.nodes.length,
        connectionCount: workflow.connections.length,
        nodes: workflow.nodes,
        connections: workflow.connections,
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    console.log(
      "🔀 Sorted nodes:",
      sortedNodes.map((n) => ({
        id: n.id,
        type: n.type,
        data: n.data,
      }))
    );
    // Initialize the context with initial data from the trigger
    let context = event.data.initialData || {};

    // Execute each node
    for (const node of sortedNodes) {
      console.log("▶️ Executing node:", {
        id: node.id,
        type: node.type,
        data: node.data,
        contextBefore: context,
      });

      const executor = getExecutor(node.type as AllowedNodeTypes);

      if (!executor) {
        // skip initial or unsupported nodes
        console.log("⏭️ No executor found. Skipping:", node.id, node.type);
        continue;
      }

      console.log("Data in ingest function: ", node.data);
      context = await executor({
        data: node.data,
        nodeId: node.id,
        context,
        step,
        publish,
      });
    }

    return { workflowId, result: context };
  }
);
