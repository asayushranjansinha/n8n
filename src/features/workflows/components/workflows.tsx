"use client";
import { formatDistanceToNow } from "date-fns";
import { WorkflowIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { EmptyEntity } from "@/components/entity/EmptyEntity";
import { EntityContainer } from "@/components/entity/EntityContainer";
import { EntityHeader } from "@/components/entity/EntityHeader";
import { EntityItem } from "@/components/entity/EntityItem";
import { EntityList } from "@/components/entity/EntityList";
import { EntityPagination } from "@/components/entity/EntityPagination";
import { EntitySearch } from "@/components/entity/EntitySearch";
import { ErrorView } from "@/components/entity/ErrorView";
import { LoadingView } from "@/components/entity/LoadingView";
import type { Workflow } from "@/generated/prisma/client";
import { useEntitySearch } from "@/hooks/useEntitySearch";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";
import { useWorkflowSearchParams } from "../hooks/useWorkflowSearchParams";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useSuspenseWorkflows,
} from "../hooks/useWorkflows";

export const WorkflowList = () => {
  const { data } = useSuspenseWorkflows();
  return (
    <EntityList
      items={data.items}
      getKey={(workflow) => workflow.id}
      emptyView={<WorkflowEmpty />}
      renderItem={(workflow) => <WorkflowItem data={workflow} />}
    />
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

export const WorkflowsLoading = () => {
  return <LoadingView message="Loading Workflows..." />;
};
export const WorkflowsError = () => {
  return <ErrorView message="Error Loading Workflows..." />;
};

export const WorkflowEmpty = () => {
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
      <EmptyEntity
        onNew={handleCreateWorkflow}
        message="You haven't created any workflows yet, create one first to start working."
        title="No Workflows Found"
      />
    </>
  );
};

export const WorkflowItem = ({ data }: { data: Workflow }) => {
  const removeWorkflow = useRemoveWorkflow();
  const handleCreateWorkflow = () => {
    removeWorkflow.mutate({ id: data.id });
  };
  return (
    <EntityItem
      href={`/workflows/${data.id}`}
      title={data.name}
      image={
        <div className="size-8 flex items-center justify-center ">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      isRemoving={removeWorkflow.isPending}
      onRemove={handleCreateWorkflow}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
    />
  );
};
