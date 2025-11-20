import { useQueryStates } from "nuqs";
import { workflowsSearchParams } from "../params";

export const useWorkflowSearchParams = () => {
  return useQueryStates(workflowsSearchParams);
};
