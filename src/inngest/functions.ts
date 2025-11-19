import prisma from "@/lib/database";
import { inngest } from "./client";

export const testPipeline = inngest.createFunction(
  { id: "test-pipeline" },
  { event: "test/pipeline" },
  async ({ step }) => {
    await step.run("get-video", async () => {
      await new Promise((res) => setTimeout(res, 5_000));
      return "dummy-video";
    });

    await step.run("transcribe-video", async () => {
      await new Promise((res) => setTimeout(res, 5_000));
      return "dummy-transcript";
    });

    await step.run("send-to-ai", async () => {
      await new Promise((res) => setTimeout(res, 5_000));
      return "dummy-ai-response";
    });

    // Move the database operation inside a step
    const workflow = await step.run("create-workflow", async () => {
      return prisma.workflow.create({
        data: {
          name: "test pipeline workflow",
        },
      });
    });

    return { success: true, workflowId: workflow.id };
  }
);