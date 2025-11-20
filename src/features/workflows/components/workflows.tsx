"use client";

import { EntityContainer } from "@/components/entity/EntityContainer";
import { EntityHeader } from "@/components/entity/EntityHeader";
import { EntityPagination } from "@/components/entity/EntityPagination";
import { EntitySearch } from "@/components/entity/EntitySearch";
import { useEntitySearch } from "@/hooks/useEntitySearch";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";
import { useRouter } from "next/navigation";
import React from "react";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/useWorkflows";
import { useWorkflowSearchParams } from "../hooks/useWorkflowSearchParams";

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
      search={<WorkflowSearch />}
      pagination={<WorkflowPagination />}
    >
      {children}
    </EntityContainer>
  );
};

const WorkflowSearch = () => {
  const [params, setParams] = useWorkflowSearchParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Workflows"
    />
  );
};

const WorkflowPagination = () => {
  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowSearchParams();
  return (
    <EntityPagination
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPages}
      page={workflows.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};
