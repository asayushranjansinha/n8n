import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.executions.getMany>;

/**
 * Prefetches executions for SSR.
 */
export const prefetchExecutions = (params: Input) => {
  return prefetch(trpc.executions.getMany.queryOptions(params));
};

/**
 * Prefetches execution by executionId for SSR.
 */
export const prefetchExecution = (executionId: string) => {
  return prefetch(trpc.executions.getOne.queryOptions({ id: executionId }));
};
