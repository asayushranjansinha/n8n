"use client";

import { formatDistanceToNow } from "date-fns";

import type { Execution } from "@/generated/prisma/client";
import { ExecutionStatus } from "@/generated/prisma/enums";

import { EmptyEntity } from "@/components/entity/EmptyEntity";
import { EntityItem } from "@/components/entity/EntityItem";
import { EntityList } from "@/components/entity/EntityList";
import { ErrorView } from "@/components/entity/ErrorView";
import { LoadingView } from "@/components/entity/LoadingView";

import { useSuspenseExecutions } from "@/features/executions/hooks/useExecutions";
import {
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  XCircleIcon,
} from "lucide-react";

export const ExecutionList = () => {
  const { data } = useSuspenseExecutions();
  return (
    <EntityList
      items={data.items}
      getKey={(execution) => execution.id}
      emptyView={<ExecutionEmpty />}
      renderItem={(execution) => <ExecutionItem data={execution} />}
    />
  );
};

export const ExecutionEmpty = () => {
  return (
    <EmptyEntity
      message="You haven't created any executions yet, start by running a workflow."
      title="No Executions Found"
    />
  );
};

export const ExecutionItem = ({
  data,
}: {
  data: Execution & {
    workflow: {
      id: string;
      name: string;
    };
  };
}) => {
  const duration = data.completedAt
    ? Math.round((data.completedAt.getTime() - data.startedAt.getTime()) / 1000)
    : "Not Completed";
    
  const subtitle = (
    <>
      {data.workflow.name}
      <span className="mx-1">•</span>
      <span>Started {formatDistanceToNow(data.startedAt)}</span>

      {typeof duration === "number" && (
        <>
          <span className="mx-1">•</span>
          <span>Duration {duration}s</span>
        </>
      )}

      {typeof duration === "string" && duration === "Not Completed" && (
        <>
          <span className="mx-1">•</span>
          <span>Not Completed</span>
        </>
      )}
    </>
  );

  const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
      case ExecutionStatus.COMPLETED:
        return <CheckCircleIcon className="size-5 text-emerald-600" />;
      case ExecutionStatus.FAILED:
        return <XCircleIcon className="size-5 text-red-600" />;
      case ExecutionStatus.RUNNING:
        return <PlayIcon className="size-5 text-blue-600 animate-spin" />;
      default:
        return <ClockIcon className="size-5 text-muted-foreground" />;
    }
  };
  return (
    <EntityItem
      href={`/executions/${data.id}`}
      title={data.status}
      subtitle={subtitle}
      image={getStatusIcon(data.status)}
    />
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView message="Loading Executions..." />;
};
export const ExecutionsError = () => {
  return <ErrorView message="Error Loading Executions..." />;
};
