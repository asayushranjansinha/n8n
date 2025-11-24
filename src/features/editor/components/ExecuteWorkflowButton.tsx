
import { FlaskConicalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/useWorkflows";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();

  const handleExecute = () => {
    executeWorkflow.mutate({ id: workflowId });
  };
  return (
    <Button
      onClick={handleExecute}
      disabled={executeWorkflow.isPending}
      size="lg"
    >
      <FlaskConicalIcon className="size-4" />
      Execute Workflow
    </Button>
  );
};
