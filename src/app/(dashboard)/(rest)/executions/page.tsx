import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  ExecutionList,
  ExecutionsError,
  ExecutionsLoading,
} from "@/features/executions/components/execution-history/ExecutionList";
import { ExecutionListContainer } from "@/features/executions/components/execution-history/ExecutionListContainer";

import { executionParamsLoader } from "@/features/executions/server/params-loader";
import { prefetchExecutions } from "@/features/executions/server/prefetch";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const ExecutionsPage = async ({ searchParams }: PageProps) => {
  const params = await executionParamsLoader(searchParams);
  prefetchExecutions(params);
  return (
    <ExecutionListContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<ExecutionsError />}>
          <Suspense fallback={<ExecutionsLoading />}>
            <ExecutionList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ExecutionListContainer>
  );
};

export default ExecutionsPage;
