import { inngest } from "@/inngest/client";

import prisma from "@/lib/database";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query((opts) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    // await inngest.send({
    //   name: "test/pipeline",
    // });

    return {
      success: true,
      message: "Started to create workflow",
      description: "Please wait a moment, Do not refresh the page.",
    };
  }),

  test_ai: protectedProcedure.mutation(async () => {
    const result = await inngest.send({
      name: "execute/ai",
    });
    return {
      success: true,
      message: "Job Queued",
      description: "Please wait for a moment to complete.",
    };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
