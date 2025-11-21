import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
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

/**
 * Hook to remove workflow
 */
export const useRemoveWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess(data) {
        toast.success(`Workflow ${data.name} removed successfully`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
      },
      onError(error) {
        toast.error(`Failed to delete workflow`, {
          description: error.message,
        });
      },
    })
  );
};

/**
 * Hook to fetch workflow by id with Suspense
 */
export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};

/**
 * Hook to update workflow name
 */
export const useUpdateWorkflowName = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess(data) {
        toast.success(`Workflow ${data.name} updated successfully`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id })
        );
      },
      onError(error) {
        toast.error(`Failed to update workflow name`, {
          description: error.message,
        });
      },
    })
  );
};
