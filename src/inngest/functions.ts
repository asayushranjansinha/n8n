import { NonRetriableError } from "inngest";

import {
  AllowedNodeTypes,
  getExecutor,
} from "@/features/executions/lib/executor-registry";
import prisma from "@/lib/database";
import { anthropicChannel } from "./channels/anthropic";
import { geminiChannel } from "./channels/gemini";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { inngest } from "./client";
import { topologicalSort } from "./utils";
import { openAiChannel } from "./channels/openai";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", retries: 0 },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      anthropicChannel(),
      openAiChannel()
    ],
  },
  async ({ event, step, publish }) => {
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

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    let context = event.data.initialData || {};

    // Find userID
    const workflow = await prisma.workflow.findUniqueOrThrow({
      where: { id: workflowId },
      include: {
        user: true,
      },
    });
    const userId = workflow.user.id;

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as AllowedNodeTypes);

      if (!executor) {
        continue;
      }

      context = await executor({
        data: node.data,
        nodeId: node.id,
        context,
        userId,
        step,
        publish,
      });
    }

    return { workflowId, result: context };
  }
);
