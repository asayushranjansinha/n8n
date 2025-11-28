"use client";

import { useSuspenseExecutions } from "@/features/executions/hooks/useExecutions";
import { useExecutionSearchParams } from "@/features/executions/hooks/useExecutionSearchParams";

import { EntityPagination } from "@/components/entity/EntityPagination";

export const ExecutionPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionSearchParams();
  return (
    <EntityPagination
      disabled={executions.isFetching}
      totalPages={executions.data.totalPages}
      page={executions.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};
