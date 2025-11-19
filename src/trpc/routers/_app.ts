import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/database";
export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query((opts) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/pipeline",
    });

    return {
      success: true,
      message: "Started to create workflow",
      description: "Please wait a moment, Do not refresh the page.",
    };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
