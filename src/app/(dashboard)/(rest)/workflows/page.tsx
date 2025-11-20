import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";

import {
  WorkflowList,
  WorkflowListContainer,
} from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";

const WorkflowsPage = async () => {
  prefetchWorkflows();

  return (
    <WorkflowListContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<div>Error</div>}>
          <Suspense fallback={<div>Loading....</div>}>
            <WorkflowList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowListContainer>
  );
};

export default WorkflowsPage;
