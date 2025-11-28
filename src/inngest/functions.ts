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
import { discordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";
import { ExecutionStatus } from "@/generated/prisma/enums";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0,

    onFailure: async ({ event, step, error }) => {
      return prisma.execution.update({
        where: {
          inngestEventId: event.data.event.id,
        },
        data: {
          status: ExecutionStatus.FAILED,
          error: error.message,
          errorStack: error.stack,
          completedAt: new Date(),
        },
      });
    },
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      anthropicChannel(),
      openAiChannel(),
      discordChannel(),
      slackChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;
    const inngestId = event.id;

    if (!inngestId) {
      throw new NonRetriableError("Missing Inngest ID");
    }

    if (!workflowId) {
      throw new NonRetriableError("Missing WorkflowID");
    }

    // Create execution
    await step.run("create-execution", async () => {
      return await prisma.execution.create({
        data: {
          inngestEventId: inngestId,
          workflowId,
        },
      });
    });

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

    await step.run("update-execution", async () => {
      return await prisma.execution.update({
        where: {
          inngestEventId: inngestId,
        },
        data: {
          status: ExecutionStatus.COMPLETED,
          output: context,
          completedAt: new Date(),
        },
      });
    });

    return { workflowId, result: context };
  }
);
