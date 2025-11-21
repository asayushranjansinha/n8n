import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.workflows.getMany>;

/**
 * Prefetches workflows for SSR.
 */
export const prefetchWorkflows = (params: Input) => {
  return prefetch(trpc.workflows.getMany.queryOptions(params));
};

/**
 * Prefetches workflow by workflowId for SSR.
 */
export const prefetchWorkflow = (workflowId: string) => {
  return prefetch(trpc.workflows.getOne.queryOptions({ id: workflowId }));
};
