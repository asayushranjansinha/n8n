import { useQueryStates } from "nuqs";
import { executionSearchParams } from "../params";


export const useExecutionSearchParams = () => {
  return useQueryStates(executionSearchParams);
};
