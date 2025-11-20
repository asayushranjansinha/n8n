import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowSearchParams } from "./useWorkflowSearchParams";

/**
 * Hook to fetch workflows with Suspense
 */
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowSearchParams();
  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

/**
 * Hook to create new workflow
 */
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess(data) {
        toast.success(`Workflow ${data.name} created successfully`, {
          description: "Redirecting to Workflow Page",
        });
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
      onError(error) {
        toast.error(`Failed to create workflow`, {
          description: error.message,
        });
      },
    })
  );
};
