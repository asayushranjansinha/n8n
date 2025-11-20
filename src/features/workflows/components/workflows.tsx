"use client";
import React from "react";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/useWorkflows";
import { EntityHeader } from "@/components/entity/EntityHeader";
import { EntityContainer } from "@/components/entity/EntityContainer";
import { useRouter } from "next/navigation";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";

export const WorkflowList = () => {
  const { data, isLoading, error, isError } = useSuspenseWorkflows();

  return (
    <div className="flex-1 border-2 bg-red-400/20">
      <p>{JSON.stringify(data, null, 2)}</p>
    </div>
  );
};

export const WorkflowListHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const router = useRouter();

  const handleCreateWorkflow = () => {
    createWorkflow.mutate(undefined, {
      onError(error) {
        handleError(error);
      },
      onSuccess(data) {
        router.push(`/workflows/${data.id}`);
      },
    });
  };
  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        onNew={handleCreateWorkflow}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowListContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowListHeader />}
      search={<div>Search</div>}
      pagination={<div>Pagination</div>}
    >
      {children}
    </EntityContainer>
  );
};
