import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";
import { Editor } from "@/features/editor/components/Editor";
import { EditorHeader } from "@/features/editor/components/EditorHeader";

type PageProps = {
  params: Promise<{ workflowId: string }>;
};

const WorkflowIdPage = async ({ params }: PageProps) => {
  const { workflowId } = await params;
  prefetchWorkflow(workflowId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <EditorHeader workflowId={workflowId} />
          <main className="flex-1 flex flex-col">
            <Editor workflowId={workflowId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default WorkflowIdPage;
