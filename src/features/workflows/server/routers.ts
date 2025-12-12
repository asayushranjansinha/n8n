import type { Edge, Node } from "@xyflow/react";
import * as z from "zod";
import { TRPCError } from "@trpc/server"; // <-- IMPORT TRPCError

import { PAGINATION } from "@/config/constants";

import { NodeType } from "@/generated/prisma";
import { sendWorkflowExecution } from "@/inngest/utils";
import prisma from "@/lib/database";
import { generateWorkflowName } from "@/lib/random-name-util";
import {
  createTRPCRouter,
  protectedProcedure,
  subscriptionRequiredProcedure,
} from "@/trpc/init";

export const workflowsRouter = createTRPCRouter({
  execute: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log(`[EXECUTE] Starting execution for workflow ID: ${input.id}`);
      try {
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
        });

        console.log(`[EXECUTE] Found workflow: ${workflow.name}`);

        // Replaced direct use of inngest with this
        await sendWorkflowExecution({
          workflowId: input.id,
          initialData: {},
        });

        console.log(`[EXECUTE] Successfully triggered Inngest job for ${input.id}`);
        return workflow;
      } catch (error) {
        console.error(`[EXECUTE_ERROR] Failed to execute workflow ${input.id}:`, error);
        // Re-throw or throw a more specific TRPCError
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to execute workflow due to server or database error.",
        });
      }
    }),

  // THIS IS THE PROCEDURE LIKELY FAILING DUE TO SUBSCRIPTION ISSUES
  create: subscriptionRequiredProcedure.mutation(async ({ ctx }) => { // <-- Made async to use try/catch
    console.log(`[CREATE] Attempting to create new workflow for user ${ctx.auth.user.id}`);
    
    // The main failure point is likely within `subscriptionRequiredProcedure` 
    // (middleware) but we can catch any subsequent error (like DB connection failure).
    try {
        const randomName = generateWorkflowName();
        console.log(`[CREATE] Generated name: ${randomName}`);

        const newWorkflow = await prisma.workflow.create({
          data: {
            name: randomName,
            userId: ctx.auth.user.id,
            nodes: {
              create: {
                type: NodeType.INITIAL,
                position: { x: 0, y: 0 },
                name: NodeType.INITIAL,
              },
            },
          },
        });
        console.log(`[CREATE] Successfully created workflow ID: ${newWorkflow.id}`);
        return newWorkflow;
    } catch (error) {
        // This will only catch errors AFTER the subscription check passes.
        console.error(`[CREATE_ERROR] Database operation failed during workflow creation:`, error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database error while creating workflow.",
        });
    }
  }),

  remove: subscriptionRequiredProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(`[REMOVE] Attempting to delete workflow ID: ${input.id}`);
      try {
        const deleted = await prisma.workflow.delete({
          where: {
            id: input.id,
            userId: ctx.auth.user.id,
          },
        });
        console.log(`[REMOVE] Successfully deleted workflow ID: ${deleted.id}`);
        return deleted;
      } catch (error) {
        console.error(`[REMOVE_ERROR] Failed to delete workflow ${input.id}:`, error);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found or user unauthorized.",
        });
      }
    }),

  updateName: subscriptionRequiredProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(`[UPDATE_NAME] Updating workflow ${input.id} to name: ${input.name}`);
      try {
        const updated = await prisma.workflow.update({
          where: { id: input.id, userId: ctx.auth.user.id },
          data: { name: input.name },
        });
        console.log(`[UPDATE_NAME] Successfully updated name for ${updated.id}`);
        return updated;
      } catch (error) {
        console.error(`[UPDATE_NAME_ERROR] Failed to update name for ${input.id}:`, error);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found or user unauthorized.",
        });
      }
    }),

  update: subscriptionRequiredProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({
              x: z.number(),
              y: z.number(),
            }),
            data: z.record(z.string(), z.any()).optional(),
          })
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, nodes, edges } = input;
      console.log(`[UPDATE] Starting update for workflow ID: ${id}`);
      console.log(`[UPDATE] Received ${nodes.length} nodes and ${edges.length} edges.`);

      try {
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where: { id, userId: ctx.auth.user.id },
        });

        // Start Transaction
        const transaction = await prisma.$transaction(async (tx) => {
          console.log(`[UPDATE_TX] Starting transaction for workflow ${id}`);
          // Delete existing nodes and connections
          await tx.connection.deleteMany({ where: { workflowId: id } });
          await tx.node.deleteMany({ where: { workflowId: id } });
          console.log(`[UPDATE_TX] Deleted old nodes/connections.`);

          // Create new nodes
          await tx.node.createMany({
            data: nodes.map((node) => ({
              id: node.id,
              workflowId: id,
              name: node.type || "unknown",
              type: node.type as NodeType,
              position: node.position,
              data: node.data || {},
            })),
          });
          console.log(`[UPDATE_TX] Created ${nodes.length} new nodes.`);

          // Create new connections
          await tx.connection.createMany({
            data: edges.map((edge) => ({
              workflowId: id,
              fromNodeId: edge.source,
              toNodeId: edge.target,
              fromOutput: edge.sourceHandle || "main",
              toInput: edge.targetHandle || "main",
            })),
          });
          console.log(`[UPDATE_TX] Created ${edges.length} new connections.`);


          // Update workflow updatedAt
          await tx.workflow.update({
            where: { id },
            data: { updatedAt: new Date() },
          });

          console.log(`[UPDATE_TX] Transaction finished successfully.`);
        });
        
        return workflow;
      } catch (error) {
        console.error(`[UPDATE_ERROR] Transaction failed for workflow ${id}:`, error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update workflow data.",
        });
      }
    }),
  
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log(`[GET_ONE] Fetching workflow ID: ${input.id}`);
      try {
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where: { id: input.id, userId: ctx.auth.user.id },
          include: { nodes: true, connections: true },
        });

        // Transform server nodes into react flow type
        const nodes: Node[] = workflow.nodes.map((node) => ({
          id: node.id,
          type: node.type,
          data: (node.data as Record<string, unknown>) || {},
          position: node.position as { x: number; y: number },
        }));

        // Transform connection to react-flow compatible edges
        const edges: Edge[] = workflow.connections.map((connection) => ({
          id: connection.id,
          source: connection.fromNodeId,
          target: connection.toNodeId,
          sourceHandle: connection.fromOutput,
          targetHandle: connection.toInput,
        }));
        
        console.log(`[GET_ONE] Found ${nodes.length} nodes and ${edges.length} edges.`);

        return {
          id: workflow.id,
          name: workflow.name,
          nodes,
          edges,
        };
      } catch (error) {
        console.error(`[GET_ONE_ERROR] Failed to retrieve workflow ${input.id}:`, error);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found or user unauthorized.",
        });
      }
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      console.log(`[GET_MANY] Fetching page ${page}, size ${pageSize}. Search: '${search}'`);

      try {
        const [items, totalCount] = await Promise.all([
          prisma.workflow.findMany({
            where: {
              userId: ctx.auth.user.id,
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
              updatedAt: "desc",
            },
          }),

          prisma.workflow.count({
            where: {
              userId: ctx.auth.user.id,
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          }),
        ]);

        const totalPages = Math.ceil(totalCount / pageSize);
        console.log(`[GET_MANY] Found ${totalCount} total workflows. Returning ${items.length} items.`);
        
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
          items,
          page,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        };
      } catch (error) {
        console.error(`[GET_MANY_ERROR] Failed to retrieve workflow list:`, error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to load workflow list.",
        });
      }
    }),
});