"use client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const createWorkflow = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: (data) => {
        // Show toast
        toast.success(data.message, {
          description: data.description,
        });
      },
    })
  );

  return (
    <div>
      <p>{JSON.stringify(data, null, 2)}</p>
      <Button
        disabled={createWorkflow.isPending}
        onClick={() => createWorkflow.mutate()}
      >
        Create New Workflow
      </Button>
    </div>
  );
};

export default HomePage;
