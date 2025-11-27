import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

import { CredentialType } from "@/generated/prisma/enums";
import { useCredentialsSearchParams } from "./useCredentialSearchParams";

/**
 * Hook to fetch Credentials with Suspense
 */
export const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialsSearchParams();
  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};

/**
 * Hook to create new credential
 */
export const useCreateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess(data) {
        toast.success(`Credential ${data.name} created successfully`, {
          description: "Redirecting to Credential Page",
        });
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
      },
      onError(error) {
        toast.error(`Failed to create credential`, {
          description: error.message,
        });
      },
    })
  );
};

/**
 * Hook to remove credential
 */
export const useRemoveCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess(data) {
        toast.success(`Credential ${data.name} removed successfully`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
      },
      onError(error) {
        toast.error(`Failed to delete credential`, {
          description: error.message,
        });
      },
    })
  );
};

/**
 * Hook to fetch Credential by id with Suspense
 */
export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
};

/**
 * Hook to update credential
 */
export const useUpdateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess(data) {
        toast.success(`Credential ${data.name} saved successfully`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id })
        );
      },
      onError(error) {
        toast.error(`Failed to save credential`, {
          description: error.message,
        });
      },
    })
  );
};

/**
 * Hook to fetch Credentials by type
 */
export const useCredentialsByType = (type: CredentialType) => {
  const trpc = useTRPC();
  return useQuery(trpc.credentials.getByType.queryOptions({ type }));
};
