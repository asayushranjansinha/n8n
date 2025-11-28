import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  ExecutionsError,
  ExecutionsLoading,
} from "@/features/executions/components/execution-history/ExecutionList";
import { ExecutionView } from "@/features/executions/components/execution-history/ExecutionView";
import { prefetchExecution } from "@/features/executions/server/prefetch";

type PageProps = {
  params: Promise<{ executionId: string }>;
};

const ExecutionIdPage = async ({ params }: PageProps) => {
  const { executionId } = await params;

  prefetchExecution(executionId);
  return (
    <div className="p-4 flex-1 flex flex-col gap-4">
      <ErrorBoundary fallback={<ExecutionsError />}>
        <Suspense fallback={<ExecutionsLoading />}>
          <ExecutionView />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default ExecutionIdPage;
