import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.credentials.getMany>;

/**
 * Prefetches credentials for SSR.
 */
export const prefetchcredentials = (params: Input) => {
  return prefetch(trpc.credentials.getMany.queryOptions(params));
};

/**
 * Prefetches workflow by workflowId for SSR.
 */
export const prefetchWorkflow = (credentialId: string) => {
  return prefetch(trpc.credentials.getOne.queryOptions({ id: credentialId }));
};
