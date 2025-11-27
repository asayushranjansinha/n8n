import { useQueryStates } from "nuqs";
import { credentialsSearchParams } from "../params";


export const useCredentialsSearchParams = () => {
  return useQueryStates(credentialsSearchParams);
};
